
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="state-box not-found">
      <div className="empty-icon">🔎</div>
      <h1>404 — Page not found</h1>
      <p>The page you're looking for doesn't exist.</p>

      <Link to="/" className="button button-primary">
        Return to dashboard
      </Link>
    </div>
  );
}

export default NotFound;