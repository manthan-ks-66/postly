// react and redux imports
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

// services imports
import authService from "../../services/authService.js";

// react hook form
import { useForm, Controller } from "react-hook-form";

// antd imports
import { Button, Flex, Form, Input, Layout, Divider, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Logo from "../Logo/Logo.jsx";
import GoogleBtn from "./GoogleBtn.jsx";
import { theme } from "antd";

const { Text } = Typography;

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const { userData } = useOutletContext();

  const [form] = Form.useForm();
  const { token } = theme.useToken();

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      email: "",
      username: "",
      fullName: "",
      password: "",
    },
  });

  useEffect(() => {
    reset({
      email: userData?.email || "",
      fullName: userData?.fullName || "",
      username: userData?.username || "",
      password: "",
    });
  }, [userData, reset]);

  const register = async (data) => {
    try {
      const res = await authService.registerUser(data);

      const userId = res.data?.data?.userId;
      

      if (res.status === 201 || res.status === 200) {
        localStorage.setItem("userId", userId);

        navigate("/auth/register/verify");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAntdSubmit = () => {
    handleSubmit(register)();
  };

  return (
    <Layout
      style={{
        alignItems: "center",
        justifyContent: "center",
        background: token.colorBgContainer,
        minHeight: "100vh",
        padding: "10px",
      }}
    >
      <Logo />

      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "30px 20px",
          backgroundColor: "#ffffff1e",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 20,
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0)",
        }}
      >
        <h2
          style={{
            margin: "10px 0 10px 0",
            textAlign: "center",
            color: token.colorText,
          }}
        >
          Register
        </h2>

        <div
          style={{
            minHeight: "20px",
            margin: "10px 0",
            textAlign: "center",
            visibility: error ? "visible" : "hidden",
          }}
          className="errorContainer"
        >
          {error && (
            <Text
              style={{ display: "flex", justifyContent: "center" }}
              type="danger"
            >
              {error}
            </Text>
          )}
        </div>

        <div
          style={{
            width: "100%",
            margin: "15px 0 15px 0",
            textAlign: "center",
          }}
        >
          <span style={{ color: token.colorTextSecondary }}>
            Already have an account?
          </span>
          &nbsp;
          <Link
            to="/auth/login"
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color: token.colorPrimary,
            }}
          >
            Login here
          </Link>
        </div>

        <GoogleBtn />

        <div
          style={{
            color: token.colorTextSecondary,
          }}
          className="authDivider"
        >
          <Divider>OR</Divider>
        </div>

        <Form
          style={{ width: "100%" }}
          form={form}
          layout="vertical"
          onFinish={handleAntdSubmit}
          requiredMark={false}
        >
          <Flex gap="middle">
            <Form.Item
              prefix={<UserOutlined />}
              label="Full Name"
              style={{ flex: 1 }}
            >
              <Controller
                name="fullName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input {...field} placeholder="full name" size="middle" />
                )}
              />
            </Form.Item>

            <Form.Item
              prefix={<UserOutlined />}
              label="Username"
              style={{ flex: 1 }}
            >
              <Controller
                name="username"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input {...field} placeholder="username" size="middle" />
                )}
              />
            </Form.Item>
          </Flex>

          <Flex style={{ marginBottom: 8 }} gap="middle">
            <Form.Item
              prefix={<UserOutlined />}
              label="Email"
              style={{ flex: 1 }}
            >
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input {...field} placeholder="email" size="middle" />
                )}
              />
            </Form.Item>

            <Form.Item
              prefix={<LockOutlined />}
              label="Password"
              style={{ flex: 1 }}
            >
              <Controller
                name="password"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    placeholder="password"
                    size="middle"
                  />
                )}
              />
            </Form.Item>
          </Flex>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                fontWeight: "bold",
                padding: 20,
                borderRadius: 10,
              }}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
}

export default Register;
