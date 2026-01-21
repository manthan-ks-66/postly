import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Register from "./components/Auth/Register.jsx";
import Login from "./components/Auth/Login.jsx";
import Home from "./components/Home.jsx";
import AuthLayout from "./components/AuthLayout.jsx";
import About from "./components/About.jsx";
import Settings from "./components/Auth/Settings.jsx";
import ResetPassword from "./components/Auth/ResetPassword.jsx";
import { ConfigProvider, theme as antdTheme } from "antd";
import PostPage from "./components/Post/PostPage.jsx";
import Posts from "./components/Post/Posts.jsx";
import PostForm from "./components/Post/PostForm.jsx";

const postlyDarkTheme = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    // Brand color
    colorPrimary: "#55aa00",

    colorBgLayout: "#111827",
    colorBgContainer: "#111827",

    colorBgCard: "#1d2538be",

    // Text colors
    colorTextBase: "#E5E7EB",
    colorTextSecondary: "#9CA3AF",

    // Shape & font
    borderRadiusLG: 10,
    fontFamily: "-apple systems",
  },

  components: {
    Layout: {
      headerBg: "#1f2534",
      bodyBg: "#1f2534",
    },
    Menu: {
      darkItemBg: "#1f2534",
      darkItemSelectedBg: "#1F2937",
      darkItemSelectedColor: "#55aa00",
      darkItemHoverColor: "#55aa00",
    },
    Button: {
      colorPrimaryHover: "#6dd400",
      colorPrimaryActive: "#4c9900",
    },
  },
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <AuthLayout authentication={false}>
            <Home />
          </AuthLayout>
        ),
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/auth/register",
        element: (
          <AuthLayout authentication={false}>
            <Register />
          </AuthLayout>
        ),
      },
      {
        path: "/auth/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/post/:_id/:slug",
        element: <PostPage />,
      },
      {
        path: "/explore-posts",
        element: <Posts />,
      },
      {
        path: "/post/new/write",
        element: (
          <AuthLayout authentication={true}>
            <PostForm />
          </AuthLayout>
        ),
      },
      {
        path: "/settings",
        element: (
          <AuthLayout authentication={true}>
            <Settings />
          </AuthLayout>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ConfigProvider theme={postlyDarkTheme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </Provider>,
);
