import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const LOGIN_EMAIL = localStorage.getItem("fundsroom_email") || "admin@fundsroom.com";
const LOGIN_PASSWORD = localStorage.getItem("fundsroom_password") || "Admin@123";

const API = "http://localhost:5000";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [challans, setChallans] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerForm, setCustomerForm] = useState({
  customer_name: "",
  mobile: "",
  email: "",
  business_name: "",
  gst_number: "",
  customer_type: "Retail",
  address: "",
  status: "Active",
  notes: ""
});
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [showSignup, setShowSignup] = useState(false);

const [loginEmail, setLoginEmail] = useState("");
const [loginPassword, setLoginPassword] = useState("");
const [loginError, setLoginError] = useState("");

const [signupName, setSignupName] = useState("");
const [signupEmail, setSignupEmail] = useState("");
const [signupPassword, setSignupPassword] = useState("");
const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
const [signupError, setSignupError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dashboardRes, productsRes, customersRes, challansRes] =
        await Promise.all([
          axios.get(`${API}/api/dashboard`),
          axios.get(`${API}/api/products`),
          axios.get(`${API}/api/customers`),
          axios.get(`${API}/api/challans`)
        ]);

      setDashboard(dashboardRes.data);
      setProducts(productsRes.data);
      setCustomers(customersRes.data);
      setChallans(challansRes.data);
    } catch (error) {
      console.error("Failed to load ERP data:", error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "customers", label: "Customers", icon: "♙" },
  { id: "products", label: "Products", icon: "▣" },
  { id: "challans", label: "Challans", icon: "▤" },
  { id: "settings", label: "Settings", icon: "⚙" },
];
  if (!isLoggedIn && showSignup) {
  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <div className="login-logo-box">F</div>

          <div>
            <h1>Fundsroom</h1>
            <span>ERP System</span>
          </div>
        </div>

        <h2>Create your account</h2>

        <p className="login-subtitle">
          Register to access Fundsroom ERP
        </p>

        <form
          onSubmit={async(e) => {
            e.preventDefault();

            if (signupPassword !== signupConfirmPassword) {
              setSignupError("Passwords do not match");
              return;
            }

            if (!signupName || !signupEmail || !signupPassword) {
              setSignupError("Please fill in all fields");
              return;
            }
            try {
  const response = await axios.post(`${API}/api/signup`, {
    full_name: signupName,
    email: signupEmail,
    password: signupPassword,
  });

  alert(response.data.message);

  setSignupName("");
  setSignupEmail("");
  setSignupPassword("");
  setSignupConfirmPassword("");
  setSignupError("");

  setShowSignup(false);
  setLoginEmail(signupEmail);
} catch (error) {
  console.log("SIGNUP ERROR:", error);
  console.log("RESPONSE:", error.response);
  setSignupError(
    error.response?.data?.message ||
    error.message ||
    "Signup failed"
  );
}
          }}
        >

          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter your full name"
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
          />

          <label>Email Address</label>

          <input
            type="email"
            placeholder="you@example.com"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Create a password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
          />

          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Confirm your password"
            value={signupConfirmPassword}
            onChange={(e) =>
              setSignupConfirmPassword(e.target.value)
            }
          />

          {signupError && (
            <div className="login-error">
              {signupError}
            </div>
          )}

          <button type="submit" className="login-btn">
            Create Account
          </button>

        </form>

        <button
          className="signup-link"
          onClick={() => {
            setShowSignup(false);
            setSignupError("");
          }}
        >
          Already have an account? Sign in
        </button>

      </div>
    </div>
  );
}
  if (!isLoggedIn && !showSignup)  {
  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <div className="login-logo-box">F</div>
          <div>
            <h1>Fundsroom</h1>
            <span>ERP System</span>
          </div>
        </div>

        <h2>Welcome back</h2>

        <p className="login-subtitle">
          Sign in to access your ERP dashboard
        </p>

        <form
          onSubmit={async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(`${API}/api/login`, {
      email: loginEmail,
      password: loginPassword,
    });

    setIsLoggedIn(true);
    setLoginError("");

    localStorage.setItem(
      "fundsroom_user",
      JSON.stringify(response.data.user)
    );
  } catch (error) {
    setLoginError(
      error.response?.data?.message ||
      "Invalid email or password"
    );
  }
}}
        >

          <label>Email Address</label>

          <input
            type="email"
            placeholder="admin@fundsroom.com"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />

          {loginError && (
            <div className="login-error">
              {loginError}
            </div>
          )}

          <button type="submit" className="login-btn">
            Sign In
          </button>

        </form>
       
