export interface Genre {
  id: number;
  title: string;
  slug?: string;
  description?: string | null;
  ageLimit?: boolean;
}
