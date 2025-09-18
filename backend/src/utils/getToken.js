import jwt from "jsonwebtoken";
export const getUserToken = async (userId, res) => {
  // Create JWT token
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  // Set token in HTTP-only cookie
  res.cookie("userToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};

export const getCompanyToken = async (companyId, res) => {
  const token = jwt.sign({ id: companyId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("companyToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};
