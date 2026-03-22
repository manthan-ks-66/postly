import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";

function AuthLayout({ children }) {
  const authStatus = useSelector((state) => state.auth.status);
  const verificationStatus = sessionStorage.getItem("verificationStatus");

  const location = useLocation();

  const currentPath = location.pathname;

  const isAuthRoute = currentPath.startsWith("/auth");

  const isVerificationRoute = currentPath.endsWith("/verify");
  
  const isProtectedRoute =
    currentPath.startsWith("/user") || currentPath.startsWith("/post/new");

  if (isAuthRoute && authStatus) return <Navigate to="/" replace />;

  if (isVerificationRoute && !verificationStatus) return <Navigate to="/" />;

  if (isProtectedRoute && !authStatus)
    return <Navigate to="/auth/login" replace />;

  return <>{children}</>;
}

export default AuthLayout;
