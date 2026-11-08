import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import type { Machine } from "../types/machine";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Props {
  machines: Machine[];
}

export default function MachineMap({ machines }: Props) {
  const validMachines = machines.filter(
    (m) =>
      m.latitude != null &&
      m.longitude != null &&
      Number.isFinite(Number(m.latitude)) &&
      Number.isFinite(Number(m.longitude)) &&
      Math.abs(Number(m.latitude)) <= 90 &&
      Math.abs(Number(m.longitude)) <= 180
  );

  const bounds: L.LatLngBoundsExpression = validMachines.map(
    (m) => [Number(m.latitude), Number(m.longitude)]
  );

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[42.6977, 23.3219]}
        zoom={11}
        scrollWheelZoom={false}
        style={{ height: "480px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validMachines.map((machine) => (
          <Marker
            key={machine.id}
            position={[
              Number(machine.latitude),
              Number(machine.longitude),
            ]}
            icon={markerIcon}
          >
            <Popup>
              <strong>{machine.name}</strong>
              <p>{machine.address}</p>
              <Link to={`/machines/${machine.id}`}>View details</Link>
            </Popup>
          </Marker>
        ))}

        {validMachines.length > 0 && (
          <FitBounds bounds={bounds} />
        )}
      </MapContainer>
    </div>
  );
}

import { useMap } from "react-leaflet";
import { useEffect } from "react";

function FitBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 14,
    });
  }, [map, bounds]);

  return null;
}