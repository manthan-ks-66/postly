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

import postService from "../services/postService.js";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Posts from "./Posts.jsx";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

function PostPage() {
  const { token } = theme.useToken();

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  const [like, setLike] = useState(<LikeOutlined />);

  const { _id } = useParams();

  const user = useSelector((state) => state.auth.user);

  const fetchPost = async () => {
    try {
      const resPost = await postService.fetchOnePost(_id);

      setPost(resPost[0]);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [_id]);

  const togglePostLike = async () => {
    postService.togglePostLike(post?._id).then((res) => {
      if (res.statusCode === 200) {
        fetchPost();
      }
    });
  };

  const isAuthor = post && user ? user._id === post.userId : false;

  console.log(post);

  return (
    <Layout style={{ minHeight: "100vh", background: token.colorBgLayout }}>
      <Content
        style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto" }}
      >
        {/* Post Actions (Edit/Delete) - Top Right */}
        {isAuthor && (
          <Row justify="end" style={{ marginBottom: 20 }}>
            <Space>
              <Link to={`/post/${post?._id}/${post?.slug}/edit`}>
                <Button icon={<EditOutlined />} size="small">
                  Edit
                </Button>
              </Link>
              <Link>
                <Button icon={<DeleteOutlined />} danger size="small">
                  Delete
                </Button>
              </Link>
            </Space>
          </Row>
        )}
        {/* Featured Image */}
        <div style={{ marginBottom: 30 }}>
          <Image
            width="100%"
            height={400}
            src={post?.featuredImage}
            style={{ objectFit: "fill", borderRadius: 16 }}
          />
        </div>

        {/* Post Header */}
        <Title level={2} style={{ fontSize: "28px", marginBottom: 16 }}>
          {post?.title}
        </Title>

        <Space split={<Divider vertical />} style={{ marginBottom: 24 }}>
          <Space>
            <Avatar
              src={post?.author?.avatar}
              size="large"
              icon={<UserOutlined />}
            />
            <Text type="secondary" style={{ fontSize: "14px" }}>
              By {post?.author?.fullName}
            </Text>
          </Space>
          <Text type="secondary" style={{ fontSize: "13px" }}>
            {post?.createdAt}
          </Text>
        </Space>

        {/* Interaction Bar */}
        <div
          style={{
            display: "flex",
            gap: "28px",
            padding: "15px 0",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Space style={{ cursor: "pointer" }}>
            <LikeOutlined
              onClick={() => {
                togglePostLike();
                setLike(<LikeFilled />);
              }}
              style={{ fontSize: "18px", color: token.colorPrimary }}
            />
            <Text style={{ fontSize: "13px" }}>{post?.likesCount}</Text>
          </Space>
          <Space style={{ cursor: "pointer" }}>
            <MessageOutlined style={{ fontSize: "18px" }} />
            <Text style={{ fontSize: "13px" }}>{post?.commentsCount}</Text>
          </Space>
          <Space style={{ cursor: "pointer" }}>
            <ShareAltOutlined style={{ fontSize: "18px" }} />
            <Text style={{ fontSize: "13px" }}>Share</Text>
          </Space>
        </div>

        {/* Main Content */}
        <Paragraph
          style={{
            fontSize: "15px",
            lineHeight: "1.8",
            color: token.colorTextBase,
            marginTop: 40,
            lineHeight: "1.8",
            letterSpacing: "0.6px",
          }}
        >
          {post?.content}
        </Paragraph>

        {/* Comments Section */}
        <div style={{ marginTop: 40 }}>
          <Title level={4} style={{ fontSize: "18px", marginBottom: 20 }}>
            Comments
          </Title>

          {/* Add Comment Input */}
          <div style={{ marginBottom: 30, display: "flex", gap: "12px" }}>
            <Avatar src={user?.avatar} icon={<UserOutlined />} />
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
        </div>
      </Content>
    </Layout>
  );
}

export default PostPage;
