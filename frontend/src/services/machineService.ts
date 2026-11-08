import type { Machine, MachineStatus } from "../types/machine";

const API_URL = "/api/machines";

export interface MachinePayload {
  code: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  status: MachineStatus;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function getMachines(): Promise<Machine[]> {
  const response = await fetch(API_URL);
  return handleResponse<Machine[]>(response);
}

export async function getMachine(id: number): Promise<Machine> {
  const response = await fetch(`${API_URL}/${id}`);
  return handleResponse<Machine>(response);
}

export async function createMachine(
  machine: MachinePayload
): Promise<Machine> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(machine),
  });

  return handleResponse<Machine>(response);
}

export async function updateMachine(
  id: number,
  machine: MachinePayload
): Promise<Machine> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(machine),
  });

  return handleResponse<Machine>(response);
}