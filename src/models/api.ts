export interface ApiReponseData<T>{
    success: boolean;
    data?: T;
    errorMessage?: string;
}


