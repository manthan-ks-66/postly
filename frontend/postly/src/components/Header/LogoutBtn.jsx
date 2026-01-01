import Button from "../Utilities/Button.jsx";
import { logout } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";
import authService from "../../services/authService.js";

function LogoutBtn() {
  const dispatch = useDispatch();

  const logoutHanler = async () => {
    authService.logoutUser().then(() => {
      dispatch(logout());
      Navigate("/")
    });
  };
  return (
    <>
      <button
        onClick={logoutHanler}
        className="w-full text-start block p-2 hover:bg-gray-300 hover:text-dark dark:text-gray-400 dark:hover:text-amber-50 dark:hover:bg-gray-900 rounded transition-all duration-300"
      >
        Logout
      </button>
    </>
  );
}

export default LogoutBtn;
