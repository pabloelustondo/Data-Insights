/**
 * Created by vdave on 5/5/2017.
 */
export interface ResponseModel {
    error?: ErrorResponseModel;
    success?: SuccessResponseModel;
}
interface ErrorResponseModel {
    errorCode: string;
    errorMessage: string;
}

interface  SuccessResponseModel {
    metadata: string;
    createdAt: Date;
    data?: string[];
}