export interface IServiceResponse<T> {
  data?: T;
  status: number;
  message?: string;
}
