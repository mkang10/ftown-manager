export interface ApiResponse<T> {
  data: T;
  status: boolean;
  message: string;
}

