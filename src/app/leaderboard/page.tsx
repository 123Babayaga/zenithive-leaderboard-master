"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Crown, Star } from "lucide-react";
import Cookies from 'js-cookie';
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  department: string;
  totalPoints: number;
}

const LeaderboardPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

const fetchUsers = async () => {
  try {
    setLoading(true);
    
    const token = Cookies.get('authToken');

    const response = await axios.get<User[]>(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Sort users by totalPoints in descending order
    const sortedUsers = response.data.sort((a: User, b: User) => b.totalPoints - a.totalPoints);
    setUsers(sortedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-8 h-8 text-yellow-500" />;
      case 2:
        return <Trophy className="w-7 h-7 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Award className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRankBadge = (position: number) => {
    switch (position) {
      case 1:
        return (
          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold text-lg px-4 py-2">
            🥇 1st Place
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-gradient-to-r from-gray-300 to-gray-500 text-white font-bold text-lg px-4 py-2">
            🥈 2nd Place
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white font-bold text-lg px-4 py-2">
            🥉 3rd Place
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="font-semibold text-sm px-3 py-1">
            #{position}
          </Badge>
        );
    }
  };

  const getCardStyling = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-2xl transform scale-105 hover:scale-110 transition-all duration-300";
      case 2:
        return "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300 shadow-xl transform scale-102 hover:scale-105 transition-all duration-300";
      case 3:
        return "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300 shadow-lg transform scale-101 hover:scale-103 transition-all duration-300";
      default:
        return "bg-white border-gray-200 hover:shadow-lg transition-all duration-300";
    }
  };

  const getPointsColor = (position: number) => {
    switch (position) {
      case 1:
        return "text-yellow-700 font-bold text-3xl";
      case 2:
        return "text-gray-600 font-bold text-2xl";
      case 3:
        return "text-amber-600 font-bold text-xl";
      default:
        return "text-blue-600 font-semibold text-lg";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center items-center gap-3 mb-4">
          <Trophy className="w-10 h-10 text-yellow-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Points Leaderboard
          </h1>
          <Trophy className="w-10 h-10 text-yellow-500" />
        </div>
        <p className="text-gray-600 text-lg">Celebrating our top performers</p>
        <div className="flex justify-center mt-4">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>
      </div>

      

      {/* Full Leaderboard */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Complete Rankings</h2>
        
        {users.map((user, index) => {
          const position = index + 1;
          return (
            <Card
              key={user._id}
              className={`${getCardStyling(position)} border-2`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      {getRankIcon(position)}
                      <div className="text-center">
                        {getRankBadge(position)}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`font-bold ${position <= 3 ? 'text-xl' : 'text-lg'}`}>
                        {user.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{user.email}</p>
                      <p className="text-gray-600 text-sm font-medium">{user.department}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={getPointsColor(position)}>
                      {user.totalPoints}
                    </div>
                    <p className="text-gray-500 text-sm">points</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center mt-16 p-8">
        <div className="flex justify-center gap-2 mb-4">
          {[...Array(3)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
          ))}
        </div>
        <p className="text-gray-600">Keep up the great work, everyone! 🎉</p>
      </div>
    </div>
  );
};

export default LeaderboardPage;