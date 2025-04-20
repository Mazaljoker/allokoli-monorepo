import { User } from "../types";

export const getUserFromToken = async (token: string): Promise<User> => {
  // Logic to decode the token and retrieve user information
  // This is a placeholder implementation
  const user: User = {
    id: "user-id",
    email: "user@example.com",
    name: "User Name",
    role: "user", // or 'admin'
  };
  return user;
};

export const isAdmin = (user: User): boolean => {
  return user.role === "admin";
};
