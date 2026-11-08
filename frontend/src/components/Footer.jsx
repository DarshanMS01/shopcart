import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  Mail,
  MapPin,
  HelpCircle,
  Package,
  RotateCcw,
  ShieldCheck,
  ExternalLink,
  ShoppingBag,
  ArrowRight,
  X,
  Heart,
  Clock,
} from "lucide-react";

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null);

  const closeModal = () => setActiveModal(null);

  const scrollToProducts = (e) => {
    const el = document.getElementById("products");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      className="w-100 text-light mt-auto position-relative"
      style={{
        backgroundColor: "#0B132B",
        backgroundImage: "linear-gradient(180deg, #0F172A 0%, #070B16 100%)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* 1. TOP BRAND & DELIVERY HIGHLIGHT BAR */}
      <div
        className="w-100 py-3"
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
          backgroundColor: "rgba(255, 255, 255, 0.02)",
        }}
      >
        <div className="container">
          <div className="row align-items-center gy-3">
            {/* Brand Intro & Tagline */}
            <div className="col-lg-6 col-md-12 text-center text-lg-start">
              <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-2 mb-1">
                <span
                  className="fw-bold fs-4 tracking-tight"
                  style={{
                    color: "#FFFFFF",
                    letterSpacing: "-0.5px",
                  }}
                >
                  shopmart<span style={{ color: "#38BDF8" }}>.</span>
                </span>
                <span
                  className="badge px-2 py-1 rounded-pill"
                  style={{
                    backgroundColor: "rgba(56, 189, 248, 0.12)",
                    color: "#38BDF8",
                    fontSize: "11px",
                    border: "1px solid rgba(56, 189, 248, 0.25)",
                  }}
                >
                  Official Store
                </span>
              </div>
              <p
                className="mb-0 small fw-medium"
                style={{ color: "#94A3B8", letterSpacing: "0.2px" }}
              >
                &ldquo;Good products. Better everyday.&rdquo;
              </p>
              <p
                className="mb-0 small text-truncate-2"
                style={{ color: "#64748B", fontSize: "12.5px" }}
              >
                Discover products that make everyday life easier. Explore
                technology, lifestyle and essentials &mdash; all in one place.
              </p>
            </div>

            {/* Delivery Information Section */}
            <div className="col-lg-6 col-md-12">
              <div
                className="d-flex align-items-center justify-content-center justify-content-lg-end p-2 px-3 rounded-3"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <div
                  className="rounded-circle p-2 d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                  style={{
                    backgroundColor: "rgba(56, 189, 248, 0.12)",
                    color: "#38BDF8",
                    width: "42px",
                    height: "42px",
                  }}
                >
                  <Truck size={22} />
                </div>
                <div className="text-start">
                  <div
                    className="small fw-semibold text-white d-flex align-items-center gap-1"
                  >
                    <span>Reliable Doorstep Delivery</span>
                    <span
                      className="badge rounded-pill"
                      style={{
                        backgroundColor: "#10B981",
                        fontSize: "9px",
                        padding: "2px 6px",
                      }}
                    >
                      Active
                    </span>
                  </div>
                  <div style={{ color: "#94A3B8", fontSize: "12px" }}>
                    Track real-time shipment updates in{" "}
                    <Link
                      to="/dashboard/orders"
                      className="text-decoration-none fw-semibold"
                      style={{ color: "#38BDF8" }}
                    >
                      Your Orders &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOUR BALANCED COLUMNS */}
      <div className="container py-5">
        <div className="row g-4">
          {/* COLUMN 1: DISCOVER */}
          <div className="col-lg-3 col-sm-6 col-12">
            <h6
              className="text-white text-uppercase fw-bold mb-3 d-flex align-items-center gap-2"
              style={{
                fontSize: "13px",
                letterSpacing: "1px",
              }}
            >
              <ShoppingBag size={15} style={{ color: "#38BDF8" }} />
              Discover
            </h6>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
              <li>
                <a
                  href="/#products"
                  onClick={scrollToProducts}
                  className="footer-nav-link text-decoration-none d-inline-flex align-items-center gap-1"
                >
                  Explore all products
                </a>
              </li>
              <li>
                <a
                  href="/#products"
                  onClick={scrollToProducts}
                  className="footer-nav-link text-decoration-none d-inline-flex align-items-center gap-1"
                >
                  Browse categories
                </a>
              </li>
              <li>
                <a
                  href="/#products"
                  onClick={scrollToProducts}
                  className="footer-nav-link text-decoration-none d-inline-flex align-items-center gap-1"
                >
                  Latest arrivals
                </a>
              </li>
              <li>
                <a
                  href="/#products"
                  onClick={scrollToProducts}
                  className="footer-nav-link text-decoration-none d-inline-flex align-items-center gap-1"
                >
                  Popular products
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 2: YOUR SHOPPING */}
          <div className="col-lg-3 col-sm-6 col-12">
            <h6
              className="text-white text-uppercase fw-bold mb-3 d-flex align-items-center gap-2"
              style={{
                fontSize: "13px",
                letterSpacing: "1px",
              }}
            >
              <Package size={15} style={{ color: "#38BDF8" }} />
              Your Shopping
            </h6>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
              <li>
                <Link
                  to="/dashboard"
                  className="footer-nav-link text-decoration-none"
                >
                  Your account
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="footer-nav-link text-decoration-none"
                >
                  Shopping cart
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/orders"
                  className="footer-nav-link text-decoration-none"
                >
                  Your orders
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="footer-nav-link text-decoration-none"
                >
                  Saved favourites
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: WE'RE HERE TO HELP */}
          <div className="col-lg-3 col-sm-6 col-12">
            <h6
              className="text-white text-uppercase fw-bold mb-3 d-flex align-items-center gap-2"
              style={{
                fontSize: "13px",
                letterSpacing: "1px",
              }}
            >
              <HelpCircle size={15} style={{ color: "#38BDF8" }} />
              We&apos;re Here to Help
            </h6>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
              <li>
                <a
                  href="mailto:yadavdarshanms@email.com"
                  className="footer-nav-link text-decoration-none"
                >
                  Contact us
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal("faq")}
                  className="footer-nav-link btn btn-link p-0 text-start text-decoration-none border-0 small"
                  style={{ fontSize: "14px" }}
                >
                  Frequently asked questions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal("shipping")}
                  className="footer-nav-link btn btn-link p-0 text-start text-decoration-none border-0 small"
                  style={{ fontSize: "14px" }}
                >
                  Shipping information
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal("returns")}
                  className="footer-nav-link btn btn-link p-0 text-start text-decoration-none border-0 small"
                  style={{ fontSize: "14px" }}
                >
                  Returns information
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: GET IN TOUCH */}
          <div className="col-lg-3 col-sm-6 col-12">
            <h6
              className="text-white text-uppercase fw-bold mb-3 d-flex align-items-center gap-2"
              style={{
                fontSize: "13px",
                letterSpacing: "1px",
              }}
            >
              <Mail size={15} style={{ color: "#38BDF8" }} />
              Get in Touch
            </h6>
            <div className="d-flex flex-column gap-2 small">
              <a
                href="mailto:yadavdarshanms@email.com"
                className="footer-nav-link text-decoration-none d-flex align-items-center gap-2"
              >
                <Mail size={15} style={{ color: "#38BDF8" }} />
                <span>yadavdarshanms@email.com</span>
              </a>

              <div
                className="d-flex align-items-center gap-2"
                style={{ color: "#94A3B8" }}
              >
                <MapPin size={15} style={{ color: "#EF4444" }} />
                <span>Bangalore, India</span>
              </div>

              <div
                className="d-flex align-items-center gap-2 mt-1"
                style={{ color: "#64748B", fontSize: "12px" }}
              >
                <Clock size={14} />
                <span>Mon &ndash; Sat: 9:00 AM &ndash; 7:00 PM IST</span>
              </div>

              <div className="mt-2">
                <span
                  className="badge px-2 py-1 rounded-pill"
                  style={{
                    backgroundColor: "rgba(16, 185, 129, 0.12)",
                    color: "#10B981",
                    fontSize: "11px",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                  }}
                >
                  ● Active Customer Support
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FINE HORIZONTAL DIVIDER */}
      <div
        className="w-100"
        style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
      ></div>

      {/* 4. BOTTOM COPYRIGHT SECTION */}
      <div className="container py-4">
        <div className="row align-items-center gy-2">
          {/* Copyright notice */}
          <div className="col-md-6 col-12 text-center text-md-start">
            <p
              className="mb-0 small"
              style={{ color: "#94A3B8", fontSize: "13px" }}
            >
              &copy; 2026 Shopmart. All rights reserved.
            </p>
          </div>

          {/* Independent Creation Credit */}
          <div className="col-md-6 col-12 text-center text-md-end">
            <p
              className="mb-0 small"
              style={{ color: "#94A3B8", fontSize: "13px" }}
            >
              An independent creation, crafted with{" "}
              <span style={{ color: "#EF4444" }}>❤️</span> by{" "}
              <a
                href="https://github.com/DarshanMS01"
                target="_blank"
                rel="noopener noreferrer"
                className="fw-semibold text-decoration-none"
                style={{ color: "#38BDF8" }}
              >
                Darshan MS
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* 5. INTERACTIVE INFORMATION MODAL */}
      {activeModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 1060,
          }}
          onClick={closeModal}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ maxWidth: "560px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content text-light border-0 shadow-lg rounded-4"
              style={{
                backgroundColor: "#0F172A",
                border: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            >
              {/* Modal Header */}
              <div
                className="modal-header border-0 pb-0 pt-4 px-4 d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center gap-2">
                  {activeModal === "faq" && (
                    <HelpCircle size={22} style={{ color: "#38BDF8" }} />
                  )}
                  {activeModal === "shipping" && (
                    <Truck size={22} style={{ color: "#38BDF8" }} />
                  )}
                  {activeModal === "returns" && (
                    <RotateCcw size={22} style={{ color: "#38BDF8" }} />
                  )}
                  <h5 className="modal-title fw-bold text-white mb-0">
                    {activeModal === "faq" && "Frequently Asked Questions"}
                    {activeModal === "shipping" && "Shipping Information"}
                    {activeModal === "returns" && "Returns & Exchanges Policy"}
                  </h5>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-1"
                  style={{ width: "32px", height: "32px" }}
                  onClick={closeModal}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="modal-body px-4 py-3" style={{ color: "#CBD5E1" }}>
                {activeModal === "faq" && (
                  <div className="d-flex flex-column gap-3 small">
                    <div
                      className="p-3 rounded-3"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}
                    >
                      <h6 className="fw-semibold text-white mb-1">
                        How do I place an order on Shopmart?
                      </h6>
                      <p className="mb-0 text-muted">
                        Browse any product in our catalogue, select your desired
                        quantity, add to your cart or click &quot;Buy Now&quot;,
                        and proceed through our streamlined checkout.
                      </p>
                    </div>

                    <div
                      className="p-3 rounded-3"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}
                    >
                      <h6 className="fw-semibold text-white mb-1">
                        Where can I track my existing orders?
                      </h6>
                      <p className="mb-0 text-muted">
                        Head over to your{" "}
                        <Link
                          to="/dashboard/orders"
                          onClick={closeModal}
                          style={{ color: "#38BDF8" }}
                        >
                          Your Orders
                        </Link>{" "}
                        section in your account dashboard to view itemized
                        status and delivery progression.
                      </p>
                    </div>

                    <div
                      className="p-3 rounded-3"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}
                    >
                      <h6 className="fw-semibold text-white mb-1">
                        Are customer accounts required to purchase?
                      </h6>
                      <p className="mb-0 text-muted">
                        Yes, creating a free account ensures your delivery
                        addresses and order history are securely saved for future
                        convenience.
                      </p>
                    </div>
                  </div>
                )}

                {activeModal === "shipping" && (
                  <div className="d-flex flex-column gap-3 small">
                    <div
                      className="p-3 rounded-3"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}
                    >
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <Truck size={18} style={{ color: "#10B981" }} />
                        <h6 className="fw-semibold text-white mb-0">
                          Domestic Dispatch &amp; Delivery
                        </h6>
                      </div>
                      <p className="mb-0 text-muted">
                        Orders are carefully packaged and dispatched within 24
                        to 48 business hours. Standard delivery timeline across
                        major metropolitan hubs is 3&ndash;5 working days.
                      </p>
                    </div>

                    <div
                      className="p-3 rounded-3"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}
                    >
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <ShieldCheck size={18} style={{ color: "#38BDF8" }} />
                        <h6 className="fw-semibold text-white mb-0">
                          Secure Packaging
                        </h6>
                      </div>
                      <p className="mb-0 text-muted">
                        All tech accessories and home lifestyle electronics are
                        packed in tamper-evident cushioning to guarantee pristine
                        condition on arrival.
                      </p>
                    </div>
                  </div>
                )}

                {activeModal === "returns" && (
                  <div className="d-flex flex-column gap-3 small">
                    <div
                      className="p-3 rounded-3"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}
                    >
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <RotateCcw size={18} style={{ color: "#38BDF8" }} />
                        <h6 className="fw-semibold text-white mb-0">
                          7-Day Easy Returns Policy
                        </h6>
                      </div>
                      <p className="mb-0 text-muted">
                        We accept returns on eligible items within 7 days of
                        delivery. Returned items must be unused, in their
                        original retail packaging with all manuals and
                        accessories intact.
                      </p>
                    </div>

                    <div
                      className="p-3 rounded-3"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}
                    >
                      <h6 className="fw-semibold text-white mb-1">
                        Need assistance with a return?
                      </h6>
                      <p className="mb-0 text-muted">
                        Contact our support team directly at{" "}
                        <a
                          href="mailto:yadavdarshanms@email.com"
                          style={{ color: "#38BDF8" }}
                        >
                          yadavdarshanms@email.com
                        </a>{" "}
                        with your Order ID.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="modal-footer border-0 pt-0 px-4 pb-4">
                <button
                  type="button"
                  className="btn btn-primary btn-sm px-4 rounded-pill"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scoped CSS for Footer Links & Transitions */}
      <style>{`
        .footer-nav-link {
          color: #94A3B8;
          transition: all 0.2s ease-in-out;
        }
        .footer-nav-link:hover {
          color: #38BDF8 !important;
          transform: translateX(3px);
        }
        .tracking-tight {
          letter-spacing: -0.5px;
        }
      `}</style>
    </footer>
  );
}
