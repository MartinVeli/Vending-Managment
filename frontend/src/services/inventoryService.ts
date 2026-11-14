
export interface InventoryItem {
  id: number;
  machineId: number;
  machineCode: string;
  productId: number;
  sku: string;
  productName: string;
  quantity: number;
  capacity: number;
  lowStockThreshold: number;
  estimatedDaysRemaining: number;
  updatedAt: string;
  lowStock: boolean;
}

export type StockEventType =
  | "SALE"
  | "RESTOCK";

export interface StockEvent {
  id: number;
  inventoryItemId: number;
  productName: string;
  type: StockEventType;
  quantityChange: number;
  note: string | null;
  createdAt: string;
}

async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      typeof data?.error === "string"
        ? data.error
        : `Request failed (${response.status})`
    );
  }

  return response.json() as Promise<T>;
}

export function getMachineInventory(
  machineId: number
): Promise<InventoryItem[]> {
  return fetchData(
    `/api/inventory/machine/${machineId}`
  );
}

export function getMachineStockEvents(
  machineId: number
): Promise<StockEvent[]> {
  return fetchData(
    `/api/inventory/machine/${machineId}/events`
  );
}
