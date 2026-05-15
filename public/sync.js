// NetTruyen Comic Sync Script
// Chạy script này trên trang theo dõi của NetTruyen
(function() {
  console.log('🚀 Bắt đầu lấy dữ liệu từ NetTruyen...');
  
  const comics = [];
  const comicElements = document.querySelectorAll('.item');
  
  if (comicElements.length === 0) {
    console.error('❌ Không tìm thấy truyện nào. Vui lòng đảm bảo bạn đang ở trang theo dõi.');
    return;
  }
  
  comicElements.forEach((element, index) => {
    try {
      const titleElement = element.querySelector('.title a');
      const imageElement = element.querySelector('img');
      const chapterElement = element.querySelector('.chapter a');
      const statusElement = element.querySelector('.status');
      
      if (titleElement) {
        const comic = {
          id: 'nt-' + index,
          title: titleElement.textContent.trim(),
          url: titleElement.href,
          thumbnail: imageElement ? imageElement.src : '',
          lastChapter: chapterElement ? chapterElement.textContent.trim() : '',
          status: statusElement ? statusElement.textContent.trim() : 'reading',
          source: 'nettruyen',
          extractedAt: new Date().toISOString()
        };
        
        comics.push(comic);
      }
    } catch (error) {
      console.warn('⚠️ Lỗi khi xử lý truyện:', error);
    }
  });
  
  console.log(`✅ Đã lấy được ${comics.length} truyện từ NetTruyen`);
  console.log('📋 Dữ liệu (copy toàn bộ JSON bên dưới):');
  console.log(JSON.stringify({
    source: 'nettruyen',
    extractedAt: new Date().toISOString(),
    totalComics: comics.length,
    comics: comics
  }, null, 2));
  
  return comics;
})();