import { Layout, theme, Pagination, Spin } from "antd";
import { Content } from "antd/es/layout/layout";

import postService from "../../services/postService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import PostCard from "./PostCard";

function QueryPosts() {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  let page = Number(searchParams.get("page"));
  let limit = Number(searchParams.get("limit"));
  let query = searchParams.get("query");

  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(1);

  const [error, setError] = useState("");

  useEffect(() => {
    postService
      .fetchQueryPost(`?query=${query}&page=${page}&limit=${limit}`)
      .then((data) => {
        setPosts(data?.data?.posts);
        setTotalPosts(data?.data?.totalPosts);
      });
  }, [page, limit, query]);

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
      {posts.length > 0 ? (
        <Content
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "40px 20px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {posts.map((post) => (
            <PostCard key={post._id} {...post} />
          ))}

          <div style={{ marginTop: "auto" }}>
            <Pagination
              onChange={(newPage) => {
                navigate(
                  `/search?query=${query}&page=${newPage}&limit=${limit}`,
                );
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: token.colorBgContainer,
          }}
        >
          <h2
            style={{
              textAlign: "center",
              color: token.colorText,
            }}
          >
            No posts found!
          </h2>
        </div>
      )}
    </Layout>
  );
}

export default QueryPosts;
