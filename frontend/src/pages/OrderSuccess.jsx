import { Link, useParams } from "react-router-dom";
import { CheckCircle, Package, ArrowRight, CreditCard } from "lucide-react";

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="container py-5" style={{ minHeight: "80vh" }}>
      <div className="row justify-content-center">
        <div className="col-lg-6 text-center">
          {/* Success Icon */}
          <div className="mb-4 mt-5">
            <CheckCircle className="text-success mx-auto" size={80} />
          </div>

          {/* Main Message */}
          <h1 className="display-5 fw-bold text-dark mb-2">Order Confirmed!</h1>
          {id && (
            <div className="badge bg-primary-subtle text-primary fs-6 px-3 py-2 rounded-pill mb-4">
              Order Reference #{id}
            </div>
          )}

          <p className="lead text-muted mb-4">
            Thank you for your purchase. Your order has been successfully recorded in our system.
          </p>

          {/* Payment Handoff Notice */}
          <div className="card bg-light border-0 p-3 mb-5 text-start rounded-3">
            <div className="d-flex gap-2">
              <CreditCard size={20} className="text-primary mt-1 flex-shrink-0" />
              <div className="small text-muted">
                <strong className="text-dark">Ready for Payment Integration</strong>
                <p className="mb-0 mt-1">
                  This order is stored in your Django database under status <strong>PENDING</strong>. Your future custom payment method will connect directly here to mark it confirmed upon transaction receipt.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
            <Link to="/" className="btn btn-primary btn-lg px-4 py-3 d-flex align-items-center justify-content-center gap-2">
              Continue Shopping
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/dashboard/orders"
              className="btn btn-outline-dark btn-lg px-4 py-3 d-flex align-items-center justify-content-center gap-2"
            >
              <Package size={18} />
              View Order History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
