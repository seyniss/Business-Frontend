import { Link, useLocation } from "react-router-dom";

const BusinessSidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const menuItems = [
    { path: "/business/dashboard", label: "대시보드", icon: "📊" },
    { path: "/business/rooms", label: "객실 관리", icon: "🏨" },
    { path: "/business/bookings", label: "예약 관리", icon: "📅" },
    { path: "/business/statistics", label: "매출 통계", icon: "📈" },
    { path: "/business/reviews", label: "리뷰 관리", icon: "⭐" },
    { path: "/business/settings", label: "설정", icon: "⚙️" },
    { path: "/business/profile", label: "내 정보", icon: "👤" },
  ];

  return (
    <aside className="business-sidebar">
      <div className="sidebar-logo">
        <Link to="/business/dashboard">
          <h1>Hotel Admin</h1>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-nav-item ${isActive(item.path) ? "active" : ""}`}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span className="sidebar-nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default BusinessSidebar;
