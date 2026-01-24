import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout, Spin } from "antd";
import { theme } from "antd";
import { useNotify } from "../context/NotificationProvider";

function AuthLayout({ children, authentication = true }) {
  const { token } = theme.useToken();

  const notify = useNotify();

  const contentStyle = {
    padding: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: token.colorBgLayout,
    borderRadius: 4,
  };

  const authStatus = useSelector((state) => state.auth.status);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authentication && authentication !== authStatus) {
      navigate("/auth/login");

      notify.api.error({
        title: "Authentication Required!",
        description: "Please Login to continue",
        placement: "top",
      });
    } else if (!authentication && authentication !== authStatus) {
      navigate("/");
    }

    setLoader(false);
  }, [authStatus, authentication, navigate]);

  const layoutStyle = {
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "10px",
    background: token.colorBgContainer,
  };

  if (loader) {
    return (
      <Layout style={layoutStyle}>
        <Spin style={contentStyle} size="large"></Spin>
      </Layout>
    );
  }

  return <>{children}</>;
}

export default AuthLayout;
