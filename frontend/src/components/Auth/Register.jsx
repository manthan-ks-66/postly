import { useDispatch } from "react-redux";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import authService from "../../services/authService.js";
import { login } from "../../store/authSlice.js";
import { Button, Flex, Form, Input, Layout, Upload, Alert } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { useNotify } from "../../context/NotificationProvider.jsx";

import { theme } from "antd";

function Register() {
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { handleSubmit, control } = useForm();

  const navigate = useNavigate();

  const notify = useNotify();

  const [form] = Form.useForm();

  const { token } = theme.useToken();

  const register = async (data) => {
    try {
      let userFormData = new FormData();

      for (let val in data) {
        if (typeof val !== "object") {
          userFormData.append(val, data[val]);
        }
      }

      if (data.avatar && data.avatar[0]) {
        userFormData.append("avatar", data.avatar[0].originFileObj);
      }

      const user = await authService.registerUser(userFormData);

      if (user) dispatch(login(user));

      notify.api.success({
        title: "Registration Completed",
        description: "Your are now logged in",
        placement: "top",
      });

      navigate("/");
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
        minHeight: "100vh", // Used minHeight for mobile stability
        padding: "10px",
      }}
    >
      {error && (
        <Alert
          style={{
            textAlign: "center",
            border: "none",
            width: "30%",
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
          maxWidth: "600px", // Limits width on desktop
          padding: "30px 20px",
          backgroundColor: "#ffffff1e",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 20,
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: token.colorText,
          }}
        >
          Register
        </h2>

        <div style={{ marginBottom: 19, textAlign: "center" }}>
          <span style={{ color: token.colorTextSecondary }}>
            Already have an account?
          </span>
          &nbsp; &nbsp;
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

        <Form
          onFinish={handleAntdSubmit}
          form={form}
          layout="vertical"
          requiredMark={false} // Hides the red asterisk
        >
          <Form.Item label="Email" style={{ marginBottom: 16 }}>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder="email"
                  size="middle"
                />
              )}
            />
          </Form.Item>

          <Flex gap="middle">
            <Form.Item
              label="Username"
              style={{ marginBottom: 16, flex: "50%" }}
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

            <Form.Item
              label="Full Name"
              style={{ marginBottom: 16, flex: "50%" }}
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
          </Flex>

          <Form.Item label="Password" style={{ marginBottom: 8 }}>
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

          <Form.Item label="Avatar" style={{ marginBottom: 16 }}>
            <Controller
              name="avatar"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Upload
                  fileList={value || []}
                  onChange={(info) => {
                    onChange(info.fileList);
                  }}
                  style={{ width: "100%" }}
                  maxCount={1}
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>Add Your Avatar</Button>
                </Upload>
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                marginTop: 10,
                fontWeight: "bold",
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
