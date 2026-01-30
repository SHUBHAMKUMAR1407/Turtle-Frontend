export interface ApiError {
    error: string;
    reasons?: string[];
    session_id?: string;
}

export interface ApiResponse<T> {
    data: T;
    status: number;
    statusText: string;
}
