export interface AssignStaffRequest{
  warehouseId : number;
}

export interface AssignStaffResponse {
  data: boolean;
  status: boolean;
  message: string;
}

export interface StaffName {
  id: number;
  fullName: string;
}

export interface GetStaffNamesResponse {
  data: StaffName[];
  status: boolean;
  message: string;
}
