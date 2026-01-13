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
      } 
    } catch (error) {
      const serverMsg = error?.response?.data?.message;
      if (serverMsg) {
        throw new Error(serverMsg);
      } else {
        throw new Error("Something went wrong! try again later");
      }
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

      return response?.data?.data?.user;
    } catch (error) {
      const serverMsg = error?.response?.data?.message;
      if (serverMsg) {
        throw new Error(serverMsg);
      } else {
        throw new Error("Something went wrong! Please try again later");
      }
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
      throw new Error("Error while logging out user");
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

  async sendOTP({ email }) {
    try {
      const response = await axios.post(`${this.usersBaseUrl}/send-otp`, {
        email,
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async resetUserPassword(data) {
    try {
      const response = await axios.post(`${this.usersBaseUrl}/reset-password`, {
        data,
      });

      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

const authService = new AuthService();

export default authService;
