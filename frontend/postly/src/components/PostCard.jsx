import { Card, Typography, Space, Tag, theme, Layout } from "antd";
import {
  HeartOutlined,
  MessageOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

function PostCard({ post }) {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  // Standardizing the card style to match your UI
  const cardStyle = {
    background: "#ffffff0a",
    borderRadius: 16,
    border: "1px solid rgba(255, 255, 255, 0.1)",
    marginBottom: 20,
    overflow: "hidden",
    transition: "transform 0.2s, background 0.2s",
    cursor: "pointer",
  };

  return (
   
      <Card
        hoverable
        className="post-card"
        style={cardStyle}
        onClick={() => navigate(`/post/${post?.slug}`)}
      >
        <div
          style={{
            display: "flex",
            flexDirection: window.innerWidth < 768 ? "column" : "row",
          }}
        >
          {/* Left: Featured Image */}
          <div
            style={{
              flex: "0 0 280px",
              height: window.innerWidth < 768 ? "200px" : "auto",
              position: "relative",
            }}
          >
            <img
              src={post?.featuredImage || "https://via.placeholder.com/300x200"}
              alt="post"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Right: Content Section */}
          <div
            style={{
              padding: "20px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Space style={{ marginBottom: 8 }}>
                <Tag
                  color={token.colorPrimary}
                  style={{ fontSize: "10px", borderRadius: 4, border: "none" }}
                >
                  {post?.category || "Tech"}
                </Tag>
                <Text type="secondary" style={{ fontSize: "11px" }}>
                  5 min read
                </Text>
              </Space>

              <Title
                level={4}
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "18px",
                  color: token.colorTextBase,
                }}
              >
                {post?.title}
              </Title>

              <Paragraph
                ellipsis={{ rows: 2 }}
                style={{
                  fontSize: "13px",
                  color: token.colorTextSecondary,
                  marginBottom: 15,
                }}
              >
                {post?.excerpt ||
                  "Discover the latest innovations shaping our world today..."}
              </Paragraph>
            </div>

            {/* Footer of the Card */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "auto",
              }}
            >
              <Space size="large">
                <Space size="small">
                  <HeartOutlined
                    style={{ color: token.colorPrimary, fontSize: "14px" }}
                  />
                  <Text
                    style={{
                      fontSize: "12px",
                      color: token.colorTextSecondary,
                    }}
                  >
                    124
                  </Text>
                </Space>
                <Space size="small">
                  <MessageOutlined style={{ fontSize: "14px" }} />
                  <Text
                    style={{
                      fontSize: "12px",
                      color: token.colorTextSecondary,
                    }}
                  >
                    18
                  </Text>
                </Space>
              </Space>

              <Text
                style={{
                  color: token.colorPrimary,
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                Read Post <ArrowRightOutlined style={{ fontSize: "10px" }} />
              </Text>
            </div>
          </div>
        </div>

        <style>{`
        .post-card:hover {
          background: #ffffff15 !important;
          transform: translateY(-2px);
        }
      `}</style>
      </Card>
  );
}

export default PostCard;
