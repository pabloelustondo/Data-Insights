/**
 * Created by vdave on 5/5/2017.
 */
export interface ResponseModel {
    errorCode: string;
    errorMessage: string;
    error?: ErrorResponseModel2;
  //  success?: SuccessResponseModel;
}
interface ErrorResponseModel2 {
    errorCode: string;
    errorMessage: string;
}

interface  SuccessResponseModel {
    metadata: string;
    createdAt: Date;
    data?: string[];
}

export interface ErrorResponseModel {
    status: number;
    message: string;
}
