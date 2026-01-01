import Logo from "./Logo/Logo.jsx";
import { useForm } from "react-hook-form";
import authService from "../services/authService.js";
import { login } from "../store/authSlice.js";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Input from "./Utilities/Input.jsx";
import Button from "./Utilities/Button.jsx";
import { useState } from "react";
import "flowbite";

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState("");

  const signup = async (data) => {
    try {
      const formData = new FormData();

      for (let val in data) {
        if (typeof data[val] !== "object") {
          formData.append(val, data[val]);
        }
      }

      if (data.avatar && data.avatar[0]) {
        formData.append("avatar", data.avatar[0]);
      }

      const response = await authService.registerUser(formData);

      if (response) {
        const userData = response.data?.data?.user;
        dispatch(login(userData));
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <section className="w-full py-7 mt-2 overflow-x-hidden bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="mt-2 w-full flex flex-col items-center justify-center md:h-screen lg:py-0">
          {/* Added max-w-full to ensure it never exceeds the viewport width */}
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <div className="items-center flex flex-col justify-center">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create an account
                </h1>
                <p className="mt-1.5 text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account? &nbsp;
                  <Link
                    to="/login"
                    className="font-medium text-[#55aa00] hover:underline"
                  >
                    Login here
                  </Link>
                </p>
              </div>
              {error && (
                <div className="flex items-center gap-2 p-3 mb-4 text-sm font-medium border-red-500 bg-red-50 dark:bg-red-500/25 text-red-400 dark:text-gray-200 rounded-r-xl animate-in fade-in slide-in-from-top-1 duration-300 rounded-2xl justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 shrink-0"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
              <form onSubmit={handleSubmit(signup)}>
                <Input
                  id="fullName"
                  label="Full Name"
                  htmlFor="fullName"
                  placeholder="Enter your full name"
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg hover:border-[#55aa00] focus:ring-[#55aa00] focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white mt-2.5 mb-2.5"
                  {...register("fullName", {
                    required: true,
                  })}
                />

                <Input
                  id="username"
                  htmlFor="username"
                  placeholder="Enter your username"
                  type="text"
                  label="Username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg hover:border-[#55aa00] focus:ring-[#55aa00] focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white mt-2.5 mb-2.5"
                  {...register("username", {
                    required: true,
                  })}
                />

                <Input
                  id="email"
                  label="Email"
                  htmlFor="email"
                  placeholder="Enter your email address"
                  type="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg hover:border-[#55aa00] focus:ring-[#55aa00] focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white mt-2.5 mb-2.5"
                  {...register("email", {
                    required: true,
                  })}
                />

                <Input
                  id="password"
                  label="Password"
                  htmlFor="password"
                  placeholder="Enter password"
                  type="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg hover:border-[#55aa00] focus:ring-[#55aa00] focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white mt-2.5 mb-2.5"
                  {...register("password", {
                    required: true,
                  })}
                />

                <Input
                  id="avatar"
                  label="Add your avatar"
                  htmlFor="avatar"
                  type="file"
                  className="cursor-pointer dark:bg-gray-800 dark:text-gray-400 bg-gray-300 border border-gray-500 text-heading text-sm rounded-base focus:ring-[#81827f] focus:border-[#81827f] hover:border-[#55aa00] block w-full shadow-xs placeholder:text-body mt-2.5 mb-2.5 file:bg-gray-400 file:text-dark dark:file:bg-gray-600 dark:file:text-gray-200 hover:file:bg-green-700"
                  {...register("avatar")}
                />

                <Button
                  type="submit"
                  className="mt-2.5 mb-2.5 w-full cursor-pointer text-white bg-[#55AA00] hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300"
                >
                  Create Account
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Signup;
