import axios from "axios";
import handleError from "./errorHandler.js";

class UserService {
  constructor() {
    this.usersBaseUrl = import.meta.env.VITE_USERS_API_BASE_URL;

    if (!this.usersBaseUrl) {
      throw new Error("VITE_API_BASE_URL env variable is not set");
    }
  }

  async updateUserAvatar(formData) {
    try {
      const res = await axios.patch(
        `${this.usersBaseUrl}/update-avatar`,
        formData,
        {
          withCredentials: true,
        },
      );

      return res.data?.data;
    } catch (error) {
      handleError(error);
    }
  }

  async removeUserAvatar() {
    try {
      const res = await axios.patch(
        `${this.usersBaseUrl}/remove-avatar`,
        {},
        {
          withCredentials: true,
        },
      );

      return res;
    } catch (error) {
      handleError(error);
    }
  }
}

const userService = new UserService();

export default userService;
