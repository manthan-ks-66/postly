import axios from "axios";

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
        formData
      );

      if (response?.data) {
        return await this.loginUser({
          username: formData.get("username"),
          password: formData.get("password"),
        });
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      throw new Error("Error :: registerUser\n", error);
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
        }
      );

      return response;
    } catch (error) {
      throw new Error("Error :: loginUser", error);
    }
  }

  async logoutUser() {
    try {
      await axios.post(
        `${this.usersBaseUrl}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      throw new Error("Error ::  logoutUser", error);
    }
  }

  async getCurrentUser() {
    try {
      return await axios.get(`${this.usersBaseUrl}/get-current-user`, {
        withCredentials: true,
      });
    } catch (error) {
      throw new Error("Failed to fetch user details");
    }
  }
}

const authService = new AuthService();

export default authService;
