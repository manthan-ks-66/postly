import { Card, Typography, Space, Tag, theme, Layout } from "antd";
import {
  HeartOutlined,
  MessageOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

function PostCard({ post }) {

  const navigate = useNavigate();

  // Standardizing the card style to match your UI
  const cardStyle = {
    borderRadius: 16,
    border: "1px solid rgba(23, 31, 51, 0.1)",
    marginBottom: 20,
    overflow: "hidden",
    transition: "transform 0.2s, background 0.2s",
    cursor: "pointer",
    width: 700,
  };

  return (
    <Link to={`/post/${post?.slug}`}>
      <Card title="Post Title" variant="borderless" style={cardStyle}>
        <div>Post Card</div>
      </Card>
    </Link>
  );
}

export default PostCard;
