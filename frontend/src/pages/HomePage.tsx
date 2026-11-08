import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Package,
  ClipboardList,
  BarChart3,
  ShieldCheck,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Machine Management",
    description:
      "Manage vending machines, monitor their status and track locations.",
  },
  {
    icon: Package,
    title: "Inventory Tracking",
    description:
      "Keep track of products, quantities and stock levels.",
  },
  {
    icon: ClipboardList,
    title: "Restock Tasks",
    description:
      "Organize replenishment tasks and keep your machines stocked.",
  },
  {
    icon: BarChart3,
    title: "Stock Activity",
    description:
      "Review sales, restocks and inventory adjustments.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="page-container hero-grid">
          <div className="hero-content">
            <span className="eyebrow">
              <Zap size={16} />
              SMART VENDING MANAGEMENT
            </span>

            <h1>
              Your vending business.
              <span> Under control.</span>
            </h1>

            <p>
              Manage your vending machines, monitor inventory,
              and organize restocking from one simple platform.
            </p>

            <div className="hero-actions">
              <Link to="/machines" className="btn btn-primary">
                Explore Machines <ArrowRight size={18} />
              </Link>

              <Link to="/about" className="btn btn-secondary">
                Learn More
              </Link>
            </div>

            <div className="hero-benefits">
              <span><ShieldCheck size={18} /> Centralized management</span>
              <span><Zap size={18} /> Efficient workflows</span>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <img
              src="/images/greg-greegorey-m7PXuvOxjdM-unsplash.jpg"
              alt="Modern vending machine"
              className="hero-image"
            />

            <div className="floating-card">
              <span className="floating-icon">
                <Package size={20} />
              </span>
              <div>
                <strong>Inventory visibility</strong>
                <small>Stay informed about stock levels</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section page-container">
        <div className="section-heading">
          <span className="eyebrow">WHAT YOU CAN DO</span>
          <h2>Everything you need in one place</h2>
          <p>
            Powerful tools to simplify daily vending machine operations.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div className="feature-card" key={feature.title}>
                <div className="feature-icon">
                  <Icon size={25} />
                </div>

                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="showcase-section">
        <div className="page-container showcase-grid">
          <div className="showcase-image">
            <img
              src="/images/spenser-sembrat-vK2Vubjtp1g-unsplash.jpg"
              alt="Restocking a vending machine"
            />
          </div>

          <div className="showcase-content">
            <span className="eyebrow">WORK SMARTER</span>
            <h2>Spend less time checking. More time growing.</h2>
            <p>
              Identify low-stock products, review inventory,
              and manage replenishment tasks without losing
              track of your machines.
            </p>

            <Link to="/machines" className="text-link">
              View your machines <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="cta-section page-container">
        <h2>Ready to manage your machines?</h2>
        <p>Get started by exploring your vending machine network.</p>

        <Link to="/machines" className="btn btn-primary">
          Go to Vending Machines <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
}