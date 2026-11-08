import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  LayoutGrid,
  Map as MapIcon,
  Monitor,
  CircleCheck,
  Wrench,
  MapPin,
  ArrowRight,
} from "lucide-react";

import { getMachines } from "../services/machineService";
import type { Machine, MachineStatus } from "../types/machine";
import MachineMap from "../components/MachineMap";

type StatusFilter = "ALL" | MachineStatus;
type ViewMode = "grid" | "map";

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  useEffect(() => {
    getMachines()
      .then(setMachines)
      .catch(() => setError("Could not load vending machines."))
      .finally(() => setLoading(false));
  }, []);

  const filteredMachines = useMemo(() => {
    const query = search.toLowerCase().trim();

    return machines.filter((machine) => {
      const matchesSearch =
        machine.name.toLowerCase().includes(query) ||
        machine.code.toLowerCase().includes(query) ||
        (machine.address ?? "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" || machine.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [machines, search, statusFilter]);

  const activeCount = machines.filter(
    (m) => m.status === "ACTIVE"
  ).length;

  const maintenanceCount = machines.filter(
    (m) => m.status === "MAINTENANCE"
  ).length;

  return (
    <main className="page-container machines-page">
      <div className="machines-heading">
        <div>
          <h1>Vending Machines</h1>
          <p>Manage and monitor your vending machine network.</p>
        </div>

        <Link to="/machines/new" className="btn btn-primary">
          <Plus size={18} />
          New Machine
        </Link>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={<Monitor />}
          label="Total Machines"
          value={machines.length}
        />
        <StatCard
          icon={<CircleCheck />}
          label="Active"
          value={activeCount}
        />
        <StatCard
          icon={<Wrench />}
          label="Maintenance"
          value={maintenanceCount}
        />
      </div>

      <div className="machine-toolbar">
        <div className="machine-search">
          <Search size={19} />
          <input
            type="search"
            placeholder="Search by name, code or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="status-select"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as StatusFilter)
          }
          aria-label="Filter by machine status"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="DEPRECATED">Deprecated</option>
        </select>
      </div>

      <div className="results-bar">
        <p>
          Showing <strong>{filteredMachines.length}</strong> of{" "}
          {machines.length} machines
        </p>

        <div className="view-toggle">
          <button
            className={viewMode === "grid" ? "selected" : ""}
            onClick={() => setViewMode("grid")}
            aria-pressed={viewMode === "grid"}
          >
            <LayoutGrid size={17} /> Grid
          </button>
          <button
            className={viewMode === "map" ? "selected" : ""}
            onClick={() => setViewMode("map")}
            aria-pressed={viewMode === "map"}
          >
            <MapIcon size={17} /> Map
          </button>
        </div>
      </div>

      {loading && <p>Loading vending machines...</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && filteredMachines.length === 0 && (
        <div className="empty-state">
          <Monitor size={40} />
          <h3>No machines found</h3>
          <p>Try changing your search or status filter.</p>
        </div>
      )}

      {!loading && !error && filteredMachines.length > 0 && (
        viewMode === "grid" ? (
          <div className="machine-grid">
            {filteredMachines.map((machine) => (
              <div
                key={machine.id}
                
                className="machine-card"
              >
                <div className="machine-card-top">
                  <div className="machine-card-icon">
                    <Monitor size={25} />
                  </div>
                  <span className={`status ${machine.status.toLowerCase()}`}>
                    {machine.status}
                  </span>
                </div>

                <h3>{machine.name}</h3>
                <p className="machine-code">{machine.code}</p>

                <div className="machine-address">
                  <MapPin size={16} />
                  <span>{machine.address || "No address"}</span>
                </div>

                <div className="machine-card-footer">
                      <Link to={`/machines/${machine.id}`}>
      View Details
    </Link>

    <Link to={`/machines/${machine.id}/edit`}>
      Edit Machine
    </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <MachineMap machines={filteredMachines} />
        )
      )}
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <strong>{value}</strong>
        <p>{label}</p>
      </div>
    </div>
  );
}