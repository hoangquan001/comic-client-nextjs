export interface Comment {
  id: number;
  chapterID: number;
  comicID: number;
  userID: number;
  content: string;
  commentedAt: Date;
  userName: string;
  chapterName: string;
  avatar?: string;
  replies?: Comment[];
}

export interface CommentList {
  comments: Comment[];
  cerrentpage: number;
  totalpage: number;
}
