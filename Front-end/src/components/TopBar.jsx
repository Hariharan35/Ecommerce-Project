import { FiTruck, FiShield, FiPhone } from "react-icons/fi";

// Slim announcement bar shown above the navbar (hidden on small screens)
function TopBar() {
  return (
    <div className="topbar">
      <div className="container topbar-inner">
        <span><FiTruck /> Free delivery on every order</span>
        <span className="topbar-mid"><FiShield /> 100% secure checkout</span>
        <span><FiPhone /> Support: 1800-000-000</span>
      </div>
    </div>
  );
}

export default TopBar;
