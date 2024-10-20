// DTO for Success Response
export interface SuccessResponseDTO<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
}
export interface ErrorResponseDTO {
  success: false;
  statusCode: number;
  message: string;
  error: string;
}
