import { useState } from "react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import authService from "./services/authService";
import { login } from "./store/authSlice";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer.jsx";
import { Outlet } from "react-router-dom";

function App() {
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((response) => {
        const user = response.data?.data;
        // Fixed: removed the double dispatch
        if (user) dispatch(login(user));
      })
      .catch((err) => {
        console.error("Auth Error:", err.message);
      })
      .finally(() => setLoader(false));
  }, [dispatch]);

  return !loader ? (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  ) : (
    <div className="flex flex-col dark:bg-gray-900 items-center justify-center min-h-screen">
      <div className="w-12 h-12 bg-[#55aa00] border-t-[#55aa00] rounded-full animate-ping"></div>
    </div>
  );
}

export default App;
