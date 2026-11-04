import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await loginUser({ email, password });
      login(result.token, result.user);
      navigate(location.state?.from || "/home", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Login" subtitle="Get access to your Orders, Wishlist and Recommendations">
      <form onSubmit={handleLogin}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </div>

        <p className="auth-note small">By continuing, you agree to MyShop's Terms of Use and Privacy Policy.</p>
        <button className="btn btn-orange btn-block" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="msg-error">{error}</p>}
      </form>

      <p className="auth-links"><Link to="/forgot-password">Forgot password?</Link></p>
      <p className="auth-links"><Link to="/signup" className="btn-text">New to MyShop? Create an account</Link></p>
    </AuthLayout>
  );
}

export default Login;
