import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { MapPin, Plus, CheckCircle, ShieldCheck, CreditCard, ArrowLeft, ArrowRight, Truck } from "lucide-react";
import { useCart } from "../context/CartContext";
import useAuth from "../hooks/useAuth";
import { useAxios } from "../hooks/useAxios";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { api } = useAxios();
  const { state: cartState, dispatch } = useCart();
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;

  // Direct buy data (if clicked BUY NOW)
  const [directBuy, setDirectBuy] = useState(null);

  // Steps: 1 = Delivery Address, 2 = Order Review & Payment Handoff
  const [currentStep, setCurrentStep] = useState(1);

  // Address state
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(true);

  const [addressForm, setAddressForm] = useState({
    full_name: "",
    phone: "",
    house_flat: "",
    street: "",
    area: "",
    city: "",
    state: "",
    pin_code: "",
    delivery_instructions: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState("");

  // Check Direct Buy or Pending Buy Now
  useEffect(() => {
    if (location.state?.direct_buy) {
      setDirectBuy(location.state.direct_buy);
    } else {
      const stored = sessionStorage.getItem("pending_buy_now");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.direct_buy) {
            setDirectBuy(parsed.direct_buy);
            sessionStorage.removeItem("pending_buy_now");
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [location.state]);

  // Load Saved Addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!accessToken) return;
      try {
        const res = await api.get("/addresses/");
        setSavedAddresses(res.data);
        if (res.data.length > 0) {
          const defaultAddr = res.data.find((a) => a.is_default) || res.data[0];
          setSelectedAddressId(defaultAddr.id);
          setIsNewAddress(false);
        } else {
          setIsNewAddress(true);
        }
      } catch (err) {
        console.error("Could not fetch addresses:", err);
        setIsNewAddress(true);
      }
    };

    fetchAddresses();
  }, [accessToken, api]);

  // Determine items and totals
  const isDirect = !!directBuy;
  const items = isDirect
    ? [
        {
          id: directBuy.product_id,
          product_name: directBuy.product.name,
          price: directBuy.product.price,
          quantity: directBuy.quantity,
          image: directBuy.product.image,
          tax_percent: directBuy.product.tax_percent || 5,
        },
      ]
    : cartState.items || [];

  const subtotal = isDirect
    ? parseFloat(directBuy.product.price) * directBuy.quantity
    : parseFloat(cartState.subtotal || 0);

  const taxAmount = isDirect
    ? subtotal * (parseFloat(directBuy.product.tax_percent || 5) / 100)
    : items.reduce(
        (sum, item) =>
          sum +
          parseFloat(item.price) *
            item.quantity *
            (parseFloat(item.tax_percent || 5) / 100),
        0
      );

  const grandTotal = subtotal + taxAmount;

  // Empty cart safeguard
  if (!isDirect && items.length === 0) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: "60vh" }}>
        <div className="alert alert-warning p-4 mx-auto my-5" style={{ maxWidth: "500px" }}>
          <h4>Your Cart is Empty</h4>
          <p className="text-muted">You have no items in your cart to checkout.</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Explore Products
          </button>
        </div>
      </div>
    );
  }

  // Address Form Validation
  const validateAddress = () => {
    if (!isNewAddress && selectedAddressId) {
      return true;
    }

    const errs = {};
    if (!addressForm.full_name.trim()) errs.full_name = "Full name is required";
    if (!addressForm.phone.trim()) errs.phone = "Mobile phone is required";
    if (!addressForm.house_flat.trim()) errs.house_flat = "House / Flat number is required";
    if (!addressForm.street.trim()) errs.street = "Street address is required";
    if (!addressForm.city.trim()) errs.city = "City is required";
    if (!addressForm.state.trim()) errs.state = "State is required";
    if (!addressForm.pin_code.trim()) errs.pin_code = "PIN / Zip code is required";

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToReview = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateAddress()) return;

    // If new address and opted to save
    if (isNewAddress && saveToProfile) {
      try {
        const res = await api.post("/addresses/", {
          ...addressForm,
          is_default: savedAddresses.length === 0,
        });
        setSavedAddresses((prev) => [res.data, ...prev]);
        setSelectedAddressId(res.data.id);
        setIsNewAddress(false);
      } catch (err) {
        console.warn("Could not save address to profile, continuing with order", err);
      }
    }

    setCurrentStep(2);
  };

  // Place Order Action (Phase 11: Final Payment Handoff)
  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setApiError("");

    try {
      const payload = {};

      if (isDirect) {
        payload.direct_buy = {
          product_id: directBuy.product_id,
          quantity: directBuy.quantity,
        };
      }

      if (selectedAddressId && !isNewAddress) {
        payload.address_id = selectedAddressId;
      } else {
        payload.shippingAddress = {
          address: `${addressForm.house_flat}, ${addressForm.street}${
            addressForm.area ? ", " + addressForm.area : ""
          }`,
          phone: addressForm.phone,
          city: addressForm.city,
          state: addressForm.state,
          zipCode: addressForm.pin_code,
        };
      }

      const res = await api.post("/orders/place/", payload);

      if (res.status === 201 || res.status === 200) {
        if (!isDirect) {
          dispatch({
            type: "SET_CART",
            payload: { items: [], subtotal: 0, total: 0, itemCount: 0 },
          });
        }
        navigate(`/order/success/${res.data.id}`);
      }
    } catch (err) {
      console.error("Order placement failed:", err);
      setApiError(
        err.response?.data?.details ||
          err.response?.data?.error ||
          "Could not place order. Please check stock or address details."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedAddrObj = savedAddresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="py-5 bg-light" style={{ minHeight: "85vh" }}>
      <div className="container">
        {/* Checkout Header */}
        <div className="text-center mb-4">
          <h2 className="fw-bold">
            {isDirect ? "Instant Direct Checkout" : "Complete Your Order"}
          </h2>
          <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
            <span
              className={`badge rounded-pill px-3 py-2 ${
                currentStep === 1 ? "bg-primary text-white" : "bg-success text-white"
              }`}
            >
              1. Delivery Address
            </span>
            <span className="text-muted">─</span>
            <span
              className={`badge rounded-pill px-3 py-2 ${
                currentStep === 2 ? "bg-primary text-white" : "bg-light text-muted border"
              }`}
            >
              2. Review & Payment Handoff
            </span>
          </div>
        </div>

        {apiError && (
          <div className="alert alert-danger mx-auto mb-4" style={{ maxWidth: "800px" }}>
            {apiError}
          </div>
        )}

        <div className="row g-4 justify-content-center">
          {/* Main Step Content */}
          <div className="col-lg-7">
            {/* STEP 1: DELIVERY ADDRESS */}
            {currentStep === 1 && (
              <div className="card border-0 shadow-sm p-4 rounded-3">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <MapPin className="text-primary" size={20} />
                  Choose Delivery Destination
                </h5>

                {/* Saved Address Radio Selection */}
                {savedAddresses.length > 0 && (
                  <div className="mb-4">
                    <label className="form-label small fw-semibold text-muted">
                      Your Saved Addresses:
                    </label>
                    <div className="d-flex flex-column gap-2">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`card p-3 cursor-pointer border ${
                            !isNewAddress && selectedAddressId === addr.id
                              ? "border-primary bg-primary-subtle"
                              : "bg-white"
                          }`}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedAddressId(addr.id);
                            setIsNewAddress(false);
                          }}
                        >
                          <div className="d-flex align-items-start gap-2">
                            <input
                              type="radio"
                              name="addressRadio"
                              className="form-check-input mt-1"
                              checked={!isNewAddress && selectedAddressId === addr.id}
                              onChange={() => {
                                setSelectedAddressId(addr.id);
                                setIsNewAddress(false);
                              }}
                            />
                            <div className="flex-grow-1">
                              <div className="fw-bold d-flex align-items-center gap-2">
                                {addr.full_name}
                                {addr.is_default && (
                                  <span className="badge bg-primary" style={{ fontSize: "10px" }}>
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="small text-muted">
                                {addr.house_flat}, {addr.street}
                                {addr.area ? `, ${addr.area}` : ""}, {addr.city}, {addr.state} -{" "}
                                <strong>{addr.pin_code}</strong>
                              </div>
                              <div className="small text-dark mt-1">Phone: {addr.phone}</div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add New Address Option */}
                      <button
                        type="button"
                        className={`btn text-start p-3 border border-dashed rounded-3 ${
                          isNewAddress ? "border-primary bg-white fw-bold text-primary" : "text-muted bg-light"
                        }`}
                        onClick={() => setIsNewAddress(true)}
                      >
                        <Plus size={18} className="me-2" />
                        + Deliver to a Different / New Address
                      </button>
                    </div>
                  </div>
                )}

                {/* New Address Form */}
                {isNewAddress && (
                  <form onSubmit={handleProceedToReview}>
                    <h6 className="fw-bold mt-2 mb-3">Enter New Delivery Address</h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Full Name *</label>
                        <input
                          type="text"
                          className={`form-control ${formErrors.full_name ? "is-invalid" : ""}`}
                          value={addressForm.full_name}
                          onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                        />
                        {formErrors.full_name && (
                          <div className="invalid-feedback">{formErrors.full_name}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Mobile Number *</label>
                        <input
                          type="tel"
                          className={`form-control ${formErrors.phone ? "is-invalid" : ""}`}
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        />
                        {formErrors.phone && (
                          <div className="invalid-feedback">{formErrors.phone}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Flat / House No. *</label>
                        <input
                          type="text"
                          className={`form-control ${formErrors.house_flat ? "is-invalid" : ""}`}
                          value={addressForm.house_flat}
                          onChange={(e) => setAddressForm({ ...addressForm, house_flat: e.target.value })}
                        />
                        {formErrors.house_flat && (
                          <div className="invalid-feedback">{formErrors.house_flat}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Street / Road *</label>
                        <input
                          type="text"
                          className={`form-control ${formErrors.street ? "is-invalid" : ""}`}
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        />
                        {formErrors.street && (
                          <div className="invalid-feedback">{formErrors.street}</div>
                        )}
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">City *</label>
                        <input
                          type="text"
                          className={`form-control ${formErrors.city ? "is-invalid" : ""}`}
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        />
                        {formErrors.city && (
                          <div className="invalid-feedback">{formErrors.city}</div>
                        )}
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">State *</label>
                        <input
                          type="text"
                          className={`form-control ${formErrors.state ? "is-invalid" : ""}`}
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        />
                        {formErrors.state && (
                          <div className="invalid-feedback">{formErrors.state}</div>
                        )}
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">PIN Code *</label>
                        <input
                          type="text"
                          className={`form-control ${formErrors.pin_code ? "is-invalid" : ""}`}
                          value={addressForm.pin_code}
                          onChange={(e) => setAddressForm({ ...addressForm, pin_code: e.target.value })}
                        />
                        {formErrors.pin_code && (
                          <div className="invalid-feedback">{formErrors.pin_code}</div>
                        )}
                      </div>

                      <div className="col-12">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="saveAddressCheck"
                            checked={saveToProfile}
                            onChange={(e) => setSaveToProfile(e.target.checked)}
                          />
                          <label className="form-check-label small" htmlFor="saveAddressCheck">
                            Save this delivery address to my account profile
                          </label>
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                  <Link to={isDirect ? `/product/${directBuy.product_id}` : "/cart"} className="text-decoration-none text-muted small">
                    <ArrowLeft size={16} className="me-1" />
                    Back
                  </Link>
                  <button
                    type="button"
                    className="btn btn-primary px-4 d-flex align-items-center gap-2"
                    onClick={handleProceedToReview}
                  >
                    Continue to Order Summary
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: REVIEW & PAYMENT HANDOFF */}
            {currentStep === 2 && (
              <div className="card border-0 shadow-sm p-4 rounded-3">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <ShieldCheck className="text-success" size={22} />
                  Review & Confirm Order
                </h5>

                {/* Delivery Address Summary Box */}
                <div className="card bg-light border-0 p-3 mb-4 rounded-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold mb-0 text-dark">
                      <Truck size={18} className="text-primary me-2" />
                      Delivering To:
                    </h6>
                    <button
                      className="btn btn-link btn-sm text-primary p-0"
                      onClick={() => setCurrentStep(1)}
                    >
                      Change
                    </button>
                  </div>
                  {selectedAddrObj && !isNewAddress ? (
                    <p className="mb-0 small text-muted">
                      <strong>{selectedAddrObj.full_name}</strong> ({selectedAddrObj.phone})<br />
                      {selectedAddrObj.house_flat}, {selectedAddrObj.street}
                      {selectedAddrObj.area ? `, ${selectedAddrObj.area}` : ""}<br />
                      {selectedAddrObj.city}, {selectedAddrObj.state} - {selectedAddrObj.pin_code}
                    </p>
                  ) : (
                    <p className="mb-0 small text-muted">
                      <strong>{addressForm.full_name}</strong> ({addressForm.phone})<br />
                      {addressForm.house_flat}, {addressForm.street}
                      {addressForm.area ? `, ${addressForm.area}` : ""}<br />
                      {addressForm.city}, {addressForm.state} - {addressForm.pin_code}
                    </p>
                  )}
                </div>

                {/* Payment Handoff Notice (Phase 11 Compliance) */}
                <div className="alert alert-info border-0 p-3 mb-4 rounded-3">
                  <div className="d-flex gap-2">
                    <CreditCard size={20} className="text-primary flex-shrink-0 mt-1" />
                    <div className="small">
                      <strong>Payment Gateway Handoff Point</strong>
                      <p className="mb-0 text-muted mt-1">
                        Clicking <strong>"Confirm Order"</strong> records your order securely in the Django database as <strong>Pending Payment</strong>. Payment integration can be seamlessly connected to this stage.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Place Order Action */}
                <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back to Address
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg px-4 fw-bold"
                    disabled={isProcessing}
                    onClick={handlePlaceOrder}
                  >
                    {isProcessing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Processing Order...
                      </>
                    ) : (
                      `Confirm Order ($${grandTotal.toFixed(2)})`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side Order Summary Sidebar */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm p-4 rounded-3 position-sticky" style={{ top: "90px" }}>
              <h5 className="fw-bold mb-3">Order Summary</h5>

              {/* Items List */}
              <div className="d-flex flex-column gap-3 mb-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
                {items.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-3 pb-2 border-bottom">
                    <img
                      src={item.image}
                      alt={item.product_name}
                      style={{ width: "55px", height: "55px", objectFit: "contain" }}
                      className="rounded border p-1 bg-white"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200";
                      }}
                    />
                    <div className="flex-grow-1 small">
                      <div className="fw-semibold text-truncate" style={{ maxWidth: "180px" }}>
                        {item.product_name}
                      </div>
                      <div className="text-muted">
                        Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                      </div>
                    </div>
                    <div className="fw-bold small">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="small">
                <div className="d-flex justify-content-between mb-2 text-muted">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 text-muted">
                  <span>Estimated Tax (5%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 text-muted">
                  <span>Shipping</span>
                  <span className="text-success fw-semibold">FREE</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fs-5 fw-bold text-dark mb-1">
                  <span>Grand Total</span>
                  <span className="text-primary">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
