import PostCard from "./PostCard";
import { Layout, theme } from "antd";

function Posts() {
  const token = theme.useToken();
  return (
    <Layout
      style={{
        alignItems: "center",
        justifyContent: "center",
        background: token.colorBgContainer,
        minHeight: "100vh", // Use minHeight for mobile stability
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
