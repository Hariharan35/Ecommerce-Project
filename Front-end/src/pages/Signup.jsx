import { useState } from "react";
import { Link } from "react-router-dom";
import { signupUser } from "../services/api";
import AuthLayout from "../components/AuthLayout";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await signupUser({ name, email, password });
      setSuccess(result.message || "Account created successfully!");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Looks like you're new here!" subtitle="Sign up with your details to get started">
      <form onSubmit={handleSignup}>
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="password">Password (min 8 characters)</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} autoComplete="new-password" required />
        </div>
        <div className="field">
          <label htmlFor="confirm">Confirm password</label>
          <input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={8} autoComplete="new-password" required />
        </div>

        <button className="btn btn-orange btn-block" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Continue"}
        </button>
        {error && <p className="msg-error">{error}</p>}
        {success && <p className="msg-success">{success}</p>}
      </form>

      <p className="auth-links"><Link to="/login" className="btn-text">Existing user? Log in</Link></p>
    </AuthLayout>
  );
}

export default Signup;
