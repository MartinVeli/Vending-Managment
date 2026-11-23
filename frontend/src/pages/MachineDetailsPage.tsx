import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, MapPin, Trash2 } from "lucide-react";

import { getMachine, deleteMachine } from "../services/machineService";
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
  const navigate = useNavigate();

  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    const machineId = Number(id);

    if (!Number.isSafeInteger(machineId) || machineId <= 0 || deleting) {
      return;
    }

    setDeleting(true);
    try {
      await deleteMachine(machineId);
      toast.success("Machine deprecated successfully.");
      navigate("/machines", { replace: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not delete machine.";
      toast.error(message);
      setDeleting(false);
    }
  };

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

        <div className="machine-detail-actions">
          <Link
            to={`/machines/${machine.id}/edit`}
            className="btn btn-primary"
          >
            <Pencil size={18} />
            Edit Machine
          </Link>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setShowDeleteConfirmation(true)}
            disabled={deleting || machine.status === "DEPRECATED"}
          >
            <Trash2 size={18} />
            Delete Machine
          </button>
        </div>
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
          void loadStockData();
        }}
      />

      {showDeleteConfirmation && (
        <div
          className="delete-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleting) {
              setShowDeleteConfirmation(false);
            }
          }}
        >
          <section
            className="delete-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <div className="delete-dialog-icon">
              <Trash2 size={24} />
            </div>
            <h2 id="delete-dialog-title">Delete vending machine?</h2>
            <p id="delete-dialog-description">
              Are you sure you want to deprecate <strong>{machine.name}</strong>?
              It will no longer appear in the machines list. Existing records
              and related data will be kept.
            </p>
            <div className="delete-dialog-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirmation(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => void handleDelete()}
                disabled={deleting}
              >
                <Trash2 size={17} />
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
