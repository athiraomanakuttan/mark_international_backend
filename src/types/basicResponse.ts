// basic reponse type for API responses
export interface BasicResponse<T = any> {  
    status: boolean;
    message: string;
    data: T;
}