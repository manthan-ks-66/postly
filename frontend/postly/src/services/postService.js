import axios from "axios";

class PostService {
  constructor() {
    this.postsBaseUrl = import.meta.env.VITE_POSTS_API_BASE_URL;

    if (!this.postsBaseUrl) {
      throw new Error("Env variable is not set");
    }
  }

  async fetchPosts(query) {
    try {
      const response = await axios.get(
        `${this.postsBaseUrl}/get-all-posts${query}`,
      );

      return response.data.data;
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  async fetchOnePost(postId) {
    try {
      const res = await axios.get(`${this.postsBaseUrl}/get-post/${postId}`);

      return res.data?.data;
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  async togglePostLike(postId) {
    try {
      const res = await axios.post(
        `${this.postsBaseUrl}/toggle-like`,
        {
          postId,
        },
        {
          withCredentials: true,
        },
      );

      return res.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async fetchQueryPost(query) {
    try {
      const res = await axios.get(`${this.postsBaseUrl}/get-query-post${query}`);

      return res.data;
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

const postService = new PostService();

export default postService;
