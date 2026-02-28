import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import authService from "../../services/authService.js";

function Registration() {
  const [userData, setUserData] = useState();
  const location = useLocation();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchUser() {
      if (userId) {
        try {
          const user = await authService.getUser(userId);
          console.log(user);

          if (user) setUserData(user);
        } catch (error) {
          console.log(error);
        }
      }
    }

    fetchUser();
  }, [userId, location.pathname]);

  return <Outlet context={{ userData }} />;
}

export default Registration;
