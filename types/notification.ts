export interface INotification {
  id: number;
  content: string;
  image: string;
  timestamp: Date;
  isRead: boolean;
  type: number;
  params?: string;
  link?: string;
}
