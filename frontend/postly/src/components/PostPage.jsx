import React from "react";
import {
  Layout,
  Typography,
  Button,
  Space,
  Divider,
  Avatar,
  Image,
  theme,
  Row,
  Input,
} from "antd";
import {
  LikeFilled,
  LikeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { useSelector } from "react-redux";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

function PostPage({ post }) {
  const { token } = theme.useToken();

  const user = useSelector(state => state.auth.user);

  // Placeholder data if props are empty
  const data = post || {
    title: "The Impact of Quantum Computing on Modern Web Security",
    featuredImage:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000",
    content:
      "Quantum computing is no longer a thing of the future. As we move closer to practical quantum advantage, the cryptographic foundations of the web are being challenged...",
    likes: 124,
    comments: [
      {
        id: 1,
        user: "Alex Tech",
        text: "This is a fascinating breakdown of post-quantum cryptography!",
      },
      {
        id: 2,
        user: "Sarah Design",
        text: "Great read! Love the insights on security.",
      },
    ],
  };

  return (
    <Layout style={{ minHeight: "100vh", background: token.colorBgLayout }}>
      <Content
        style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto" }}
      >
        {/* Post Actions (Edit/Delete) - Top Right */}
        <Row justify="end" style={{ marginBottom: 20 }}>
          <Space>
            <Button icon={<EditOutlined />} size="small">
              Edit
            </Button>
            <Button icon={<DeleteOutlined />} danger size="small">
              Delete
            </Button>
          </Space>
        </Row>
        {/* Featured Image */}
        <div style={{ marginBottom: 30 }}>
          <Image
            width="100%"
            height={400}
            src={data.featuredImage}
            style={{ objectFit: "cover", borderRadius: 16 }}
            preview={false}
          />
        </div>

        {/* Post Header */}
        <Title level={2} style={{ fontSize: "28px", marginBottom: 16 }}>
          {data.title}
        </Title>

        <Space split={<Divider type="vertical" />} style={{ marginBottom: 24 }}>
          <Space>
            <Avatar size="small" icon={<UserOutlined />} />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              By Author Name
            </Text>
          </Space>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Oct 24, 2025
          </Text>
        </Space>

        {/* Main Content */}
        <Paragraph
          style={{
            fontSize: "15px",
            lineHeight: "1.8",
            color: token.colorTextBase,
            marginBottom: 40,
          }}
        >
          {data.content}
        </Paragraph>

        {/* Interaction Bar */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            padding: "15px 0",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Space style={{ cursor: "pointer" }}>
            <LikeOutlined
              style={{ fontSize: "18px", color: token.colorPrimary }}
            />
            <Text style={{ fontSize: "13px" }}>{data.likes}</Text>
          </Space>
          <Space style={{ cursor: "pointer" }}>
            <MessageOutlined style={{ fontSize: "18px" }} />
            <Text style={{ fontSize: "13px" }}>{data.comments.length}</Text>
          </Space>
          <Space style={{ cursor: "pointer" }}>
            <ShareAltOutlined style={{ fontSize: "18px" }} />
            <Text style={{ fontSize: "13px" }}>Share</Text>
          </Space>
        </div>

        {/* Comments Section */}
        <div style={{ marginTop: 40 }}>
          <Title level={4} style={{ fontSize: "18px", marginBottom: 20 }}>
            Comments
          </Title>

          {/* Add Comment Input */}
          <div style={{ marginBottom: 30, display: "flex", gap: "12px" }}>
            <Avatar icon={<UserOutlined />} />
            <Input.TextArea
              placeholder="Add a comment..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              style={{
                background: "#ffffff0a",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
            <Button type="primary">Add</Button>
          </div>

          {/* Comment List */}
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {data.comments.map((comment) => (
              <div key={comment.id} style={{ display: "flex", gap: "12px" }}>
                <Avatar size="small" icon={<UserOutlined />} />
                <div
                  style={{
                    background: "#ffffff0a",
                    padding: "12px 16px",
                    borderRadius: "0 12px 12px 12px",
                    flex: 1,
                  }}
                >
                  <Text strong style={{ fontSize: "13px", display: "block" }}>
                    {comment.user}
                  </Text>
                  <Text
                    style={{
                      fontSize: "13px",
                      color: token.colorTextSecondary,
                    }}
                  >
                    {comment.text}
                  </Text>
                </div>
              </div>
            ))}
          </Space>
        </div>
      </Content>
    </Layout>
  );
}

export default PostPage;
