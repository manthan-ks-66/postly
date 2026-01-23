import axios from "axios";
import errorHandler from "./errorHandler.js";

class AuthService {
  constructor() {
    this.usersBaseUrl = import.meta.env.VITE_USERS_API_BASE_URL;

    if (!this.usersBaseUrl) {
      throw new Error("VITE_API_BASE_URL env variable is not set");
    }
  }

  async registerUser(formData) {
    try {
      const response = await axios.post(
        `${this.usersBaseUrl}/register`,
        formData,
      );

      if (response?.data) {
        return await this.loginUser({
          username: formData.get("username"),
          password: formData.get("password"),
        });
      }
    } catch (error) {
      errorHandler.handleError(error);
    }
  }

  async loginUser({ username, password }) {
    try {
      const response = await axios.post(
        `${this.usersBaseUrl}/login`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        },
      );

      return response?.data?.data?.user;
    } catch (error) {
      errorHandler.handleError(error);
    }
  }

  async logoutUser() {
    try {
      await axios.post(
        `${this.usersBaseUrl}/logout`,
        {},
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async getCurrentUser() {
    try {
      return await axios.get(`${this.usersBaseUrl}/get-current-user`, {
        withCredentials: true,
      });
    } catch (error) {
      errorHandler.handleError(error);
    }
  }

  async sendOTP({ email }) {
    try {
      const response = await axios.post(`${this.usersBaseUrl}/send-otp`, {
        email,
      });

      return response.data;
    } catch (error) {
      errorHandler.handleError(error);
    }
  }

  async resetUserPassword(data) {
    try {
      const response = await axios.post(`${this.usersBaseUrl}/reset-password`, {
        data,
      });

      return response.data;
    } catch (error) {
      errorHandler.handleError(error);
    }
  }
}

const authService = new AuthService();

export default authService;
