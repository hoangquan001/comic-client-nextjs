


  // constructor() { }
  export function fillDescription(description: string | null | undefined, params?: { url: string; id: number|undefined, title: string }, link = true): string {
    if (!description && params) {
      let url = `/truyen-tranh/${params.url}`
      if(params.id)
      {
        url += `-${params.id}`;
      }
      const content = !link ? params.title : `<a class="text-sky-400 hover:underline" href = "${url}"> ${params.title} </a>`
      return `Đọc truyện ${content} bản full đầy đủ chap mới nhất với hình ảnh sắc nét, truyện tải nhanh, không quảng cáo tại website đọc truyện tranh online - MeTruyenMoi.
      Bạn đọc đừng quên để lại bình luận và chia sẻ, ủng hộ MeTruyenMoi ra các chương mới nhất của truyện ${content}.`;
    }
    return description!;
  }
  export function fillSeoDescription(description: string | null | undefined, params?: { title: string }): string {

    if (!description && params) {
      const content = params.title
      return `Đọc truyện ${content} bản full đầy đủ chap mới nhất với hình ảnh sắc nét, truyện tải nhanh, không quảng cáo tại website đọc truyện tranh online - MeTruyenMoi.`;
    }
    if (description!.length > 200) {
      return clampText(description!, 200);
    }
    return description!;
  }
  export  function clampText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }
  export function getFirstSentence(text: string): string {
    // Tìm dấu chấm đầu tiên
    const endOfFirstSentence = text.indexOf('.');

    // Nếu có dấu chấm, cắt từ đầu đến dấu chấm đó
    if (endOfFirstSentence !== -1) {
      return text.substring(0, endOfFirstSentence + 1); // Cộng 1 để lấy dấu chấm
    }

    // Nếu không có dấu chấm, trả về nguyên văn
    return text;
  }