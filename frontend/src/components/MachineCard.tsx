import { Link } from "react-router-dom";
import type { Machine } from "../types/machine";

interface Props {
  machine: Machine;
}

export default function MachineCard({ machine }: Props) {
  return (
    <Link to={`/machines/${machine.id}`} className="machine-card">
      <h3>{machine.name}</h3>
      <p>{machine.code}</p>
      <p>{machine.address}</p>
      <span className={`status ${machine.status.toLowerCase()}`}>
        {machine.status}
      </span>
    </Link>
  );
}