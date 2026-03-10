import { useState } from "react";
import {
  Avatar,
  Flex,
  Typography,
  Button,
  Input,
  Space,
  Divider,
  Row,
  Col,
  Grid,
  theme,
  Upload,
} from "antd";
import { useSelector } from "react-redux";
import {
  EditOutlined,
  SaveOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import userService from "../../services/userService";
import { update } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";
import { useNotify } from "../../context/NotificationProvider.jsx";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

function UserProfile() {
  const screens = useBreakpoint();
  const { token } = theme.useToken();

  const dispatch = useDispatch();
  const notify = useNotify();

  const user = useSelector((state) => state.auth.user);

  const [error, setError] = useState();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: user?.bio || "Digital Creator & Tech Enthusiast",
    about:
      user?.about ||
      "I love building modern web applications with React and Ant Design.",
  });

  const handleEditToggle = () => setIsEditing(!isEditing);

  const containerPadding = screens.xs ? "12px" : screens.sm ? "16px" : "24px";
  const sectionPadding = screens.xs ? "12px" : screens.sm ? "20px" : "32px";
  const avatarSize = screens.xs
    ? 80
    : screens.sm
      ? 100
      : screens.md
        ? 120
        : 140;
  const titleLevel = screens.xs ? 3 : screens.sm ? 2 : 1;
  const subtextSize = screens.xs ? "12px" : screens.sm ? "14px" : "16px";
  const textSize = screens.xs ? "14px" : screens.sm ? "15px" : "16px";
  const labelSize = screens.xs ? "12px" : screens.sm ? "13px" : "14px";

  const handleAvatarUpdate = async ({ file }) => {
    try {
      notify.api.info({
        message: "Updating Avatar",
        description: "Please wait while updation is in process...",
        placement: "top",
      });

      const formData = new FormData();

      if (file) formData.append("avatar", file);

      const user = await userService.updateUserAvatar(formData);

      if (user) {
        dispatch(update(user));

        notify.api.success({
          message: "Avatar Updated Successfully",
          placement: "top",
        });
      }
    } catch (error) {
      setError(error.message);

      notify.api.error({
        message: "Failed to Update Avatar",
        description: error.message,
        placement: "top",
      });
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const res = await userService.removeUserAvatar();

      if (res.status === 200) {
        notify.api.success({
          message: "Avatar removed successfully",
          placement: "top",
        });

        const user = res.data?.data;

        dispatch(update(user));
      }
    } catch (error) {
      setError(error.message);

      notify.api.error({
        message: error.message,
        placement: "top",
      });
    }
  };

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        width: "100%",
        padding: containerPadding,
      }}
    >
      {/* Top Profile Section */}
      <Row
        gutter={[
          screens.xs ? 12 : screens.sm ? 16 : 24,
          screens.xs ? 12 : screens.sm ? 16 : 24,
        ]}
        align="middle"
        justify={screens.xs ? "center" : "start"}
      >
        {/* Avatar Column */}
        <Col
          xs={24}
          sm={6}
          md={5}
          lg={4}
          style={{ textAlign: "center", flexShrink: 0 }}
        >
          <Avatar
            src={user?.avatar?.url}
            size={avatarSize}
            style={{
              border: `3px solid ${token.colorPrimary}`,
              display: "block",
              margin: "0 auto",
            }}
          />
        </Col>

        {/* Buttons, Name & Username Column */}
        <Col
          xs={24}
          sm={18}
          md={19}
          lg={20}
          style={{ textAlign: screens.xs ? "center" : "left" }}
        >
          {/* Update & Remove Buttons */}
          <Flex
            gap={8}
            justify={screens.xs ? "center" : "flex-start"}
            wrap="wrap"
            style={{ marginBottom: 16 }}
          >
            <Upload
              customRequest={handleAvatarUpdate}
              maxCount={1}
              showUploadList={false}
            >
              <Button
                size="small"
                icon={<UploadOutlined />}
                style={{ width: 90 }}
              >
                Update
              </Button>
            </Upload>
            <Button
              onClick={handleRemoveAvatar}
              size="small"
              danger
              icon={<DeleteOutlined />}
              style={{ width: 90 }}
            >
              Remove
            </Button>
          </Flex>

          {/* Name & Username */}
          <Title
            level={titleLevel}
            style={{
              margin: "0 0 4px 0",
              color: token.colorTextBase,
            }}
          >
            {user?.fullName || "User Full Name"}
          </Title>
          <Text
            type="secondary"
            style={{
              fontSize: subtextSize,
              color: token.colorTextSecondary,
              display: "block",
            }}
          >
            @{user?.username || "username"}
          </Text>
        </Col>
      </Row>

      <Divider style={{ margin: screens.xs ? "12px 0" : "20px 0" }} />

      {/* Edit Button - Right Aligned */}
      <Flex
        justify="flex-end"
        style={{ marginBottom: screens.xs ? "12px" : "16px" }}
      >
        <Button
          type={isEditing ? "primary" : "default"}
          icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
          onClick={handleEditToggle}
          size="small"
          style={{
            padding: "10px 14px",
            fontSize: screens.xs ? "12px" : "14px",
            borderRadius: "6px",
          }}
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
      </Flex>

      {/* Content Box */}
      <div
        style={{
          padding: sectionPadding,
          borderRadius: token.borderRadiusLG,
          background: token.colorBgContainer,
          border: `1px solid ${token.colorBorder}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <Space vertical size="large" style={{ width: "100%" }}>
          {/* Bio Section */}
          <section>
            <Text
              strong
              style={{
                display: "block",
                marginBottom: 8,
                color: token.colorTextSecondary,
                fontSize: labelSize,
                letterSpacing: "0.5px",
              }}
            >
              Bio
            </Text>
            {isEditing ? (
              <Input
                size={screens.xs ? "middle" : "large"}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Write a catchy bio..."
                style={{
                  fontSize: textSize,
                  borderRadius: token.borderRadiusLG,
                }}
              />
            ) : (
              <Title
                level={5}
                style={{
                  marginTop: 0,
                  marginBottom: 0,
                  color: token.colorTextBase,
                  fontSize: textSize,
                }}
              >
                {formData.bio}
              </Title>
            )}
          </section>

          <Divider style={{ margin: "12px 0" }} />

          {/* About Section */}
          <section>
            <Text
              strong
              style={{
                display: "block",
                marginBottom: 8,
                color: token.colorTextSecondary,
                fontSize: labelSize,
                letterSpacing: "0.5px",
              }}
            >
              About
            </Text>
            {isEditing ? (
              <TextArea
                rows={screens.xs ? 4 : screens.sm ? 5 : 6}
                value={formData.about}
                onChange={(e) =>
                  setFormData({ ...formData, about: e.target.value })
                }
                placeholder="Tell us about yourself..."
                style={{
                  fontSize: textSize,
                  borderRadius: token.borderRadiusLG,
                  lineHeight: "1.6",
                }}
              />
            ) : (
              <Text
                style={{
                  fontSize: textSize,
                  lineHeight: "1.6",
                  color: token.colorTextBase,
                }}
              >
                {formData.about}
              </Text>
            )}
          </section>
        </Space>
      </div>
    </div>
  );
}

export default UserProfile;
