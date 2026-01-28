import {
  Layout,
  Typography,
  Button,
  Space,
  Avatar,
  Image,
  theme,
  Input,
  Modal,
  Flex,
  Spin,
} from "antd";
import {
  LikeFilled,
  LikeOutlined,
  MessageOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  LinkedinOutlined,
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
  const [loader, setLoader] = useState(true);

  const { _id, slug } = useParams();

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
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [_id]);

  const togglePostLike = async () => {
    if (user) {
      postService.togglePostLike(post?._id).then((res) => {
        if (res.statusCode === 200) {
          setPost((prev) => ({
            ...prev,
            likesCount: res.data?.likesCount,
          }));
        }
      });
    } else {
      notify.api.info({ title: "Login to like post", placement: "top" });
    }
  };

  // TODO: implement isLiked functionality

  const isAuthor = post && user ? user._id === post.userId : false;

  return (
    <Layout style={{ minHeight: "100vh", background: token.colorBgLayout }}>
      {!loader ? (
        <Content className="post-content-container">
          {/* Post Actions */}
          {isAuthor && (
            <Flex justify="flex-end" className="post-actions">
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
          <div className="featured-image-wrapper">
            <Image
              className="featured-image"
              width="100%"
              src={post?.featuredImage}
            />
          </div>

          {/* Post Header */}
          <Title level={2} className="post-title">
            {post?.title}
          </Title>

          {/* Metadata Bar */}
          <Flex
            wrap="wrap"
            align="center"
            gap="12px"
            className="post-meta-container"
          >
            <Space>
              <Avatar
                size={40}
                src={post?.author?.avatar}
                icon={<UserOutlined />}
              />
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
            gap="14px"
            wrap="wrap"
            className="post-interactions"
            style={{
              borderTop: `1px solid ${token.colorBorderSecondary}`,
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            <Button icon={<LikeFilled />} onClick={togglePostLike}>
              {post?.likesCount}
            </Button>

            <Button icon={<MessageOutlined />}>{post?.commentsCount}</Button>

            <Button onClick={() => setOpen(true)} icon={<UploadOutlined />}>
              Share
            </Button>

            <Modal
              title="Share Post"
              okText="Copy"
              onOk={copyToClipboard}
              open={open}
              onCancel={() => setOpen(false)}
              cancelText="Close"
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
            className="post-body"
            style={{
              color: token.colorText,
            }}
          >
            {post?.content}
          </Paragraph>
        </Content>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            minHeight: "100vh",
            alignItems: "center",
          }}
        >
          <Spin className="icon-spin" />
        </div>
      )}
    </Layout>
  );
}

export default PostPage;
