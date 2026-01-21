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
  Modal,
  Flex,
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
import "./PostPage.css";

import postService from "../../services/postService.js";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNotify } from "../../context/NotificationProvider.jsx";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

function PostPage() {
  const { token } = theme.useToken();
  const notify = useNotify();

  const [open, setOpen] = useState(false);

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  const { _id } = useParams();

  const user = useSelector((state) => state.auth.user);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);

    notify.api.success({
      title: "Link Copied to Clipboard",
      placement: "top",
    });
  };

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

  return (
    <Layout style={{ minHeight: "100vh", background: token.colorBgLayout }}>
      <Content
        className="post-content-container"
        style={{
          padding: "40px 20px",
          maxWidth: "850px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* Post Actions */}
        {isAuthor && (
          <Flex justify="flex-end" style={{ marginBottom: 20 }}>
            <Space wrap>
              <Link to={`/post/${post?._id}/${post?.slug}/edit`}>
                <Button icon={<EditOutlined />} size="small">
                  Edit
                </Button>
              </Link>
              <Button icon={<DeleteOutlined />} danger size="small">
                Delete
              </Button>
            </Space>
          </Flex>
        )}

        {error && <Text type="danger">{error}</Text>}

        {/* Featured Image */}
        <div style={{ marginBottom: 30 }}>
          <Image
            className="featured-image"
            width="100%"
            src={post?.featuredImage}
            style={{
              objectFit: "cover",
              borderRadius: 16,
            }}
          />
        </div>

        {/* Post Header */}
        <Title
          level={2}
          style={{
            fontSize: "clamp(22px, 5vw, 32px)",
            marginBottom: 16,
            lineHeight: 1.3,
          }}
        >
          {post?.title}
        </Title>

        {/* Metadata Bar - Responsive & Non-Deprecated */}
        <Flex
          wrap="wrap"
          align="center"
          gap="12px"
          style={{ marginBottom: 24 }}
        >
          <Space>
            <Avatar src={post?.author?.avatar} icon={<UserOutlined />} />
            <Text type="secondary" strong>
              By {post?.author?.fullName}
            </Text>
          </Space>

           <div
              className="divider"
              style={{
                width: "100%",
                height: 1,
                background: token.colorBorderSecondary,
              }}
            />

          <Flex wrap="wrap" align="center" gap="8px">
            <div
              className="meta-divider meta-divider-left"
              style={{
                width: 1,
                height: 14,
                background: token.colorBorderSecondary,
              }}
            />

            <Text type="secondary" style={{ fontSize: "13px" }}>
              {post?.createdAt}
            </Text>

            {post?.editedAt && (
              <Flex align="center" gap="8px">
                <div
                  className="meta-divider"
                  style={{
                    width: 1,
                    height: 14,
                    background: token.colorBorderSecondary,
                  }}
                />
                <Text type="secondary" italic style={{ fontSize: "13px" }}>
                  Edited: {post?.editedAt}
                </Text>
              </Flex>
            )}
          </Flex>
        </Flex>

        {/* Interaction Bar */}
        <Flex
          gap="8px"
          wrap="wrap"
          style={{
            padding: "12px 0",
            borderTop: `1px solid ${token.colorBorderSecondary}`,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Button
            className="interaction-btn"
            icon={
              post?.isLiked ? (
                <LikeFilled style={{ color: token.colorPrimary }} />
              ) : (
                <LikeOutlined />
              )
            }
            onClick={togglePostLike}
          >
            {post?.likesCount || 0}
          </Button>

          <Button className="interaction-btn" icon={<MessageOutlined />}>
            {post?.commentsCount || 0}
          </Button>

          <Button
            className="interaction-btn"
            onClick={() => setOpen(true)}
            icon={<ShareAltOutlined />}
          >
            Share
          </Button>

          <Modal
            title="Share Post"
            okText="Copy"
            onOk={copyToClipboard}
            open={open}
            onCancel={() => setOpen(false)}
            centered
          >
            <Input
              value={window.location.href}
              readOnly
              style={{ marginTop: 16 }}
            />
          </Modal>
        </Flex>

        {/* Main Content */}
        <Paragraph
          style={{
            fontSize: "16px",
            lineHeight: "1.9",
            marginTop: 40,
            whiteSpace: "pre-wrap",
            color: token.colorText,
          }}
        >
          {post?.content}
        </Paragraph>
      </Content>
    </Layout>
  );
}

export default PostPage;
