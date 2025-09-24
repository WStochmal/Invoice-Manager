export type ApiResponse<T> = {
  success: boolean;
  messageCode: string;
  data: T;
};
