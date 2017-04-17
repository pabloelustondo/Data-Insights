/**
 * Created by vdave on 4/13/2017.
 */

interface VehicleData {
    vehicle: string[];
}

export interface VehicleInfo {
    metadata: string[];
    createdAt: Date;
    data?: VehicleData;
}