<button
  className="signup-link"
  onClick={() => {
    setShowSignup(true);
    setLoginError("");
  }}
>
  Don't have an account? Create one
</button>
        <small className="login-footer">
          Fundsroom ERP • Administrator Portal
        </small>

      </div>
    </div>
  );
}

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading Fundsroom ERP...</p>
      </div>
    );
  }

  return (
    <div className={darkMode ? "app dark-mode" : "app"}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">F</div>
          <div>
            <h2>Fundsroom</h2>
            <span>ERP System</span>
          </div>
        </div>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${
                activePage === item.id ? "active" : ""
              }`}
              onClick={() => setActivePage(item.id)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-card">
            <div className="avatar">N</div>
            <div>
              <strong>Nikhath Tasneem</strong>
              <small>Administrator</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>
              {activePage === "dashboard"
                ? "Dashboard"
                : menuItems.find((item) => item.id === activePage)?.label}
            </h1>
            <p>Manage your business operations efficiently.</p>
          </div>

          <div className="topbar-right">
            <div className="status">
              <span className="status-dot"></span>
              System Online
            </div>
            <div className="profile">N</div>
          </div>
        </header>

        {activePage === "dashboard" && dashboard && (
          <>
            <section className="welcome">
              <div>
                <h2>Welcome back, Nikhath 👋</h2>
                <p>Here's what's happening with your ERP today.</p>
              </div>
            </section>

            <section className="stats-grid">
              <StatCard
                title="Total Customers"
                value={dashboard.total_customers}
                icon="♙"
              />

              <StatCard
  title="Inventory Value"
  value={`₹${products
    .reduce(
      (total, product) =>
        total +
        Number(product.unit_price) *
          Number(product.current_stock),
      0
    )
    .toLocaleString("en-IN")}`}
  icon="₹"
/>

              <StatCard
                title="Total Challans"
                value={dashboard.total_challans}
                icon="▤"
              />

              <StatCard
  title="Low Stock Items"
  value={
    products.filter(
      (product) =>
        Number(product.current_stock) <=
        Number(product.min_stock_alert)
    ).length
  }
  icon="⚠"
/>
            </section>

            <section className="content-grid">
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h3>Recent Challans</h3>
                    <p>Latest sales activity</p>
                  </div>
                  <button
                    className="view-btn"
                    onClick={() => setActivePage("challans")}
                  >
                    View all
                  </button>
                </div>

                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Challan</th>
                        <th>Customer</th>
                        <th>Quantity</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {challans.slice(0, 5).map((challan) => (
                        <tr key={challan.id}>
                          <td>{challan.challan_number}</td>
                          <td>{challan.customer_name}</td>
                          <td>{challan.total_quantity}</td>
                          <td>
                            <span
  className={`badge ${
    (challan.status || "Draft").toLowerCase()
  }`}
>
  {challan.status || "Draft"}
</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h3>Inventory Overview</h3>
                    <p>Current stock levels</p>
                  </div>
                </div>

               <div className="inventory-list">
  {products.slice(0, 6).map((product) => {
    const isLow =
      Number(product.current_stock) <=
      Number(product.min_stock_alert);

    return (
      <div
        className="inventory-item"
        key={product.id}
      >
        <div>
          <strong>{product.product_name}</strong>
          <small>{product.sku}</small>
        </div>

        <div className="stock">
          <strong>{product.current_stock}</strong>
          <small>units</small>
        </div>

        <span
          className={`badge ${
            isLow ? "low-stock" : "in-stock"
          }`}
        >
          {isLow ? "Low Stock" : "In Stock"}
        </span>
      </div>
    );
  })}
</div>
              </div>
            </section>
          </>
        )}

        {activePage === "customers" && (
          <DataPage
            title="Customers"
            subtitle="Manage your customers"
            columns={[
  "Customer Code",
  "Name",
  "Mobile",
  "Email",
  "Business",
  "Type",
  "Status"
]}
rows={customers.map((customer) => [
  customer.customer_code,
  customer.customer_name,
  customer.mobile,
  customer.email,
  customer.business_name,
  customer.customer_type,
  customer.status
])}
onAdd={() => setShowCustomerForm(true)}
          />
          
        )}

        {activePage === "products" && (
          <DataPage
            title="Products"
            subtitle="Manage inventory and stock"
            columns={[
  "Product",
  "SKU",
  "Category",
  "Price",
  "Stock",
  "Status",
  "Location"
]}
rows={products.map((product) => {
  const isLow =
    Number(product.current_stock) <=
    Number(product.min_stock_alert);

  return [
    product.product_name,
    product.sku,
    product.category,
    `₹${Number(product.unit_price).toLocaleString("en-IN")}`,
    product.current_stock,
    isLow ? "Low Stock" : "In Stock",
    product.location
  ];
})}
          />
        )}

        {activePage === "challans" && (
          <DataPage
            title="Sales Challans"
            subtitle="Track and manage sales challans"
            columns={[
              "Challan",
              "Customer",
              "Quantity",
              "Status",
              "Created"
            ]}
            rows={challans.map((challan) => [
              challan.challan_number,
              challan.customer_name,
              challan.total_quantity,
              challan.status || "Draft",
              new Date(challan.created_at).toLocaleDateString()
            ])}
          />
        )}
     {activePage === "settings" && (
  <div className="settings-menu">

    <div
      className="settings-option"
      onClick={() => setActivePage("profile")}
    >
      <div className="settings-icon">👤</div>
      <div>
        <h3>Profile</h3>
        <p>Manage your profile information</p>
      </div>
      <span>›</span>
    </div>

    <div
      className="settings-option"
      onClick={() => setActivePage("change-password")}
    >
      <div className="settings-icon">🔐</div>
      <div>
        <h3>Change Password</h3>
        <p>Update your account password</p>
      </div>
      <span>›</span>
    </div>

    <div
      className="settings-option"
      onClick={() => setActivePage("business")}
    >
      <div className="settings-icon">🏢</div>
      <div>
        <h3>Business Information</h3>
        <p>Manage your business details</p>
      </div>
      <span>›</span>
    </div>

    <div
      className="settings-option"
      onClick={() => setActivePage("appearance")}
    >
      <div className="settings-icon">🎨</div>
      <div>
        <h3>Appearance</h3>
        <p>Choose light or dark mode</p>
      </div>
      <span>›</span>
    </div>

    <div
      className="settings-option"
      onClick={() => setActivePage("notifications")}
    >
      <div className="settings-icon">🔔</div>
      <div>
        <h3>Notifications</h3>
        <p>Manage your notification preferences</p>
      </div>
      <span>›</span>
    </div>

    <div className="settings-option logout-option">
      <div className="settings-icon">🚪</div>
      <div>
        <h3>Logout</h3>
        <p>Sign out of Fundsroom ERP</p>
      </div>
      <span>›</span>
    </div>

    </div>
)}
    
{activePage === "profile" && (
  <div className="settings-detail">

    <button
      className="back-btn"
      onClick={() => setActivePage("settings")}
    >
      ← Back to Settings
    </button>

    <div className="detail-card">
      <div className="large-avatar">N</div>

      <h2>Nikhath Tasneem</h2>
      <p className="role-text">Administrator</p>

      <div className="profile-fields">

        <div>
          <label>Full Name</label>
          <input value="Nikhath Tasneem" readOnly />
        </div>

        <div>
          <label>Email</label>
          <input value="Nikhath@example.com" readOnly />
        </div>

        <div>
          <label>Role</label>
          <input value="Administrator" readOnly />
        </div>

      </div>
    </div>

  </div>
)}
{activePage === "change-password" && (
  <div className="settings-detail">

    <button
      className="back-btn"
      onClick={() => setActivePage("settings")}
    >
      ← Back to Settings
    </button>

    <div className="detail-card">

      <div className="detail-header">
        <div className="detail-icon">🔐</div>
        <div>
          <h2>Change Password</h2>
          <p>Keep your account secure by updating your password.</p>
        </div>
      </div>

      <div className="form-section">

        <label>Current Password</label>
        <input
          type="password"
          placeholder="Enter current password"
        />

        <label>New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
        />

        <label>Confirm New Password</label>
        <input
          type="password"
          placeholder="Confirm new password"
        />

        <button className="primary-settings-btn">
          Update Password
        </button>

      </div>

    </div>
  </div>
)}
    {activePage === "business" && (
  <div className="settings-detail">

    <button
      className="back-btn"
      onClick={() => setActivePage("settings")}
    >
      ← Back to Settings
    </button>

    <div className="detail-card">

      <div className="detail-header">
        <div className="detail-icon">🏢</div>

        <div>
          <h2>Business Information</h2>
          <p>Manage your business information.</p>
        </div>
      </div>

      <div className="form-grid">

        <div>
          <label>Business Name</label>
          <input value="Fundsroom ERP" readOnly />
        </div>

        <div>
          <label>Business Type</label>
          <input value="ERP & CRM Solutions" readOnly />
        </div>

        <div>
          <label>Country</label>
          <input value="India" readOnly />
        </div>

        <div>
          <label>Currency</label>
          <input value="INR (₹)" readOnly />
        </div>

        <div>
          <label>Email</label>
          <input value="admin@fundsroom.com" readOnly />
        </div>

        <div>
          <label>Phone</label>
          <input value="+91 XXXXX XXXXX" readOnly />
        </div>

      </div>

      <button className="primary-settings-btn">
        Save Business Information
      </button>

    </div>
  </div>
)}
{activePage === "appearance" && (
  <div className="settings-detail">

    <button
      className="back-btn"
      onClick={() => setActivePage("settings")}
    >
      ← Back to Settings
    </button>

    <div className="detail-card">

      <div className="detail-header">
        <div className="detail-icon">🎨</div>

        <div>
          <h2>Appearance</h2>
          <p>Customize how Fundsroom ERP looks.</p>
        </div>
      </div>

      <div className="theme-grid">

        <div className="theme-card active-theme">
          <div className="theme-preview light-preview">
            <div></div>
            <div></div>
            <div></div>
          </div>

          <h3>☀️ Light Mode</h3>
          <p>Clean and bright interface</p>
        </div>

        <div className="theme-card">
          <div className="theme-preview dark-preview">
            <div></div>
            <div></div>
            <div></div>
          </div>

          <h3>🌙 Dark Mode</h3>
          <p>Comfortable for low-light environments</p>
        </div>

      </div>

    </div>
  </div>
)}
      </main>
    </div>
  );
}
function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <span>{title}</span>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

function DataPage({
  title,
  subtitle,
  columns,
  rows,
  onAdd
}) {
  const [search, setSearch] = useState("");
  return (
    <section className="data-page">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>{title}</h3>
            <p>{subtitle}</p>
          </div>
        </div>
        <div className="table-toolbar">
  <input
    type="text"
    placeholder={`Search ${title.toLowerCase()}...`}
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <span>
    {rows.length} records
  </span>
</div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.filter((row) =>
  row.some((cell) =>
    String(cell ?? "")
      .toLowerCase()
      .includes(search.toLowerCase())
  )
).length > 0 ? (
                rows
  .filter((row) =>
    row.some((cell) =>
      String(cell ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  )
  .map((row, index) => (
                  <tr key={index}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>
  {[
    "Active",
    "In Stock",
    "Low Stock",
    "Confirmed",
    "Draft",
    "Cancelled"
  ].includes(cell) ? (
    <span className={`badge ${cell.toLowerCase().replace(" ", "-")}`}>
      {cell}
    </span>
  ) : (
    cell
  )}
</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="empty">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default App;