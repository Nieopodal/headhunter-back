export interface ApiSuccessResponse<T> {
    isSuccess: true;
    payload: T;
}

export interface ApiErrorResponse {
    isSuccess: false;
    error: string;
}