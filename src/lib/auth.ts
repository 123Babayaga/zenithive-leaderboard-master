// import { jwtDecode } from "jwt-decode";
// import Cookies from "js-cookie";

// interface DecodedToken {
//   email: string;
//   role: string;
//   exp: number;
//   iat: number;
// }

// export const getUserRole = (): string | null => {
//   const token = Cookies.get("authToken");
//   if (!token) return null;

//   try {
//     const decoded = jwtDecode<DecodedToken>(token);
//     return decoded.role;
//   } catch (error) {
//     console.error("Token decode failed", error);
//     return null;
//   }
// };

// export const isAdmin = (): boolean => {
//   return getUserRole() === "Admin";
// };


// lib/auth.ts
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface DecodedToken {
  email: string;
  role: string;
  exp: number;
  iat: number;
}

export const getUserRole = (): string | null => {
  const token = Cookies.get("authToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    
    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      Cookies.remove("authToken");
      return null;
    }
    
    return decoded.role;
  } catch (error) {
    console.error("Token decode failed", error);
    Cookies.remove("authToken");
    return null;
  }
};

export const isAdmin = (): boolean => {
  return getUserRole() === "Admin";
};

export const getUserEmail = (): string | null => {
  const token = Cookies.get("authToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    
    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      Cookies.remove("authToken");
      return null;
    }
    
    return decoded.email;
  } catch (error) {
    console.error("Token decode failed", error);
    Cookies.remove("authToken");
    return null;
  }
};

export const isTokenValid = (): boolean => {
  const token = Cookies.get("authToken");
  if (!token) return false;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    console.error("Token decode failed", error);
    Cookies.remove("authToken");
    return false;
  }
};