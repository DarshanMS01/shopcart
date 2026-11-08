import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, ShoppingCart, Eye, Tag, Check, X } from "lucide-react";
import { api } from "../api";
import { useCart } from "../context/CartContext";
import useAuth from "../hooks/useAuth";
import { useAxios } from "../hooks/useAxios";

const CATEGORIES = [
  "All",
  "Laptop and computer accessories",
  "Mobile accessories",
  "Home and lifestyle",
  "Office and daily-use products",
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search State
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [ordering, setOrdering] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [addedToast, setAddedToast] = useState(null);

  const { dispatch } = useCart();
  const { auth } = useAuth();
  const { api: axiosApi } = useAxios();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== "All") {
        params.append("category", selectedCategory);
      }
      if (search.trim()) {
        params.append("search", search.trim());
      }
      if (ordering) {
        params.append("ordering", ordering);
      }
      if (minPrice) {
        params.append("min_price", minPrice);
      }
      if (maxPrice) {
        params.append("max_price", maxPrice);
      }

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const response = await api.get(`/products/${queryString}`);
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, ordering]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handlePriceFilterSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setOrdering("");
    setMinPrice("");
    setMaxPrice("");
    setTimeout(() => {
      api.get("/products/").then((res) => setProducts(res.data));
    }, 50);
  };

  const handleQuickAddToCart = async (product, e) => {
    e.stopPropagation();
    if (!auth?.accessToken) {
      navigate("/login");
      return;
    }

    try {
      const response = await axiosApi.post("/cart/add/", {
        product_id: product.id,
        quantity: 1,
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

      setAddedToast(`Added "${product.name}" to cart!`);
      setTimeout(() => setAddedToast(null), 3500);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert(err.response?.data?.details || "Failed to add to cart");
    }
  };

  return (
    <section id="products" className="py-5 bg-light">
      <div className="container">
        {/* Toast Alert */}
        {addedToast && (
          <div
            className="alert alert-success position-fixed top-0 end-0 m-4 shadow-lg d-flex align-items-center gap-2"
            style={{ zIndex: 1050, minWidth: "280px" }}
          >
            <Check size={20} className="text-success" />
            <span className="flex-grow-1">{addedToast}</span>
            <button
              className="btn-close btn-sm"
              onClick={() => setAddedToast(null)}
            ></button>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary fw-semibold px-3 py-2 rounded-pill mb-2">
            Curated Catalogue
          </span>
          <h2 className="display-5 fw-bold mb-3">Explore Our Products</h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: "680px" }}>
            Premium laptop accessories, mobile gear, office essentials, and home lifestyle electronics with high-definition quality.
          </p>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="card border-0 shadow-sm p-3 mb-4">
          <div className="row g-3 align-items-center">
            {/* Search Input */}
            <div className="col-lg-5 col-md-6">
              <form onSubmit={handleSearchSubmit} className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={18} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search products by title or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="btn btn-primary px-3">
                  Search
                </button>
              </form>
            </div>

            {/* Price Range Filter */}
            <div className="col-lg-4 col-md-6">
              <form onSubmit={handlePriceFilterSubmit} className="d-flex align-items-center gap-2">
                <input
                  type="number"
                  placeholder="Min $"
                  className="form-control form-control-sm"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{ width: "85px" }}
                />
                <span className="text-muted">-</span>
                <input
                  type="number"
                  placeholder="Max $"
                  className="form-control form-control-sm"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ width: "85px" }}
                />
                <button type="submit" className="btn btn-outline-secondary btn-sm px-2">
                  Apply
                </button>
                {(minPrice || maxPrice || search || selectedCategory !== "All") && (
                  <button
                    type="button"
                    className="btn btn-link btn-sm text-danger text-decoration-none p-0 ms-1"
                    onClick={handleClearFilters}
                    title="Reset all filters"
                  >
                    Reset
                  </button>
                )}
              </form>
            </div>

            {/* Sorting Dropdown */}
            <div className="col-lg-3 col-md-12 text-lg-end">
              <select
                className="form-select form-select-sm"
                value={ordering}
                onChange={(e) => setOrdering(e.target.value)}
              >
                <option value="">Sort: Featured</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn btn-sm rounded-pill px-3 py-1 ${
                  selectedCategory === cat
                    ? "btn-primary shadow-sm"
                    : "btn-outline-secondary bg-white text-dark"
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-5" style={{ minHeight: "40vh" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading products...</span>
            </div>
            <p className="text-muted mt-2">Loading products...</p>
          </div>
        )}

        {/* Error Alert */}
        {error && !loading && (
          <div className="text-center py-5">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
            <button className="btn btn-primary" onClick={fetchProducts}>
              Retry
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3 text-muted small">
              <span>Showing <strong>{products.length}</strong> products</span>
              {selectedCategory !== "All" && (
                <span className="badge bg-secondary-subtle text-dark">
                  Category: {selectedCategory}
                </span>
              )}
            </div>

            <div className="products-grid-container">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="product-card position-relative"
                  >
                    {/* Discount Badge */}
                    {product.discount_percent > 0 && (
                      <span
                        className="badge bg-danger position-absolute top-0 start-0 m-2 shadow-sm px-2 py-1 fw-semibold"
                        style={{ zIndex: 2, fontSize: "11px" }}
                      >
                        {product.discount_percent}% OFF
                      </span>
                    )}

                    {/* Category Badge */}
                    <span
                      className="badge bg-white text-secondary border position-absolute top-0 end-0 m-2 shadow-sm px-2 py-1"
                      style={{ zIndex: 2, fontSize: "10.5px" }}
                    >
                      {product.category?.split(" ")[0]}
                    </span>

                    {/* Product Image Area */}
                    <Link
                      to={`/product/${product.id}`}
                      className="text-decoration-none product-image-area"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500";
                        }}
                      />
                    </Link>

                    {/* Product Card Body */}
                    <div className="product-card-body">
                      <Link
                        to={`/product/${product.id}`}
                        className="text-decoration-none"
                      >
                        <h6 className="product-title" title={product.name}>
                          {product.name}
                        </h6>
                      </Link>

                      <p className="product-description">
                        {product.description || "High quality gear for everyday use."}
                      </p>

                      {/* Price & Stock Row */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="product-price-row mb-0">
                          <span className="product-current-price">
                            ${parseFloat(product.price).toFixed(2)}
                          </span>
                          {product.original_price &&
                            parseFloat(product.original_price) >
                              parseFloat(product.price) && (
                              <span className="product-original-price">
                                ${parseFloat(product.original_price).toFixed(2)}
                              </span>
                            )}
                        </div>

                        <span className="ms-auto">
                          {product.stock > 0 ? (
                            <span className="badge bg-success-subtle text-success border border-success-subtle product-stock-badge">
                              In Stock
                            </span>
                          ) : (
                            <span className="badge bg-danger-subtle text-danger border border-danger-subtle product-stock-badge">
                              Out of Stock
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="product-actions">
                        <Link
                          to={`/product/${product.id}`}
                          className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center gap-1"
                        >
                          <Eye size={15} />
                          <span>Details</span>
                        </Link>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm d-flex align-items-center justify-content-center gap-1"
                          disabled={product.stock === 0}
                          onClick={(e) => handleQuickAddToCart(product, e)}
                        >
                          <ShoppingCart size={15} />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5" style={{ gridColumn: "1 / -1" }}>
                  <div className="p-4 bg-white rounded shadow-sm mx-auto" style={{ maxWidth: "480px" }}>
                    <h5>No products match your criteria</h5>
                    <p className="text-muted small">Try searching with a different term or clear filters.</p>
                    <button className="btn btn-primary btn-sm" onClick={handleClearFilters}>
                      View All Products
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Products;
