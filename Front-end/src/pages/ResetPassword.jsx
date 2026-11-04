import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api";
import AuthLayout from "../components/AuthLayout";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await resetPassword({ email, otp, newPassword });
      setSuccess(result.message || "Password reset successful");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset password" subtitle="Enter the OTP we emailed you (valid for 10 minutes)">
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="otp">4-digit OTP</label>
          <input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={4} inputMode="numeric" required />
        </div>
        <div className="field">
          <label htmlFor="newPassword">New password (min 8 characters)</label>
          <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={8} autoComplete="new-password" required />
        </div>
        <button className="btn btn-orange btn-block" type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset password"}
        </button>
        {error && <p className="msg-error">{error}</p>}
        {success && <p className="msg-success">{success}</p>}
      </form>
      <p className="auth-links"><Link to="/forgot-password" className="btn-text">Send a new OTP</Link></p>
    </AuthLayout>
  );
}

export default ResetPassword;
