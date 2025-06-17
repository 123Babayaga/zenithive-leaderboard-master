"use client";

import { CostSummary, User, UserFormData } from "@/types/user";
import { useState } from "react";
import axios, { AxiosResponse } from "axios";

export const useResourceAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/users`;

  const getAuthToken = () => {
    const name = "authToken=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(";");

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name)) {
        return cookie.substring(name.length);
      }
    }
    return "";
  };

  // Create axios instance with default config
  const createAxiosConfig = () => {
    const token = getAuthToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  const fetchUsers = async (): Promise<User[]> => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<User[]> = await axios.get(
        API_BASE,
        createAxiosConfig()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCostSummary = async (): Promise<{
    users: User[];
    summary: CostSummary;
  }> => {
    try {
      const response: AxiosResponse<{ users: User[]; summary: CostSummary }> =
        await axios.get(`${API_BASE}/cost-summary`, createAxiosConfig());
      return response.data;
    } catch (error) {
      console.error("Error fetching cost summary:", error);
      throw error;
    }
  };

  const createUser = async (userData: Partial<UserFormData>): Promise<void> => {
    try {
      setIsLoading(true);
      await axios.post(`${API_BASE}/create`, userData, createAxiosConfig());
    } catch (error) {
      console.error("Error creating user:", error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (
    userId: string,
    userData: Partial<User>
  ): Promise<void> => {
    try {
      setIsLoading(true);
      await axios.put(`${API_BASE}/${userId}`, userData, createAxiosConfig());
    } catch (error) {
      console.error("Error updating user:", error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: string): Promise<void> => {
    try {
      setIsLoading(true);
      const config = createAxiosConfig();
      await axios.delete(`${API_BASE}/${userId}`, config);
    } catch (error) {
      console.error("Error deleting user:", error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    fetchUsers,
    fetchCostSummary,
    createUser,
    updateUser,
    deleteUser,
  };
};
