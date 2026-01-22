import { Card, Typography, theme, Divider } from "antd";
import {
  ShareAltOutlined,
  MessageOutlined,
  LikeOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;
import { Link, useNavigate } from "react-router-dom";

function PostCard({
  _id,
  title,
  content,
  featuredImage,
  likesCount,
  commentsCount,
  slug,
}) {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  return (
    <>
      <Card
        hoverable
        styles={{ body: { padding: 0 } }}
        style={{
          margin: "30px 0",
          width: "100%",
          maxWidth: "890px",
          background: token.colorBgCard,
          borderRadius: 16,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          overflow: "hidden",
          backdropFilter: "blur(10px)",
        }}
      >
        <Link to={`/post/${_id}/${slug}`}>
          {/* Top Section */}
          <div
            style={{
              padding: "12px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <Title
              level={5}
              style={{
                margin: 0,
                color: token.colorTextBase,
                fontSize: "14px",
              }}
            >
              {title}
            </Title>
          </div>

          {/* Middle Section */}
          <div style={{ display: "flex", width: "100%" }}>
            {featuredImage && (
              <div
                style={{
                  flex: "0 0 120px",
                  height: "120px",
                }}
                className="responsive-image-container"
              >
                <img
                  src={featuredImage}
                    alt="post"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}

            {/* Post Contents: Expands if no image is present */}
            <div
              style={{
                padding: "20px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minWidth: 0,
              }}
            >
              <Paragraph
                ellipsis={{ rows: featuredImage ? 3 : 5 }} // More rows if no image
                style={{
                  color: token.colorTextSecondary,
                  fontSize: "14px",
                  margin: 0,
                  lineHeight: 1.5,
                  justifyContent: "center",
                }}
              >
                {content.slice(0, 180)}
                <p
                  onClick={() => navigate(`/post/${_id}/${slug}`)}
                  style={{ color: token.colorPrimary, cursor: "pointer" }}
                >
                  More
                </p>
              </Paragraph>
            </div>
          </div>
        </Link>

        {/* Bottom Section */}
        <div
          style={{
            display: "flex",
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <div className="card-action-item">
            <LikeOutlined style={{ color: "#ff4d4f" }} />
            <span style={{ marginLeft: 6, fontSize: "12px" }}>
              {likesCount}
            </span>
          </div>
          <Divider vertical style={{ height: "48px", margin: 0 }} />
          <div className="card-action-item">
            <MessageOutlined style={{ color: "#1890ff" }} />
            <span style={{ marginLeft: 6, fontSize: "12px" }}>
              {commentsCount} {/* Fixed reference */}
            </span>
          </div>
          <Divider vertical style={{ height: "48px", margin: 0 }} />
          <div className="card-action-item">
            <ShareAltOutlined style={{ color: "#52c41a" }} />
            <span style={{ marginLeft: 6, fontSize: "12px" }}>Share</span>
          </div>
        </div>

        <style>{`
        .card-action-item {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 48px;
          cursor: pointer;
          transition: background 0.3s;
          color: rgba(255, 255, 255, 0.65);
        }
        .card-action-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        
        @media (max-width: 576px) {
          .responsive-image-container {
            flex: 0 0 100px !important;
            height: 100px !important;
          }
        }

        @media (min-width: 577px) {
          .responsive-image-container {
            flex: 0 0 200px !important;
            height: 180px !important;
          }
        }
      `}</style>
      </Card>
    </>
  );
}

export default PostCard;
