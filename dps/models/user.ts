/**
 * Created by vdave on 5/8/2017.
 */
export interface User {
    userId: string;
    tenantId: string;
    rawDataConnection?: string;
    additionalFields?: any;
}