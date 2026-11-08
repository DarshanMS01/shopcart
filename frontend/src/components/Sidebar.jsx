import { LayoutDashboard, LogOut, Package, User, MapPin } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import useAuth from "../hooks/useAuth";

const Sidebar = () => {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { setAuth } = useAuth();

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/dashboard/orders", icon: Package, label: "My Orders" },
    { path: "/dashboard/addresses", icon: MapPin, label: "Delivery Addresses" },
    { path: "/dashboard/profile", icon: User, label: "Profile Settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setAuth({});
    dispatch({
      type: "SET_CART",
      payload: {
        items: [],
        subtotal: 0,
        total: 0,
        itemCount: 0,
      },
    });

    navigate("/");
  };

  return (
    <aside className="col-lg-3 mb-4">
      <div className="card border-0 shadow-sm p-3">
        <nav className="nav flex-column gap-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `nav-link rounded d-flex align-items-center gap-2 ${
                  isActive ? "bg-primary text-white shadow-sm" : "text-dark"
                }`
              }
              style={{ cursor: "pointer", transition: "0.2s" }}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
          <hr className="my-2" />
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center gap-2 mt-2 w-100"
          >
            <LogOut size={16} />
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
