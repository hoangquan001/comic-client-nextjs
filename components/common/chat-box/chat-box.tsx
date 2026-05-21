'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { useConversations, useMessages, useSendMessage } from '@/lib/hooks/use-chat-queries';
import Markdown from '@/components/common/markdown/markdown';
import EmojiPicker from '@/components/common/emoji/emoji-picker';
import { Chanel } from '@/types';
import type { IConversation, IMessage } from '@/types';
import { toast } from 'sonner';

interface ChatBoxProps {
  isVisible: boolean;
  onClose: () => void;
  defaultChannel?: Chanel;
}

const BOT_INIT_AVATAR = '/option4.png';

export default function ChatBox({ isVisible, onClose, defaultChannel = Chanel.Bot }: ChatBoxProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [textMessage, setTextMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [botMessages, setBotMessages] = useState<IMessage[]>([]);
  const [botLoading, setBotLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: conversations = [] } = useConversations();
  const { data: msgPage } = useMessages(selectedConvId);
  const sendMessageMutation = useSendMessage();

  const messages = msgPage?.messages ?? [];
  const currentConv = conversations.find((c: IConversation) => c.id === selectedConvId) ?? null;
  const isBot = currentConv?.channel === Chanel.Bot;
  const displayMessages = isBot ? botMessages : messages;

  useEffect(() => {
    if (conversations.length > 0 && !selectedConvId) {
      const conv = conversations.find((c: IConversation) => c.channel === defaultChannel) ?? conversations[0];
      setSelectedConvId(conv.id);
    }
  }, [conversations, defaultChannel, selectedConvId]);

  useEffect(() => {
    if (isBot && user && botMessages.length === 0 && currentConv) {
      setBotMessages([{
        id: 'init',
        userId: 0,
        content: `Xin chào <b>${user.firstName ?? 'bạn'}</b>! Mình ở đây để giúp bạn với mọi thắc mắc liên quan đến truyện tranh.`,
        conversationId: currentConv.id,
        createdAt: new Date().toISOString(),
        user: { id: 0, firstName: 'Chat Bot', avatar: BOT_INIT_AVATAR, gender: 0 },
      }]);
    }
  }, [isBot, user, currentConv, botMessages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages]);

  if (!isVisible) return null;

  function handleSend() {
    if (!isAuthenticated) { toast.error('Vui lòng đăng nhập để sử dụng ChatBot!'); return; }
    if (!textMessage.trim()) return;

    const content = textMessage.trim();
    setTextMessage('');

    sendMessageMutation.mutate(
      { content, conversationId: currentConv?.id ?? '' },
      {
        onSuccess: (res: any) => {
          if (res.status === 1 && res.data) {
            if (isBot) {
              setBotMessages((prev) => [...prev, { ...res.data, user: user as any }]);
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
        content: `Xin chào <b>${user?.firstName ?? 'bạn'}</b>! Mình ở đây để giúp bạn.`,
        conversationId: conv.id,
        createdAt: new Date().toISOString(),
        user: { id: 0, firstName: 'Chat Bot', avatar: BOT_INIT_AVATAR, gender: 0 },
      }]);
    }
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-neutral-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50">
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 border-none cursor-pointer bg-transparent" onClick={() => setShowMenu(!showMenu)}>
            <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Image src={currentConv?.icon || BOT_INIT_AVATAR} className="w-8 h-8 rounded-full object-cover" alt="" width={32} height={32} />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-lime-500 border-2 border-white dark:border-neutral-800 rounded-full" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-light-text">{currentConv?.name || 'Chat Bot'}</h3>
              <p className="text-xs text-neutral-500">Đang hoạt động</p>
            </div>
          </div>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 border-none cursor-pointer bg-transparent" onClick={onClose}>
          <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>

      {/* Conversation menu */}
      {showMenu && (
        <div className="border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 max-h-48 overflow-y-auto">
          {conversations.map((conv: IConversation) => (
            <button key={conv.id} className={`w-full flex items-center gap-2 p-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer border-none bg-transparent text-left ${selectedConvId === conv.id ? 'bg-primary-100/10' : ''}`} onClick={() => selectConversation(conv)}>
              <Image src={conv.icon || BOT_INIT_AVATAR} className="w-8 h-8 rounded-full object-cover shrink-0" alt="" width={32} height={32} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-light-text truncate">{conv.name}</p>
                <p className="text-xs text-neutral-500">{conv.channel === Chanel.Bot ? 'Chat với AI' : 'Chat với admin'}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-style-1">
        {displayMessages.map((msg: IMessage, i: number) => {
          const isSent = user && msg.userId === user.id;
          const isLast = i === displayMessages.length - 1;
          return (
            <div key={msg.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2 max-w-85 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
                <Image src={msg.user?.avatar || '/default_avatar.jpg'} className="w-7 h-7 rounded-full object-cover shrink-0" alt="" width={28} height={28} />
                <div>
                  {botLoading && isLast && msg.user?.firstName === 'Chat Bot' ? (
                    <div className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-sm text-neutral-600 dark:text-neutral-300">
                      <span className="spinner animate-spin size-4 border-2 border-gray-300 border-t-blue-500 rounded-full inline-block" /> Đang trả lời...
                    </div>
                  ) : (
                    <div className={`px-3 py-2 rounded-xl text-sm ${isSent ? 'bg-primary-100 text-white' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200'}`}>
                      <Markdown content={msg.content} />
                    </div>
                  )}
                  <p className={`text-xs text-neutral-400 mt-1 ${isSent ? 'text-right' : 'text-left'}`}>{new Date(msg.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-700 rounded-xl px-3 py-2">
          <div className="relative">
            <button type="button" className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 border-none cursor-pointer bg-transparent" onClick={() => setShowEmoji(!showEmoji)}>
              <svg className="w-5 h-5 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
            </button>
            {showEmoji && (
              <div className="absolute bottom-10 left-0 z-50">
                <EmojiPicker onSelect={() => setShowEmoji(false)} />
              </div>
            )}
          </div>
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-sm text-neutral-900 dark:text-light-text placeholder-neutral-500"
            placeholder="Nhập tin nhắn..."
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            autoComplete="off"
          />
          <button type="button" className="p-1.5 rounded-lg bg-primary-100 hover:bg-primary-200 text-white border-none cursor-pointer disabled:opacity-50" onClick={handleSend} disabled={!textMessage.trim()}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22,2 15,22 11,13 2,9 22,2" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
