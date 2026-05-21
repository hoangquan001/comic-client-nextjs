export interface IUserLite {
  id: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  avatar?: string;
  experience?: number;
  typeLevel?: number;
  levelInfo?: { percent: number; level: string; nextLevel: string };
}
