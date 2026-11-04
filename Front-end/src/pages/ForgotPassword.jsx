import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/api";
import AuthLayout from "../components/AuthLayout";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await forgotPassword(email);
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot password?" subtitle="Enter your email and we will send you an OTP">
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </div>
        <button className="btn btn-orange btn-block" type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>
        {error && <p className="msg-error">{error}</p>}
      </form>
      <p className="auth-links"><Link to="/login" className="btn-text">Back to login</Link></p>
    </AuthLayout>
  );
}

export default ForgotPassword;
