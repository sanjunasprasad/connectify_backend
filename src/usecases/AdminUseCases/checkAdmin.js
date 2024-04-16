import { generateAdminToken } from "../../middlewares/auth.js";

const adminCredential = {
  email: "admin@gmail.com",
  password: "admin",
};


export const checkLogin = async (email, password) => {
  try {
    if (
      adminCredential.email === email &&
      adminCredential.password === password
    ) {
      const adminToken = await generateAdminToken(email);
      const adminData = {
        email,
        password,
      };
      return { adminData, adminToken };
    } else {
      return { message: "email or password error" };
    }
  } catch (error) {
    // Handle any errors that occur during the login process
    console.error("An error occurred during login:", error);
    return { message: "An error occurred during login" };
  }
};

