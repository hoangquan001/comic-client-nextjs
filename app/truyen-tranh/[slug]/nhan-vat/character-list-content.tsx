'use client';

import { useCharactersByComicId } from '@/lib/hooks/use-comic-queries';
import { Spinner } from '@/components/common/spinner/spinner';

export default function CharacterListContent({
  comicId,
  comicTitle,
}: {
  comicId: number;
  comicTitle: string;
}) {
  const { data: characters, isLoading } = useCharactersByComicId(comicId);

  return (
    <div>
      <div className="flex items-center gap-3 mb-1 pb-1">
        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="currentColor" viewBox="0 0 512 512">
          <path d="M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM64 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48-208a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z" />
        </svg>
        <h2 className="chapter-title-text uppercase">Danh sách nhân vật</h2>
      </div>

      {isLoading ? (
        <Spinner />
      ) : characters && characters.length > 0 ? (
        <div className="pt-2 flex flex-wrap overflow-y-auto scrollbar-style-1">
          {characters.map((character) => (
            <div key={character.id} className="character-card basis-[calc(33%-0.5rem)]">
              <div className="c-top-character-item c-character-item-content">
                <div className="c-character-image-container">
                  <div className="c-character-image-link">
                    <img
                      className="c-character-image"
                      alt={character.name}
                      src={character.image || '/empty.png'}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/empty.png';
                      }}
                    />
                    <div className="c-image-overlay" />
                  </div>
                </div>
                <div className="c-character-info">
                  <div className="c-character-main-info">
                    <h3 className="c-character-title c-character-title-link">
                      {character.name}
                    </h3>
                    <div className="c-character-chapter">
                      <span className="c-character-chapter-link">{character.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-neutral-300 dark:text-neutral-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Chưa có nhân vật nào
          </h3>
          <p className="text-gray-500 dark:text-gray-500">Danh sách nhân vật sẽ được cập nhật sau</p>
        </div>
      )}
    </div>
  );
}
