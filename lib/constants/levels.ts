import { Level } from '@/types';

interface LevelInfo {
  exp: number;
  level: string;
}

const LEVEL_NAMES_DEFAULT = [
  { exp: Level.LuyenKhiKy, level: 'Luyện Khí' },
  { exp: Level.TruCoKy, level: 'Trúc Cơ' },
  { exp: Level.KetDanKy, level: 'Kết Đan' },
  { exp: Level.NguyenAnhKy, level: 'Nguyên Anh' },
  { exp: Level.HoaThenKy, level: 'Hóa Thần' },
  { exp: Level.LuyenHuky, level: 'Luyện Hư' },
  { exp: Level.HopTheky, level: 'Hợp Thể' },
  { exp: Level.DaiThuaKy, level: 'Đại Thừa' },
  { exp: Level.ChanTien, level: 'Chân Tiên' },
  { exp: Level.KiemTien, level: 'Kiếm Tiên' },
  { exp: Level.ThaiAtKiemTien, level: 'Thái Ất Kiếm Tiên' },
  { exp: Level.DaiLa, level: 'Đại La' },
  { exp: Level.DaoTo, level: 'Đạo Tổ' },
];

const LEVEL_NAMES_NUMERIC = [
  { exp: Level.LuyenKhiKy, level: 'Cấp 1' },
  { exp: Level.TruCoKy, level: 'Cấp 2' },
  { exp: Level.KetDanKy, level: 'Cấp 3' },
  { exp: Level.NguyenAnhKy, level: 'Cấp 4' },
  { exp: Level.HoaThenKy, level: 'Cấp 5' },
  { exp: Level.LuyenHuky, level: 'Cấp 6' },
  { exp: Level.HopTheky, level: 'Cấp 7' },
  { exp: Level.DaiThuaKy, level: 'Cấp 8' },
  { exp: Level.ChanTien, level: 'Cấp 9' },
  { exp: Level.KiemTien, level: 'Cấp 10' },
  { exp: Level.ThaiAtKiemTien, level: 'Cấp 11' },
  { exp: Level.DaiLa, level: 'Bán Đặc Cấp' },
  { exp: Level.DaoTo, level: 'Đặc Cấp' },
];

const LEVEL_TABLE: LevelInfo[][] = [LEVEL_NAMES_DEFAULT, LEVEL_NAMES_NUMERIC];

export function getLevel(exp: number, typeLevel: number): string {
  const levels = LEVEL_TABLE[typeLevel] ?? LEVEL_TABLE[0];
  if (exp >= Level.DaoTo) return levels[levels.length - 1].level;
  for (let i = levels.length - 1; i >= 0; i--) {
    if (exp >= levels[i].exp) return levels[i].level;
  }
  return levels[0].level;
}

export function getLevelUser(
  exp: number,
  typeLevel: number
): { percent: number; level: string; nextLevel: string } {
  const levels = LEVEL_TABLE[typeLevel] ?? LEVEL_TABLE[0];
  if (exp >= Level.DaoTo) {
    return {
      percent: Math.round((exp / Level.DaoTo) * 100),
      level: levels[levels.length - 1].level,
      nextLevel: 'Max',
    };
  }
  for (let i = levels.length - 1; i >= 0; i--) {
    if (exp >= levels[i].exp) {
      return {
        percent: Math.round((exp / levels[i + 1].exp) * 100),
        level: levels[i].level,
        nextLevel: levels[i + 1].level,
      };
    }
  }
  return {
    percent: Math.round((exp / Level.TruCoKy) * 100),
    level: levels[0].level,
    nextLevel: levels[1].level,
  };
}
