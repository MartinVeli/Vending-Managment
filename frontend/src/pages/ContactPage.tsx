import { Mail, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="page-container content-page">
      <span className="eyebrow">GET IN TOUCH</span>
      <h1>Contact Us</h1>

      <p>
        Have a question about VendFlow or want to learn more
        about the project?
      </p>

      <div className="contact-card">
        <MessageCircle size={34} />
        <h2>We'd love to hear from you</h2>
        <p>
          Contact information and support options will be
          available here.
        </p>
        <Mail size={22} />
      </div>
    </main>
  );
}