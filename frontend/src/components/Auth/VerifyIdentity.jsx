import { Card, Form, Input, Button, Typography, Layout, theme } from "antd";
import { ArrowLeftOutlined, MailOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const { Title, Text } = Typography;

const VerifyIdentity = () => {
  const { token } = theme.useToken();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const submitEmail = async (data) => {
    setLoading(true);
    try {
      const email = data.email;
      const res = await authService.sendResetPasswordOTP({ email });

      if (res.statusCode === 200) {
        sessionStorage.setItem("verificationStatus", true);
        navigate("/auth/forgot-password/reset/verify");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Card
          style={{
            width: 400,
            borderRadius: "8px",
            backgroundColor: "#ffffff1e",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Title level={3}>Forgot Password?</Title>
            <Text type="secondary">
              Enter your registered email to receive an OTP
            </Text>
          </div>

          <form onSubmit={handleSubmit(submitEmail)}>
            <Form layout="vertical" component={false}>
              <Form.Item
                label="Email Address"
                validateStatus={errors.email ? "error" : ""}
                help={errors.email?.message}
              >
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Enter a valid email",
                    },
                  }}
                  render={({ field }) => (
                    <Input {...field} size="middle" prefix={<MailOutlined />} />
                  )}
                />
              </Form.Item>

              <Button
                loading={loading}
                disabled={loading}
                type="primary"
                htmlType="submit"
                block
                size="middle"
                style={{ marginTop: "8px" }}
              >
                Send Reset Code
              </Button>
            </Form>
          </form>

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <Button
              style={{ color: token.colorPrimary }}
              size="small"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/auth/login")}
              type="link"
            >
              Back to Login
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default VerifyIdentity;
