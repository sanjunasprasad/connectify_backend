import { generateAdminToken } from "../../middlewares/auth.js";

const adminCredential = {
  email: "admin@gmail.com",
  password: "admin",
};

export const checkLogin = async(email, password) => {
  if (
    adminCredential.email === email &&
    adminCredential.password === password
  ) {
    const adminToken = await generateAdminToken(email)
    const adminData = {
      email,
      password,
      
    };
    return { adminData ,adminToken};
  } else {
    return { message: "email or password error" };
  }
};
