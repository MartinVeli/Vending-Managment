import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, MapPin } from "lucide-react";

import { getMachine } from "../services/machineService";
import type { Machine } from "../types/machine";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import StockMonitoring from "../components/StockMonitoring";

import {
  getMachineInventory,
  getMachineStockEvents,
} from "../services/inventoryService";

import type {
  InventoryItem,
  StockEvent,
} from "../services/inventoryService";

export default function MachineDetailsPage() {
  const { id } = useParams();

  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const [inventory, setInventory] = useState<InventoryItem[]>([]);
const [stockEvents, setStockEvents] = useState<StockEvent[]>([]);
const [stockLoading, setStockLoading] = useState(true);
const [stockError, setStockError] = useState("");

const loadStockData = useCallback(async () => {
  const machineId = Number(id);

  if (!Number.isSafeInteger(machineId) || machineId <= 0) {
    setStockError("Invalid machine ID.");
    setStockLoading(false);
    return;
  }

  setStockLoading(true);
  setStockError("");

  try {
    const [inventoryData, eventsData] = await Promise.all([
      getMachineInventory(machineId),
      getMachineStockEvents(machineId),
    ]);

    setInventory(inventoryData);
    setStockEvents(eventsData);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not load stock information.";

    setStockError(message);
    toast.error(message);
  } finally {
    setStockLoading(false);
  }
}, [id]);

useEffect(() => {
  void loadStockData();
}, [loadStockData]);

  useEffect(() => {
    if (!id) {
      setError("Machine ID is missing.");
      setLoading(false);
      return;
    }

    getMachine(Number(id))
      .then(setMachine)
      .catch(() => setError("Could not load machine details."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="page-container content-page">
        <p>Loading machine...</p>
      </main>
    );
  }

  if (error || !machine) {
    return (
      <main className="page-container content-page">
        <p>{error || "Machine not found."}</p>
        <Link to="/machines">Back to machines</Link>
      </main>
    );
  }

  return (
    <main className="page-container content-page">
      <Link to="/machines" className="back-link">
        <ArrowLeft size={18} />
        Back to machines
      </Link>

      <div className="machines-heading">
        <div>
          <h1>{machine.name}</h1>
          <p>{machine.code}</p>
        </div>

        <Link
          to={`/machines/${machine.id}/edit`}
          className="btn btn-primary"
        >
          <Pencil size={18} />
          Edit Machine
        </Link>
      </div>

      <div className="machine-form">
        <h2>Machine Information</h2>

        <p>
          <strong>Status:</strong>{" "}
          <span className={`status ${machine.status.toLowerCase()}`}>
            {machine.status}
          </span>
        </p>

        <p>
          <MapPin size={16} style={{ display: "inline" }} />{" "}
          <strong>Address:</strong> {machine.address || "Not specified"}
        </p>

        <p>
          <strong>Latitude:</strong> {machine.latitude ?? "Not specified"}
        </p>

        <p>
          <strong>Longitude:</strong> {machine.longitude ?? "Not specified"}
        </p>
      </div>

      {stockError && (
  <div className="form-error" role="alert">
    {stockError}
  </div>
)}

<StockMonitoring
  inventory={inventory}
  events={stockEvents}
  loading={stockLoading}
  onRefresh={() => {
    void loadStockData()
      .then(() => {
        // The data was refreshed.
      });
  }}
/>
    </main>
  );
}