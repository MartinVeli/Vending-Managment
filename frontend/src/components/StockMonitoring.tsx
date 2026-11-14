
import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Package,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import type {
  InventoryItem,
  StockEvent,
  StockEventType,
} from "../services/inventoryService";

interface StockMonitoringProps {
  inventory: InventoryItem[];
  events: StockEvent[];
  loading: boolean;
  onRefresh: () => void;
}

type EventFilter = "ALL" | StockEventType;

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function eventTitle(event: StockEvent): string {
  switch (event.type) {
    case "SALE":
      return "Product purchased";
    case "RESTOCK":
      return "Product restocked";
  }
}

export default function StockMonitoring({
  inventory,
  events,
  loading,
  onRefresh,
}: StockMonitoringProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<EventFilter>("ALL");

  const totalUnits = inventory.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const lowStockCount = inventory.filter(
    (item) => item.lowStock
  ).length;

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesFilter =
        filter === "ALL" || event.type === filter;

      const matchesSearch = event.productName
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [events, filter, search]);

  return (
    <section className="stock-monitoring">
      <div className="stock-heading">
        <div>
          <span className="stock-eyebrow">
            INVENTORY MANAGEMENT
          </span>

          <h2>Stock Monitoring</h2>

          <p>
            Track inventory levels and product activity
            for this vending machine.
          </p>
        </div>

        <button
          type="button"
          className="stock-refresh"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="stock-stats">
        <div className="stock-stat-card">
          <div className="stock-stat-icon blue">
            <Package size={22} />
          </div>

          <div>
            <span>Total Units</span>
            <strong>{totalUnits}</strong>
          </div>
        </div>

        <div className="stock-stat-card">
          <div className="stock-stat-icon orange">
            <AlertTriangle size={22} />
          </div>

          <div>
            <span>Low Stock Products</span>
            <strong>{lowStockCount}</strong>
          </div>
        </div>

        <div className="stock-stat-card">
          <div className="stock-stat-icon green">
            <Activity size={22} />
          </div>

          <div>
            <span>Stock Events</span>
            <strong>{events.length}</strong>
          </div>
        </div>
      </div>

      <div className="stock-layout">
        <div className="stock-panel">
          <div className="stock-panel-header">
            <h3>Current Inventory</h3>
            <span className="stock-count">
              {inventory.length} products
            </span>
          </div>

          <div className="stock-panel-body">
            {loading ? (
              <div className="stock-empty">
                Loading inventory...
              </div>
            ) : inventory.length === 0 ? (
              <div className="stock-empty">
                <Package size={30} />
                <p>No products assigned to this machine.</p>
              </div>
            ) : (
              <div className="stock-inventory-list">
                {inventory.map((item) => {
                  const percentage =
                    item.capacity > 0
                      ? Math.min(
                          100,
                          (item.quantity / item.capacity) * 100
                        )
                      : 0;

                  return (
                    <div
                      className="stock-inventory-item"
                      key={item.id}
                    >
                      <div className="stock-item-top">
                        <div>
                          <strong>{item.productName}</strong>
                          <span>{item.sku}</span>
                        </div>

                        <span
                          className={
                            item.lowStock
                              ? "stock-badge low"
                              : "stock-badge healthy"
                          }
                        >
                          {item.lowStock
                            ? "Low Stock"
                            : "In Stock"}
                        </span>
                      </div>

                      <div className="stock-item-quantity">
                        <span>
                          {item.quantity} / {item.capacity} units
                        </span>

                        <span>
                          Threshold: {item.lowStockThreshold}
                        </span>
                      </div>

                      <div className="stock-progress">
                        <div
                          className={
                            item.lowStock
                              ? "stock-progress-fill low"
                              : "stock-progress-fill"
                          }
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="stock-panel">
          <div className="stock-panel-header">
            <h3>Stock Activity</h3>
            <span className="stock-count">
              {filteredEvents.length} events
            </span>
          </div>

          <div className="stock-filters">
            <div className="stock-search">
              <Search size={16} />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
              />
            </div>

            <div className="stock-filter-select">
              <SlidersHorizontal size={16} />

              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value as EventFilter)
                }
              >
                <option value="ALL">All Events</option>
                <option value="SALE">Purchases</option>
                <option value="RESTOCK">Restocks</option>
              </select>
            </div>
          </div>

          <div className="stock-panel-body">
            {loading ? (
              <div className="stock-empty">
                Loading stock events...
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="stock-empty">
                <Activity size={30} />
                <p>No stock events found.</p>
              </div>
            ) : (
              <div className="stock-event-list">
                {filteredEvents.map((event) => (
                  <div
                    className="stock-event"
                    key={event.id}
                  >
                    <div
                      className={`stock-event-icon ${event.type.toLowerCase()}`}
                    >
                      {event.type === "SALE" ? (
                        <ArrowUpRight size={18} />
                      ) : event.type === "RESTOCK" ? (
                        <ArrowDownLeft size={18} />
                      ) : (
                        <Activity size={18} />
                      )}
                    </div>

                    <div className="stock-event-content">
                      <strong>{event.productName}</strong>

                      <span>{eventTitle(event)}</span>

                      <small>
                        {formatDate(event.createdAt)}
                      </small>

                      {event.note && (
                        <p>{event.note}</p>
                      )}
                    </div>

                    <span
                      className={
                        event.quantityChange > 0
                          ? "stock-event-change positive"
                          : event.quantityChange < 0
                            ? "stock-event-change negative"
                            : "stock-event-change"
                      }
                    >
                      {event.quantityChange > 0 ? "+" : ""}
                      {event.quantityChange}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
