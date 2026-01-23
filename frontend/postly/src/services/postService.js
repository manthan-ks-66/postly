import axios from "axios";
import errorHandler from "./errorHandler.js";

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
      errorHandler.handleError(error);
    }
  }

  async fetchOnePost(postId) {
    try {
      const res = await axios.get(`${this.postsBaseUrl}/get-post/${postId}`);

      return res.data?.data;
    } catch (error) {
      errorHandler.handleError(error);
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
      errorHandler.handleError(error);
    }
  }

  async fetchQueryPost(query) {
    try {
      const res = await axios.get(
        `${this.postsBaseUrl}/get-query-post${query}`,
      );

      return res.data;
    } catch (error) {
      errorHandler.handleError(error);
    }
  }
}

const postService = new PostService();

export default postService;
