export type MachineStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "MAINTENANCE"
  | "DEPRECATED";

export interface Machine {
  id: number;
  code: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: MachineStatus;
  createdAt: string;
  updatedAt: string;
}