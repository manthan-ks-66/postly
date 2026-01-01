import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function AuthLayout({ children }) {
  const authStatus = useSelector((state) => state.auth.status);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authStatus === false) {
      navigate("/login");
    }

    setLoader(false);
  });
  return loader ? (
    <div className="flex flex-col dark:bg-gray-900 bg-gray-300 items-center justify-center min-h-screen">
      <div className="w-12 h-12 bg-[#55aa00] border-t-[#55aa00] rounded-full animate-ping"></div>
    </div>
  ) : (
    <>{children}</>
  );
}

export default AuthLayout;
