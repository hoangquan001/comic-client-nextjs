export interface IUserLite {
  id: number;
  username?: string;
  avatar?: string;
  experience?: number;
  typeLevel?: number;
  levelInfo?: { percent: number; level: string; nextLevel: string };
}
