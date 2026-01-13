// components
import { Outlet } from "react-router-dom";
import NavBar from "./components/Header/NavBar.jsx";
import Footer from "./components/Footer/Footer.jsx";

// methods and services
import { useEffect, useState } from "react";
import authService from "./services/authService.js";
import { useDispatch } from "react-redux";
import { login } from "./store/authSlice.js";
import { Spin } from "antd";
import { theme } from "antd";

import NotificationProvider from "./components/context/NotificationProvider.jsx";

function App() {
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();

  const { token } = theme.useToken();

  const contentStyle = {
    padding: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: token.colorBgLayout,
    borderRadius: 4,
  };

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((res) => {
        const user = res.data?.data;

        if (user) dispatch(login(user));
      })
      .catch((err) => {
        console.log(err.message)
      })
      .finally(() => setLoader(false));
  }, [dispatch]);

  return !loader ? (
    <NotificationProvider>
      <NavBar />
      <Outlet />
      <Footer />
    </NotificationProvider>
  ) : (
    <Spin style={contentStyle} size="large"></Spin>
  );
}

export default App;
