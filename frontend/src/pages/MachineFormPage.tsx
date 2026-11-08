
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import {
  createMachine,
  updateMachine,
  getMachine,
} from "../services/machineService";

import type { MachineStatus } from "../types/machine";
import type { MachinePayload } from "../services/machineService";

interface FormValues {
  code: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  status: MachineStatus;
}

const initialValues: FormValues = {
  code: "",
  name: "",
  address: "",
  latitude: "",
  longitude: "",
  status: "ACTIVE",
};

export default function MachineFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditing = id !== undefined;
  const machineId = id ? Number(id) : null;

  const [form, setForm] = useState<FormValues>(initialValues);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing || machineId === null) {
      return;
    }

    if (!Number.isSafeInteger(machineId) || machineId <= 0) {
      setError("Invalid machine ID.");
      setLoading(false);
      toast.error("Invalid machine ID.");
      return;
    }

    let cancelled = false;

    getMachine(machineId)
      .then((machine) => {
        if (cancelled) return;

        setForm({
          code: machine.code,
          name: machine.name,
          address: machine.address ?? "",
          latitude:
            machine.latitude == null ? "" : String(machine.latitude),
          longitude:
            machine.longitude == null ? "" : String(machine.longitude),
          status: machine.status,
        });
      })
      .catch((err) => {
        if (cancelled) return;

        const message =
          err instanceof Error
            ? err.message
            : "Could not load machine details.";

        setError(message);
        toast.error(message);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isEditing, machineId]);

  function updateField<K extends keyof FormValues>(
    field: K,
    value: FormValues[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  }

  function parseCoordinate(
    value: string,
    minimum: number,
    maximum: number,
    label: string
  ): number {
    if (value.trim() === "") {
      throw new Error(`${label} is required.`);
    }

    const number = Number(value);

    if (!Number.isFinite(number) || number < minimum || number > maximum) {
      throw new Error(
        `${label} must be between ${minimum} and ${maximum}.`
      );
    }

    return number;
  }

  function showError(message: string) {
    setError(message);
    toast.error(message);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) {
      return;
    }

    setError("");

    if (!form.code.trim()) {
      showError("Machine code is required.");
      return;
    }

    if (!form.name.trim()) {
      showError("Machine name is required.");
      return;
    }

    if (!form.address.trim()) {
      showError("Machine address is required.");
      return;
    }

    let payload: MachinePayload;

    try {
      payload = {
        code: form.code.trim(),
        name: form.name.trim(),
        address: form.address.trim(),
        latitude: parseCoordinate(
          form.latitude,
          -90,
          90,
          "Latitude"
        ),
        longitude: parseCoordinate(
          form.longitude,
          -180,
          180,
          "Longitude"
        ),
        status: form.status,
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Invalid machine data.";

      showError(message);
      return;
    }

    setSaving(true);

    try {
      if (isEditing) {
        if (machineId === null || !Number.isSafeInteger(machineId) || machineId <= 0) {
          throw new Error("Invalid machine ID.");
        }

        await updateMachine(machineId, payload);

        toast.success("Vending machine updated successfully!");
      } else {
        await createMachine(payload);

        toast.success("Vending machine created successfully!");
      }

      navigate("/machines");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not save vending machine.";

      showError(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="page-container content-page">
        <p>Loading machine...</p>
      </main>
    );
  }

  return (
    <main className="page-container machine-form-page">
      <Link to="/machines" className="back-link">
        <ArrowLeft size={18} />
        Back to machines
      </Link>

      <div className="form-heading">
        <h1>{isEditing ? "Edit Machine" : "Create Machine"}</h1>

        <p>
          {isEditing
            ? "Update your vending machine information."
            : "Add a new vending machine to your network."}
        </p>
      </div>

      <form className="machine-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="machine-code">Machine Code *</label>

            <input
              id="machine-code"
              required
              maxLength={100}
              value={form.code}
              onChange={(e) => updateField("code", e.target.value)}
              placeholder="VM-001"
            />
          </div>

          <div className="form-field">
            <label htmlFor="machine-name">Machine Name *</label>

            <input
              id="machine-name"
              required
              maxLength={200}
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Office Lobby"
            />
          </div>

          <div className="form-field full-width">
            <label htmlFor="machine-address">Address *</label>

            <input
              id="machine-address"
              required
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="123 Main Street"
            />
          </div>

          <div className="form-field">
            <label htmlFor="machine-latitude">Latitude *</label>

            <input
              id="machine-latitude"
              type="number"
              required
              step="any"
              min="-90"
              max="90"
              value={form.latitude}
              onChange={(e) => updateField("latitude", e.target.value)}
              placeholder="42.6977"
            />
          </div>

          <div className="form-field">
            <label htmlFor="machine-longitude">Longitude *</label>

            <input
              id="machine-longitude"
              type="number"
              required
              step="any"
              min="-180"
              max="180"
              value={form.longitude}
              onChange={(e) => updateField("longitude", e.target.value)}
              placeholder="23.3219"
            />
          </div>

          <div className="form-field full-width">
            <label htmlFor="machine-status">Status</label>

            <select
              id="machine-status"
              value={form.status}
              onChange={(e) =>
                updateField("status", e.target.value as MachineStatus)
              }
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="DEPRECATED">Deprecated</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        <div className="form-actions">
          <Link to="/machines" className="btn btn-secondary">
            Cancel
          </Link>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              saving ||
              (isEditing &&
                (machineId === null ||
                  !Number.isSafeInteger(machineId) ||
                  machineId <= 0))
            }
          >
            <Save size={18} />

            {saving
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Create Machine"}
          </button>
        </div>
      </form>
    </main>
  );
}
