import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, MapPin, CheckCircle } from "lucide-react";
import { useAxios } from "../hooks/useAxios";

const Addresses = () => {
  const { api } = useAxios();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const initialForm = {
    full_name: "",
    phone: "",
    house_flat: "",
    street: "",
    area: "",
    city: "",
    state: "",
    pin_code: "",
    delivery_instructions: "",
    is_default: false,
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/addresses/");
      setAddresses(res.data);
    } catch (err) {
      console.error("Failed to load addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setError("");
    setShowModal(true);
  };

  const handleOpenEdit = (addr) => {
    setEditingId(addr.id);
    setFormData({
      full_name: addr.full_name || "",
      phone: addr.phone || "",
      house_flat: addr.house_flat || "",
      street: addr.street || "",
      area: addr.area || "",
      city: addr.city || "",
      state: addr.state || "",
      pin_code: addr.pin_code || "",
      delivery_instructions: addr.delivery_instructions || "",
      is_default: addr.is_default || false,
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.full_name || !formData.phone || !formData.house_flat || !formData.street || !formData.city || !formData.state || !formData.pin_code) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/addresses/${editingId}/`, formData);
        setSuccess("Address updated successfully!");
      } else {
        await api.post("/addresses/", formData);
        setSuccess("New address added successfully!");
      }
      setShowModal(false);
      fetchAddresses();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Failed to save address:", err);
      setError(err.response?.data?.error || "Failed to save address. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await api.delete(`/addresses/${id}/`);
      setSuccess("Address deleted successfully.");
      fetchAddresses();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Failed to delete address:", err);
      alert("Failed to delete address.");
    }
  };

  const handleSetDefault = async (addr) => {
    try {
      await api.patch(`/addresses/${addr.id}/`, { is_default: true });
      fetchAddresses();
    } catch (err) {
      console.error("Failed to set default address:", err);
    }
  };

  return (
    <div className="card border-0 shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Saved Delivery Addresses</h4>
          <p className="text-muted small mb-0">Manage and save your shipping destinations for faster checkout.</p>
        </div>
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" onClick={handleOpenAdd}>
          <Plus size={18} />
          Add New Address
        </button>
      </div>

      {success && <div className="alert alert-success py-2">{success}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-5 border rounded bg-light">
          <MapPin size={40} className="text-muted mb-2" />
          <h6 className="fw-semibold">No Saved Addresses</h6>
          <p className="text-muted small mb-3">You have not added any delivery addresses yet.</p>
          <button className="btn btn-outline-primary btn-sm" onClick={handleOpenAdd}>
            Add Address Now
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {addresses.map((addr) => (
            <div className="col-md-6" key={addr.id}>
              <div className={`card h-100 p-3 ${addr.is_default ? "border-primary bg-light" : "border"}`}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="fw-bold mb-0 d-flex align-items-center gap-1">
                    {addr.full_name}
                    {addr.is_default && (
                      <span className="badge bg-primary ms-1" style={{ fontSize: "10px" }}>
                        Default
                      </span>
                    )}
                  </h6>
                  <div className="d-flex gap-1">
                    <button
                      className="btn btn-sm btn-link text-primary p-0 me-2"
                      onClick={() => handleOpenEdit(addr)}
                      title="Edit Address"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-link text-danger p-0"
                      onClick={() => handleDelete(addr.id)}
                      title="Delete Address"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-muted small mb-2 flex-grow-1">
                  {addr.house_flat}, {addr.street}
                  {addr.area ? `, ${addr.area}` : ""}<br />
                  {addr.city}, {addr.state} - <strong>{addr.pin_code}</strong><br />
                  <span className="text-dark">Phone: {addr.phone}</span>
                </p>

                {addr.delivery_instructions && (
                  <div className="bg-white p-2 rounded small text-muted border mb-2">
                    <em>Note: {addr.delivery_instructions}</em>
                  </div>
                )}

                {!addr.is_default && (
                  <button
                    className="btn btn-outline-secondary btn-sm mt-auto w-100"
                    style={{ fontSize: "12px" }}
                    onClick={() => handleSetDefault(addr)}
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {editingId ? "Edit Delivery Address" : "Add New Delivery Address"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {error && <div className="alert alert-danger py-2">{error}</div>}

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Full Name *</label>
                      <input
                        type="text"
                        name="full_name"
                        className="form-control"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Mobile Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Flat / House No. / Building *</label>
                      <input
                        type="text"
                        name="house_flat"
                        className="form-control"
                        value={formData.house_flat}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Street / Road Name *</label>
                      <input
                        type="text"
                        name="street"
                        className="form-control"
                        value={formData.street}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Area / Landmark (Optional)</label>
                      <input
                        type="text"
                        name="area"
                        className="form-control"
                        value={formData.area}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">City *</label>
                      <input
                        type="text"
                        name="city"
                        className="form-control"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">State *</label>
                      <input
                        type="text"
                        name="state"
                        className="form-control"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">PIN Code / ZIP Code *</label>
                      <input
                        type="text"
                        name="pin_code"
                        className="form-control"
                        value={formData.pin_code}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-semibold">Delivery Instructions (Optional)</label>
                      <textarea
                        name="delivery_instructions"
                        rows="2"
                        className="form-control"
                        placeholder="e.g. Leave with security / Ring bell twice"
                        value={formData.delivery_instructions}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="is_default"
                          name="is_default"
                          checked={formData.is_default}
                          onChange={handleChange}
                        />
                        <label className="form-check-label small" htmlFor="is_default">
                          Make this my default delivery address
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? "Update Address" : "Save Address"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;
