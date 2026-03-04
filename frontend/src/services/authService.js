import axios from "axios";
import handleError from "./errorHandler.js";

class AuthService {
  constructor() {
    this.usersBaseUrl = import.meta.env.VITE_USERS_API_BASE_URL;

    if (!this.usersBaseUrl) {
      throw new Error("VITE_API_BASE_URL env variable is not set");
    }
  }

  async getUser(userId) {
    try {
      const res = await axios.get(
        `${this.usersBaseUrl}/get-user-email/${userId}`,
      );

      return res.data?.data;
    } catch (error) {
      handleError(error);
    }
  }

  async registerUser(userData) {
    try {
      const res = await axios.post(`${this.usersBaseUrl}/register`, userData);

      return res;
    } catch (error) {
      handleError(error);
    }
  }

  async regenerateRegistrationOTP(email) {
    try {
      const res = await axios.post(
        `${this.usersBaseUrl}/regenerate-registration-otp`,
        {
          email: email,
        },
      );

      return res;
    } catch (error) {
      handleError(error);
    }
  }

  async verifyAndLoginUser({ email, otp }) {
    try {
      const res = await axios.post(`${this.usersBaseUrl}/verify-user`, {
        email: email,
        otp: otp.toString(),
      });

      if (res.status === 200) {
        return await this.emailLogin({ email });
      }
    } catch (error) {
      handleError(error);
    }
  }

  // usage: only on otp verifications
  async emailLogin({ email }) {
    try {
      const res = await axios.post(
        `${this.usersBaseUrl}/email-login`,
        {
          email,
        },
        {
          withCredentials: true,
        },
      );

      return res.data?.data?.user;
    } catch (error) {
      handleError(error);
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
      handleError(error);
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
      handleError(error);
    }
  }

  async getCurrentUser() {
    try {
      return await axios.get(`${this.usersBaseUrl}/get-current-user`, {
        withCredentials: true,
      });
    } catch (error) {
      handleError(error);
    }
  }

  async sendOTP({ email }) {
    try {
      const response = await axios.post(
        `${this.usersBaseUrl}/send-reset-password-otp`,
        {
          email,
        },
      );

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  async resetUserPassword(data) {
    try {
      const response = await axios.post(`${this.usersBaseUrl}/reset-password`, {
        data,
      });

      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
}

const authService = new AuthService();

export default authService;
