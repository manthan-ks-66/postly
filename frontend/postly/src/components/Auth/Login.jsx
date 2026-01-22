import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import authService from "../../services/authService.js";
import { login } from "../../store/authSlice.js";
import { Button, Form, Input, Layout, Alert } from "antd";
import { useNotify } from "../../context/NotificationProvider.jsx";

import { theme } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

function Login() {
  const notify = useNotify();

  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm();

  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const loginUser = async (data) => {
    try {
      const user = await authService.loginUser(data);

      if (user) dispatch(login(user));
      navigate("/");

      notify.api.success({
        title: "Welcome Back",
        description: "You are now logged in",
        placement: "top",
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAntdSubmit = () => {
    handleSubmit(loginUser)();
  };

  return (
    <Layout
      style={{
        alignItems: "center",
        justifyContent: "center",
        background: token.colorBgContainer,
        minHeight: "100vh", // Use minHeight for mobile stability
        padding: "10px",
      }}
    >
      {error && (
        <Alert
          style={{
            textAlign: "center",
            border: "none",
            width: "20%",
            justifySelf: "center",
            marginBottom: 20,
          }}
          type="error"
          title={error}
        />
      )}

      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          padding: "30px 20px",
          backgroundColor: "#ffffff1e",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 20,
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: token.colorText,
          }}
        >
          Login
        </h2>

        <div style={{ marginBottom: 19, textAlign: "center" }}>
          <span style={{ color: token.colorTextSecondary }}>
            Don't have an account?
          </span>
          &nbsp;
          <Link
            to="/auth/register"
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: token.colorPrimary,
            }}
          >
            Register here
          </Link>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleAntdSubmit}
          requiredMark={false} // Hides the red asterisk
        >
          <Form.Item
            prefix={<UserOutlined />}
            label="Username"
            style={{ marginBottom: 16 }}
          >
            <Controller
              name="username"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="username  or  email"
                  size="large"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            prefix={<LockOutlined />}
            label="Password"
            style={{ marginBottom: 8 }}
          >
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="password"
                  size="large"
                />
              )}
            />
          </Form.Item>

          <div style={{ marginBottom: 19, textAlign: "left" }}>
            <Link
              to="/reset-password"
              style={{
                fontSize: "13px",
                fontWeight: "bold",
                color: token.colorPrimary,
              }}
            >
              Forgot Password?
            </Link>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                fontWeight: "bold",
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
}

export default Login;
