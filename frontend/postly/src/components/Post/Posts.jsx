import { Content } from "antd/es/layout/layout";
import PostCard from "./PostCard.jsx";
import { Layout, theme, Pagination, Spin } from "antd";
import postService from "../../services/postService.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

function Posts() {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [error, setError] = useState("");

  let page = Number(searchParams.get("page"));
  let limit = Number(searchParams.get("limit"));

  const [loader, setLoader] = useState(true);

  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await postService.fetchPosts(
          `?page=${page}&limit=${limit}`,
        );

        setPosts(res.posts);
        setTotalPosts(res.totalPosts);

        setLoader(false);
      } catch (error) {
        setError(error.message);
      }
    };

    getPosts();
  }, [page, limit]);

  return (
    <Layout
      style={{
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "10px",
        background: token.colorBgContainer,
      }}
    >
      {!loader ? (
        <Content
          style={{
            padding: "40px 20px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {posts.map((post) => (
            <PostCard key={post._id} {...post} />
          ))}

          <div style={{ marginTop: 20 }}>
            <Pagination
              onChange={(newPage) => {
                navigate(`/explore-posts?page=${newPage}&limit=${limit}`);
                window.scrollTo(0, 0);
              }}
              current={page}
              pageSize={limit}
              align="center"
              defaultCurrent={1}
              total={totalPosts}
            />
          </div>
        </Content>
      ) : (
        <div>
          <Spin className="icon-spin" />
        </div>
      )}
    </Layout>
  );
}

export default Posts;
