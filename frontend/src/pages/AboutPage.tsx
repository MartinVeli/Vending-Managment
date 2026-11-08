import { PackageCheck, MapPinned, ClipboardCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="page-container content-page">
      <span className="eyebrow">ABOUT THE PLATFORM</span>
      <h1>About VendFlow</h1>

      <p>
        VendFlow is a vending management application designed
        to make everyday machine operations simpler and more organized.
      </p>

      <div className="features-grid">
        <div className="feature-card">
          <MapPinned className="feature-icon-inline" size={30} />
          <h3>Centralized Management</h3>
          <p>Manage machine information and locations.</p>
        </div>

        <div className="feature-card">
          <PackageCheck className="feature-icon-inline" size={30} />
          <h3>Inventory Visibility</h3>
          <p>Monitor stock quantities and product availability.</p>
        </div>

        <div className="feature-card">
          <ClipboardCheck className="feature-icon-inline" size={30} />
          <h3>Restocking Workflow</h3>
          <p>Keep track of replenishment tasks and stock events.</p>
        </div>
      </div>
    </main>
  );
}