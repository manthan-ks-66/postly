import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import authService from "../services/authService";
import { login } from "../store/authSlice";
import Input from "./Utilities/Input";
import Button from "./Utilities/Button";

function Login() {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate("/");
  const { register, handleSubmit } = useForm();

  const loginUser = async (data) => {
    try {
      const response = await authService.loginUser(data);

      const user = response?.data?.data?.user;

      console.log(user);

      if (user) dispatch(login(user));

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <p class="text-sm font-light text-gray-800 dark:text-gray-300 flex justify-center">
              Don’t have an account yet? &nbsp;
              <Link
                to="/signup"
                className="font-medium text-[#55aa00] hover:underline"
              >
                Sign up
              </Link>
            </p>
            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 text-sm font-medium border-red-500 bg-red-50 dark:bg-red-900/20 text-red-400 dark:text-red-400 rounded-r-xl animate-in fade-in slide-in-from-top-1 duration-300 rounded-2xl justify-center">
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
            <form
              class="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(loginUser)}
            >
              <Input
                label="Username"
                htmlFor="username"
                type="text"
                placeholder="username or email"
                id="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                {...register("username", {
                  required: true,
                })}
              />
              <Input
                label="Password"
                htmlFor="password"
                type="password"
                placeholder="password"
                id="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                {...register("password", {
                  required: true,
                })}
              />
              <div class="flex items-center justify-between">
                <Link
                  to="/chang-password"
                  className="text-sm font-medium hover:underline text-[#55aa00]"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                children="Login"
                className="w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#55aa00] cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#4a9400] hover:scale-[1.01] hover:shadow-lg 
                active:scale-95 focus:ring-4 focus:outline-none focus:ring-primary-300"
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
