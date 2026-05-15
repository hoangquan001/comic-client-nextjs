export enum ComicStatus {
  ALL = -1,
  ONGOING = 0,
  COMPLETED = 1,
}

export enum SortType {
  Chapter,
  LastUpdate,
  TopFollow,
  TopComment,
  NewComic,
  TopDay,
  TopWeek,
  TopMonth,
  TopAll,
}

export enum TopType {
  Day = 0,
  Week = 1,
  Month = 2,
}

export enum Level {
  LuyenKhiKy = 200,
  TruCoKy = 1000,
  KetDanKy = 5000,
  NguyenAnhKy = 10000,
  HoaThenKy = 60000,
  LuyenHuky = 120000,
  HopTheky = 600000,
  DaiThuaKy = 1000000,
  ChanTien = 1200000,
  KiemTien = 1800000,
  ThaiAtKiemTien = 2400000,
  DaiLa = 3000000,
  DaoTo = 3500000,
}

export enum UserExpType {
  Chapter = 10,
  Advertisement = 20,
  Comment = 30,
}

export enum InputType {
  Selection = 1,
  Text = 2,
  Number = 3,
  Range = 4,
  Color = 5,
  Toggle = 6,
  Slider = 7,
  None = 8,
}
