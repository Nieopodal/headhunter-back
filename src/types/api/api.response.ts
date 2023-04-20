export interface ApiResponse<T> {
    isSuccess: boolean;
    payload: T;
    error: string | null;
}