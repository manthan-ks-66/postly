import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";

function AuthLayout({ children }) {
  const authStatus = useSelector((state) => state.auth.status);

  const location = useLocation();

  const currentPath = location.pathname;

  const isAuthRoute = currentPath.startsWith("/auth");

  const isProtectedRoute =
    currentPath.startsWith("/user") || currentPath.startsWith("/post/new");

  if (isAuthRoute && authStatus) return <Navigate to="/" replace />;

  if (isProtectedRoute && !authStatus)
    return <Navigate to="/auth/login" replace />;

  return <>{children}</>;
}

export default AuthLayout;
