import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo/Logo";
import { useSelector } from "react-redux";
import LogoutBtn from "./LogoutBtn.jsx";
import Button from "../Utilities/Button.jsx";

function Header() {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);

  const authStatus = useSelector((state) => state.auth.status);

  const user = useSelector((state) => state.auth.user);

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "About",
      slug: "/about",
      active: true,
    },
    {
      name: "Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add post",
      active: authStatus,
    },
  ];

  return (
    <header>
      <nav className="bg-neutral-primary fixed w-full z-20 top-0 start-0 dark:bg-gray-800 dark:text-amber-100">
        <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-3">
          <Link to="/" className="flex items-center space-x-3">
            <Logo />
          </Link>
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0">
            {/* User Profile or User authentication */}
            {!user ? (
              <div className="flex gap-2 max-sm:hidden">
                <Link
                  to="/login"
                  className="w-20 flex items-center justify-center text-gray-300 hover:bg-gray-400 hover:text-dark dark:hover:bg-gray-900 dark:hover:text-white hover:rounded transition-all duration-300"
                >
                  Login
                </Link>
                <Link to="/signup">
                  <button
                    type="button"
                    className="w-20 h-11 bg-[#55AA00] dark:bg-gray-800 text-white border border-[#55AA00] hover:bg-[#55AA00] hover:text-white focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm p-2.5 focus:outline-none transition-all duration-300 ease-in-out shadow-sm hover:shadow-md active:scale-95"
                  >
                    SignUp
                  </button>
                </Link>
              </div>
            ) : (
              <button
                type="button"
                className="flex text-sm bg-neutral-primary rounded-full focus:ring-4 focus:ring-neutral-tertiary"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              >
                <img
                  className="w-9.5 h-9.5 rounded-full"
                  src={user.avatar === null ? "./user.png" : user.avatar}
                  alt="user photo"
                />
              </button>
            )}

            {/* User Dropdown */}
            <div
              className={`z-50 absolute flex right-4 top-14 my-4 text-base list-none bg-neutral-primary-medium border-default-medium shadow-lg w-44 
                transition-all duration-200 ease-out origin-top-right
                ${
                  isUserDropdownOpen
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
            >
              <ul className="w-full dark:bg-gray-700 p-2 text-sm text-body font-medium">
                <li>
                  <Link
                    to="/profile"
                    className="block p-2 hover:bg-gray-300 hover:text-dark dark:text-gray-400 dark:hover:text-amber-50 dark:hover:bg-gray-800 rounded transition-all duration-300"
                  >
                    Your Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="block p-2 hover:bg-gray-300 hover:text-dark dark:text-gray-400 dark:hover:text-amber-50 dark:hover:bg-gray-800 rounded transition-all duration-300"
                  >
                    Settings
                  </Link>
                </li>
                <hr className="my-1 border-default-medium" />
                <li>
                  <Link
                    to="/logout"
                    className="block p-2 hover:bg-gray-300 hover:text-dark dark:text-gray-400 dark:hover:text-amber-50 dark:hover:bg-gray-800 rounded transition-all duration-300"
                  >
                    Sign out
                  </Link>
                </li>
              </ul>
            </div>

            {/* Hamburger Button */}
            <button
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft focus:outline-none focus:ring-2 focus:ring-neutral-tertiary"
              onClick={() => setIsMainMenuOpen(!isMainMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`w-6 h-6 transition-transform duration-200 ${
                  isMainMenuOpen ? "rotate-90" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Menu */}
          <div
            className={`items-center justify-between w-full md:flex md:w-auto md:order-1 overflow-hidden transition-all duration-300 ease-in-out
              ${
                isMainMenuOpen
                  ? "max-h-96 opacity-100 mt-4"
                  : "max-h-0 opacity-0 md:opacity-100 md:max-h-full"
              }`}
          >
            <ul className="nav-links dark:bg-gray-800 dark:text-green-100 font-medium flex flex-col p-4 md:p-0 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-neutral-primary">
              {navItems.map((item) =>
                item.active ? (
                  <>
                    <li key={item.slug}>
                      <Link
                        to={item.slug}
                        className="block text-black dark:text-green-100 py-1 px-3.5 hover:bg-gray-300 hover:text-[#55AA00] dark:hover:bg-gray-900 hover:rounded transition-all duration-300"
                      >
                        {item.name}
                      </Link>
                    </li>
                  </>
                ) : (
                  <li key={item.slug}>
                    <Link
                      className="block text-black dark:text-green-100 py-1 px-3.5 hover:bg-gray-300 hover:text-[#55AA00] dark:hover:bg-gray-900 hover:rounded transition-all duration-300"
                      to="/login"
                    >
                      {item.name}
                    </Link>
                  </li>
                )
              )}

              {/* Mobile view login and signup buttons */}
              {!user && (
                <li className="md:hidden border-t border-default mt-2 pt-2 flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="block py-2 text-black dark:text-gray-300 hover:dark:bg-gray-600 hover:text-[#55aa00]"
                    onClick={() => setIsMainMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setIsMainMenuOpen(false)}>
                    <button
                      type="button"
                      className="text-white border border-[#55AA00] bg-[#55AA00] font-medium rounded-base text-sm px-4 py-2"
                    >
                      SignUp
                    </button>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
