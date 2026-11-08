import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ShoppingCart,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  Eye,
  Check,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { api } from "../api";
import QuantitySelector from "../components/QuantitySelector";
import { useCart } from "../context/CartContext";
import useAuth from "../hooks/useAuth";
import { useAxios } from "../hooks/useAxios";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api: axiosApi } = useAxios();
  const { state: cartState, dispatch } = useCart();
  const { auth } = useAuth();
  const accessToken = auth?.accessToken;

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(null);

  // Fetch Product Details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}/`);
        setProduct(res.data);
        setError(null);

        // Fetch related products from same category
        if (res.data?.category) {
          try {
            const relRes = await api.get(
              `/products/?category=${encodeURIComponent(res.data.category)}`
            );
            setRelatedProducts(
              relRes.data.filter((p) => p.id !== parseInt(id)).slice(0, 4)
            );
          } catch (e) {
            console.error("Could not fetch related products", e);
          }
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(
          err.response?.status === 404
            ? "Product Not Found"
            : "Failed to load product details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
      setSelectedQuantity(1);
    }
  }, [id]);

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (!accessToken) {
      navigate(`/login?redirect=/product/${product.id}`);
      return;
    }

    try {
      const response = await axiosApi.post("/cart/add/", {
        product_id: product.id,
        quantity: selectedQuantity,
      });

      dispatch({
        type: "SET_CART",
        payload: {
          items: response.data.items,
          subtotal: response.data.subtotal || 0,
          total: response.data.grand_total || 0,
          itemCount: response.data.items?.length,
        },
      });

      setAddedToast(`Added ${selectedQuantity}x "${product.name}" to your cart!`);
      setTimeout(() => setAddedToast(null), 4000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert(err.response?.data?.details || "Failed to add product to cart.");
    }
  };

  // Handle BUY NOW: Direct Checkout Action
  const handleBuyNow = () => {
    if (product.stock < selectedQuantity) {
      alert(`Only ${product.stock} items are available in stock.`);
      return;
    }

    const buyNowPayload = {
      direct_buy: {
        product_id: product.id,
        quantity: selectedQuantity,
        product: product,
      },
    };

    if (!accessToken) {
      // Store pending buy now in sessionStorage so after login, user proceeds directly
      sessionStorage.setItem("pending_buy_now", JSON.stringify(buyNowPayload));
      navigate(`/login?redirect=/checkout`);
      return;
    }

    // Direct checkout with product
    navigate("/checkout", { state: buyNowPayload });
  };

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary my-5" role="status">
          <span className="visually-hidden">Loading product...</span>
        </div>
        <p className="text-muted">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: "60vh" }}>
        <div className="alert alert-danger my-5 p-4 mx-auto" style={{ maxWidth: "500px" }}>
          <h4>{error || "Product Not Found"}</h4>
          <p className="text-muted">The product you are looking for does not exist or has been removed.</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const specs = product.specifications || {};

  return (
    <div className="py-5 bg-light" style={{ minHeight: "90vh" }}>
      {/* Toast Alert */}
      {addedToast && (
        <div
          className="alert alert-success position-fixed top-0 end-0 m-4 shadow-lg d-flex align-items-center gap-2"
          style={{ zIndex: 1050, minWidth: "320px" }}
        >
          <Check size={22} className="text-success" />
          <div className="flex-grow-1">
            <div className="fw-bold">Item Added!</div>
            <div className="small">{addedToast}</div>
          </div>
          <button
            className="btn-close btn-sm"
            onClick={() => setAddedToast(null)}
          ></button>
        </div>
      )}

      <div className="container">
        {/* Navigation Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-muted">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/#products" className="text-decoration-none text-muted">
                {product.category || "Products"}
              </Link>
            </li>
            <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Main Product Card */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
          <div className="row g-0">
            {/* LEFT SIDE: HD Image Gallery */}
            <div className="col-lg-6 bg-white p-4 p-md-5 d-flex align-items-center justify-content-center border-end">
              <div className="position-relative w-100 text-center">
                {product.discount_percent > 0 && (
                  <span className="badge bg-danger position-absolute top-0 start-0 px-3 py-2 fs-6 shadow-sm">
                    {product.discount_percent}% OFF
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="img-fluid rounded-3"
                  style={{
                    maxHeight: "440px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800";
                  }}
                />
              </div>
            </div>

            {/* RIGHT SIDE: Product Details & Action Buttons */}
            <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-between bg-white">
              <div>
                <span className="badge bg-secondary-subtle text-dark mb-2 px-3 py-1">
                  {product.category}
                </span>

                <h1 className="h2 fw-bold text-dark mb-2">{product.name}</h1>

                {/* Price Line */}
                <div className="d-flex align-items-baseline gap-3 my-3">
                  <span className="display-6 fw-bold text-primary">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                  {product.original_price && parseFloat(product.original_price) > parseFloat(product.price) && (
                    <span className="text-muted text-decoration-line-through fs-5">
                      ${parseFloat(product.original_price).toFixed(2)}
                    </span>
                  )}
                  {product.discount_percent > 0 && (
                    <span className="badge bg-danger-subtle text-danger fw-semibold px-2 py-1">
                      Save {product.discount_percent}%
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-3">
                  {product.stock > 0 ? (
                    <span className="text-success fw-semibold small d-flex align-items-center gap-1">
                      <span className="p-1 bg-success rounded-circle d-inline-block"></span>
                      In Stock ({product.stock} units available)
                    </span>
                  ) : (
                    <span className="text-danger fw-semibold small d-flex align-items-center gap-1">
                      <span className="p-1 bg-danger rounded-circle d-inline-block"></span>
                      Currently Out of Stock
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-muted mb-4" style={{ lineHeight: "1.7" }}>
                  {product.description}
                </p>

                {/* Specifications List */}
                {Object.keys(specs).length > 0 && (
                  <div className="card bg-light border-0 p-3 mb-4 rounded-3">
                    <h6 className="fw-bold mb-2 small text-uppercase text-secondary">
                      Key Specifications
                    </h6>
                    <div className="row g-2 small">
                      {Object.entries(specs).map(([key, val]) => (
                        <div className="col-sm-6" key={key}>
                          <span className="text-muted">{key}: </span>
                          <strong className="text-dark">{val}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-4">
                  <label className="form-label small fw-semibold text-secondary">
                    Select Quantity:
                  </label>
                  <div className="d-flex align-items-center gap-3">
                    <QuantitySelector
                      quantity={selectedQuantity}
                      onQuantityChange={(newQty) => setSelectedQuantity(newQty)}
                      min={1}
                      max={product.stock || 1}
                    />
                    <small className="text-muted">
                      Max: {product.stock} per order
                    </small>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS: Add to Cart and BUY NOW */}
              <div>
                <div className="row g-2 mb-4">
                  {/* ADD TO CART */}
                  <div className="col-sm-6">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-lg w-100 fw-semibold d-flex align-items-center justify-content-center gap-2 py-3 shadow-sm"
                      disabled={product.stock === 0}
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart size={20} />
                      Add to Cart
                    </button>
                  </div>

                  {/* BUY NOW */}
                  <div className="col-sm-6">
                    <button
                      type="button"
                      className="btn btn-primary btn-lg w-100 fw-bold d-flex align-items-center justify-content-center gap-2 py-3 shadow"
                      disabled={product.stock === 0}
                      onClick={handleBuyNow}
                    >
                      <Zap size={20} />
                      BUY NOW
                    </button>
                  </div>
                </div>

                {/* Trust & Guarantee Badges */}
                <div className="border-top pt-3">
                  <div className="row text-center text-muted small g-2">
                    <div className="col-4">
                      <Truck size={20} className="text-primary mb-1 d-block mx-auto" />
                      <span>Free Express Shipping</span>
                    </div>
                    <div className="col-4">
                      <ShieldCheck size={20} className="text-success mb-1 d-block mx-auto" />
                      <span>1-Year Official Warranty</span>
                    </div>
                    <div className="col-4">
                      <RotateCcw size={20} className="text-info mb-1 d-block mx-auto" />
                      <span>7-Day Easy Returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-5">
            <h4 className="fw-bold mb-4">Related in {product.category}</h4>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
              {relatedProducts.map((rel) => (
                <div key={rel.id} className="col">
                  <div className="card h-100 border-0 shadow-sm p-3 rounded-3 text-center">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="img-fluid mb-2 mx-auto"
                      style={{ height: "140px", objectFit: "contain" }}
                    />
                    <h6 className="fw-bold mb-1 text-truncate" title={rel.name}>
                      {rel.name}
                    </h6>
                    <div className="text-primary fw-bold mb-2">
                      ${parseFloat(rel.price).toFixed(2)}
                    </div>
                    <Link
                      to={`/product/${rel.id}`}
                      className="btn btn-sm btn-outline-secondary w-100 mt-auto"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
