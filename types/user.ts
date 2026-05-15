export interface IUser {
  id: number;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  dob?: string;
  gender: number;
  token?: string;
  experience?: number;
  maxim?: string;
  typeLevel?: number;
  createAt?: string;
  levelInfo?: { percent: number; level: string; nextLevel: string };
}

export interface IUserStats {
  readCount: number;
  favoriteCount?: number;
  followingCount?: number;
}
