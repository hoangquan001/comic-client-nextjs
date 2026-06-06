
import Image from 'next/image';
export function Empty({ message = 'Không có dữ liệu' }: { message?: string }) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12 text-neutral-600 dark:text-neutral-300">
      <Image 
       src="/empty.png" 
       alt="AI Assistant" 
       className="w-32 h-32 object-cover" 
       width={128} 
       height={128}
       loading="eager"
      >

      </Image>
      <p className="text-sm">{message}</p>
    </div>
  );
}
