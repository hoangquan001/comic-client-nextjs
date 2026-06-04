'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Menu, MoreVertical, Send, Smile, X } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { useConversations, useMessages, useSendMessage } from '@/lib/hooks/use-chat-queries';
import { config } from '@/lib/config';
import Markdown from '@/components/common/markdown/markdown';
import EmojiPicker from '@/components/common/emoji/emoji-picker';
import { Chanel } from '@/types';
import type { IConversation, IMessage, IServiceResponse } from '@/types';
import { toast } from 'sonner';

interface ChatBoxProps {
  isVisible: boolean;
  onClose: () => void;
  defaultChannel?: Chanel;
}

const BOT_INIT_AVATAR = '/option4.png';
const DEFAULT_AVATAR = '/default_avatar.jpg';
const API_BASE_URL = `${config.BASE_URL.replace(/\/$/, '')}/api`;

function formatDate(value?: string) {
  if (!value) return '';
  return new Date(value).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ChatBox({ isVisible, onClose, defaultChannel = Chanel.Bot }: ChatBoxProps) {
  const { user, isAuthenticated, getToken } = useAuthStore();
  const [textMessage, setTextMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [botMessages, setBotMessages] = useState<IMessage[]>([]);
  const [botLoading, setBotLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const botStreamAbortRef = useRef<AbortController | null>(null);
  
  const { data: conversations = [] } = useConversations();
  const defaultConv = conversations.find((c: IConversation) => c.channel === defaultChannel) ?? conversations[0] ?? null;
  const effectiveConvId = selectedConvId ?? defaultConv?.id ?? null;
  const { data: msgPage } = useMessages(effectiveConvId);
  const sendMessageMutation = useSendMessage();

  const currentConv = conversations.find((c: IConversation) => c.id === effectiveConvId) ?? null;
  const isBot = currentConv?.channel === Chanel.Bot;
  const botInitialMessage: IMessage | null = useMemo(
    () => (isBot && currentConv
      ? {
        id: 'init',
        userId: 0,
        content: `Xin chào <b>${user?.firstName ?? 'bạn'}</b>! Mình ở đây để giúp bạn với mọi thắc mắc liên quan đến truyện tranh tự động. 😊<br>${user ? 'Hãy bắt đầu cuộc trò chuyện nhé!' : 'Bạn có thể <a class="text-sky-400 hover:underline" href="/auth/login">đăng nhập</a> để bắt đầu trò chuyện tự động cùng mình nhé!'}`,
        conversationId: currentConv.id,
        createdAt: new Date().toISOString(),
        user: { id: 0, firstName: 'Chat Bot', avatar: BOT_INIT_AVATAR, gender: 0 },
      }
      : null),
    [currentConv, isBot, user],
  );
  const displayMessages = useMemo(
    () => (isBot ? (botMessages.length > 0 ? botMessages : botInitialMessage ? [botInitialMessage] : []) : msgPage?.messages ?? []),
    [botInitialMessage, botMessages, isBot, msgPage?.messages],
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages]);

  useEffect(() => {
    return () => botStreamAbortRef.current?.abort();
  }, []);

  if (!isVisible) return null;

  function appendBotContent(messageId: string, content: string) {
    setBotMessages((prev) => prev.map((message) => (
      message.id === messageId
        ? { ...message, content: `${message.content}${content}` }
        : message
    )));
  }

  function parseBotStreamBlock(block: string, botMessageId: string) {
    const lines = block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    let isDone = false;

    for (const line of lines) {
      if (line.startsWith('event: error')) {
        toast.error('ChatBot tạm thời bảo trì vui lòng thử lại sau!');
        isDone = true;
        continue;
      }

      if (line.startsWith('event:') || line.startsWith('id:') || line.startsWith('retry:')) {
        continue;
      }

      const payload = line.startsWith('data:') ? line.slice(5).trim() : line;
      if (!payload || payload === '[DONE]') {
        isDone = payload === '[DONE]' || isDone;
        continue;
      }

      try {
        const parsed = JSON.parse(payload) as { text?: string; message?: string };
        const text = parsed.text ?? parsed.message ?? '';
        if (text === '[DONE]') {
          isDone = true;
        } else if (text) {
          appendBotContent(botMessageId, text);
        }
      } catch {
        appendBotContent(botMessageId, payload);
      }
    }

    return isDone;
  }

  async function streamBotMessage(userMessageId: string, conversation: IConversation) {
    botStreamAbortRef.current?.abort();
    const controller = new AbortController();
    botStreamAbortRef.current = controller;

    const botMessageId = `bot-${userMessageId}`;
    const pendingBotMessage: IMessage = {
      id: botMessageId,
      userId: conversation.hostId,
      content: '',
      conversationId: conversation.id,
      createdAt: new Date().toISOString(),
      user: {
        id: conversation.hostId,
        firstName: 'Chat Bot',
        avatar: BOT_INIT_AVATAR,
        gender: 0,
      },
    };

    setBotMessages((prev) => [...prev, pendingBotMessage]);
    setBotLoading(true);

    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/chat/chatbot/${userMessageId}`, {
        headers: {
          Accept: 'text/event-stream',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`ChatBot stream error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let done = false;

      while (!done) {
        const chunk = await reader.read();
        if (chunk.done) break;

        buffer += decoder.decode(chunk.value, { stream: true });
        const blocks = buffer.split(/\n\n+/);
        buffer = blocks.pop() ?? '';

        for (const block of blocks) {
          done = parseBotStreamBlock(block, botMessageId);
          if (done) break;
        }
      }

      if (!done && buffer.trim()) {
        parseBotStreamBlock(buffer, botMessageId);
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error('Error streaming bot message:', error);
        toast.error('Không thể nhận phản hồi từ ChatBot');
      }
    } finally {
      if (botStreamAbortRef.current === controller) {
        botStreamAbortRef.current = null;
      }
      setBotLoading(false);
    }
  }

  function handleSend() {
    if (!isAuthenticated) { toast.error('Vui lòng đăng nhập để sử dụng ChatBot!'); return; }
    if (!textMessage.trim()) return;

    const content = textMessage.trim();
    setTextMessage('');

    sendMessageMutation.mutate(
      { content, conversationId: currentConv?.id ?? '' },
      {
        onSuccess: (res: IServiceResponse<IMessage>) => {
          if (res.status === 1 && res.data) {
            if (isBot) {
              const sentMessage: IMessage = { ...res.data, user: user ?? undefined };
              const conversation = currentConv;
              setBotMessages((prev) => [
                ...(prev.length > 0 ? prev : botInitialMessage ? [botInitialMessage] : []),
                sentMessage,
              ]);
              if (conversation) {
                void streamBotMessage(res.data.id, conversation);
              }
            }
          }
        },
      }
    );
  }

  function selectConversation(conv: IConversation) {
    setSelectedConvId(conv.id);
    setShowMenu(false);
    if (conv.channel === Chanel.Bot) {
      setBotMessages([{
        id: 'init',
        userId: 0,
        content: `Xin chào <b>${user?.firstName ?? 'bạn'}</b>! Mình ở đây để giúp bạn với mọi thắc mắc liên quan đến truyện tranh tự động. 😊<br>${user ? 'Hãy bắt đầu cuộc trò chuyện nhé!' : 'Bạn có thể <a class="text-sky-400 hover:underline" href="/auth/login">đăng nhập</a> để bắt đầu trò chuyện tự động cùng mình nhé!'}`,
        conversationId: conv.id,
        createdAt: new Date().toISOString(),
        user: { id: 0, firstName: 'Chat Bot', avatar: BOT_INIT_AVATAR, gender: 0 },
      }]);
    }
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 h-[500px] w-full max-md:h-full sm:w-fit md:bottom-4 md:right-4">
      <div className="relative flex h-full w-full gap-0 overflow-hidden rounded-t-2xl border border-neutral-200 bg-white shadow-2xl max-md:rounded-none dark:border-neutral-700 dark:bg-neutral-800 sm:w-[480px] md:rounded-2xl">
        <div
          className={`absolute left-0 top-0 z-[100] flex h-full max-w-xs flex-none flex-col border-r border-neutral-200 bg-white transition-all duration-300 ease-in-out dark:border-neutral-700 dark:bg-neutral-800 lg:flex ${
            showMenu ? 'w-[280px] max-md:w-full' : 'w-0 overflow-hidden'
          }`}
        >
          <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-700">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-light-text">Tin nhắn</h3>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-white">
              {conversations.length}
            </div>
          </div>
          <div className="scrollbar-style-1 flex-1 overflow-y-auto">
            {conversations.map((conv: IConversation) => (
              <button
                key={conv.id}
                type="button"
                className={`flex w-full cursor-pointer items-center gap-3 border-none bg-transparent p-2 text-left transition-colors duration-200 hover:bg-neutral-50 max-sm:p-3 dark:hover:bg-neutral-700 ${
                  selectedConvId === conv.id ? 'border-r-2 border-solid border-primary-100 bg-primary-100/10' : ''
                }`}
                onClick={() => selectConversation(conv)}
              >
                <div className="relative shrink-0">
                  <Image
                    src={conv.icon || BOT_INIT_AVATAR}
                    className="h-12 w-12 rounded-full border-2 border-neutral-200 object-cover dark:border-neutral-600"
                    alt={conv.name || 'Conversation'}
                    width={48}
                    height={48}
                    unoptimized
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-lime-500 dark:border-neutral-800" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="mb-1 truncate text-sm font-semibold text-neutral-900 dark:text-light-text">
                    {conv.name}
                  </h4>
                  <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                    {conv.channel === Chanel.Admin ? 'Chat với admin' : 'Chat với AI Moi'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-neutral-400 dark:text-neutral-500">{formatDate(conv.lastMessage?.createdAt)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="Đóng danh sách tin nhắn"
          className={`absolute inset-0 z-[5] h-full w-full border-none bg-black/60 transition-opacity duration-300 ${
            showMenu ? '' : 'hidden'
          }`}
          onClick={() => setShowMenu(false)}
        />

        <div className="relative flex h-full w-full flex-col sm:w-[480px]">
          <div className="flex items-center justify-between border-b border-neutral-200 bg-white p-4 max-sm:p-3 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-neutral-600 transition-all duration-200 hover:bg-neutral-100 hover:text-primary-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
                onClick={() => setShowMenu(!showMenu)}
                title="Toggle menu"
              >
                <Menu className="h-5 w-5" strokeWidth={2} />
              </button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={currentConv?.icon || BOT_INIT_AVATAR}
                    className="h-10 w-10 rounded-full border-2 border-neutral-200 object-cover dark:border-neutral-600"
                    alt={currentConv?.name || 'Chat Bot'}
                    width={40}
                    height={40}
                    unoptimized
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-lime-500 dark:border-neutral-800" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-light-text">
                    {currentConv?.name || 'Chat Bot'}
                  </h3>
                  <p className="text-xs font-medium text-lime-500">Đang hoạt động</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-neutral-600 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
                title="Tùy chọn"
              >
                <MoreVertical className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-neutral-600 transition-all duration-200 hover:bg-red-50 hover:text-red-500 dark:text-neutral-400 dark:hover:bg-red-900/20 dark:hover:text-white"
                onClick={onClose}
                title="Đóng chat"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="scrollbar-style-1 flex-1 space-y-4 overflow-y-auto bg-neutral-50 p-4 dark:bg-neutral-900">
            {displayMessages.map((msg: IMessage, i: number) => {
              const isSent = !!user && msg.userId === user.id;
              const isLast = i === displayMessages.length - 1;

              return (
                <div key={msg.id || `${msg.createdAt}-${i}`} className="w-full">
                  <div className={`flex max-w-full items-start gap-3 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="shrink-0">
                      <Image
                        src={msg.user?.avatar || DEFAULT_AVATAR}
                        className="h-8 w-8 rounded-full border border-neutral-200 object-cover dark:border-neutral-600"
                        alt={msg.user?.firstName || 'User'}
                        width={32}
                        height={32}
                        unoptimized
                      />
                    </div>
                    <div className={`flex max-w-xs flex-col gap-1 ${isSent ? 'items-end' : 'items-start'}`}>
                      {botLoading && isLast && msg.user?.firstName === 'Chat Bot' && !msg.content ? (
                        <div
                          className={`flex items-center gap-2 break-words rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                            isSent
                              ? 'rounded-br-md bg-primary-100 text-white'
                              : 'rounded-bl-md border border-neutral-200 bg-white text-neutral-900 dark:border-neutral-600 dark:bg-neutral-700 dark:text-light-text'
                          }`}
                        >
                          <span className="inline-block size-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                          Đang trả lời...
                        </div>
                      ) : (
                        <div
                          className={`break-words rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                            isSent
                              ? 'rounded-br-md bg-primary-100 text-white'
                              : 'rounded-bl-md border border-neutral-200 bg-white text-neutral-900 dark:border-neutral-600 dark:bg-neutral-700 dark:text-light-text'
                          }`}
                        >
                          <Markdown content={msg.content} />
                        </div>
                      )}
                      <div className="px-2 text-xs text-neutral-500 dark:text-neutral-400">{formatDate(msg.createdAt)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-center gap-3 p-4 max-sm:gap-2 max-sm:p-3">
              <div className="flex items-center">
                <button
                  type="button"
                  className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-neutral-600 transition-all duration-200 hover:bg-neutral-100 hover:text-primary-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
                  onClick={() => setShowEmoji(!showEmoji)}
                  title="Chọn emoji"
                >
                  <Smile className="h-5 w-5" strokeWidth={2} />
                  {showEmoji && (
                    <div className="absolute bottom-full right-0 z-50 mb-2 rounded-lg border border-neutral-200 shadow-2xl dark:border-neutral-700">
                      <EmojiPicker onSelect={() => setShowEmoji(false)} />
                    </div>
                  )}
                </button>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-sm text-neutral-900 transition-all duration-200 placeholder:text-neutral-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-neutral-600 dark:bg-neutral-700 dark:text-light-text dark:placeholder:text-neutral-400 sm:px-3 sm:py-2"
                  placeholder="Nhập tin nhắn..."
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  autoComplete="off"
                />
              </div>
              <button
                type="button"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-none bg-primary-100 text-white transition-all duration-200 hover:bg-primary-200 disabled:cursor-not-allowed disabled:bg-neutral-300"
                onClick={handleSend}
                disabled={!textMessage.trim()}
                title="Gửi tin nhắn"
              >
                <Send className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
