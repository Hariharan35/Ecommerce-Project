import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container page">
      <div className="card empty-state">
        <h1 className="nf-code">404</h1>
        <h2>Page not found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to="/home" className="btn">Go to home</Link>
      </div>
    </div>
  );
}

export default NotFound;
