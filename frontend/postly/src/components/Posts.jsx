import PostCard from "./PostCard";
import { Layout, theme } from "antd";

function Posts() {
  const token = theme.useToken();

  return (
    <Layout
      style={{
        alignItems: "center",
        justifyContent: "center",
        background: token.darkItemBg,
        minHeight: "100vh",
        padding: "10px",
      }}
    >
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
    </Layout>
  );
}

export default Posts;
