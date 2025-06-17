"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Cookies from 'js-cookie';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  department: string;
  totalPoints: number;
}

interface AspectOption {
  id: string;
  description: string;
}

const PointsPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedAspect, setSelectedAspect] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [customPoints, setCustomPoints] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const functionalAspects: AspectOption[] = [
    { id: "on-time", description: "A task completed on-time" },
    { id: "before-time", description: "A task completed before the time" },
    { id: "slight-delay", description: "A task completed with slight delay" },
    { id: "significant-delay", description: "A task completed with significant delay" },
    { id: "extreme-delay", description: "A task completed with extreme delay" },
    { id: "exceptional-quality", description: "Task completed with exceptional quality and on or before time" },
    { id: "poor-quality", description: "A task completed with poor quality" },
    { id: "poor-quality-completed", description: "The poor quality task completed" },
    { id: "learning-goals", description: "Learning & development goals are met" }
  ];

  const behavioralAspects: AspectOption[] = [
    { id: "follows-policy", description: "Consistently follows the leaves policy" },
    { id: "excellent-behavior", description: "Excellent behaviour with Peers, good communication amongst group, active part on all the cultural events" },
    { id: "minor-friction", description: "Minor friction in leaves" },
    { id: "not-adhering", description: "Regular pattern of not adhering to leaves policy" }
  ];

  // Create axios instance with default config
  const createAxiosConfig = () => {
    const token = Cookies.get('authToken');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>(`${process.env.NEXT_PUBLIC_API_URL}/users`, createAxiosConfig());
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getCurrentAspectOptions = (): AspectOption[] => {
    if (selectedAspect === "functional") return functionalAspects;
    if (selectedAspect === "behavioral") return behavioralAspects;
    return [];
  };

  const getSelectedOptionDetails = (): AspectOption | null => {
    const options = getCurrentAspectOptions();
    return options.find(option => option.id === selectedOption) || null;
  };

  const handleAddPoints = async () => {
    if (!selectedUser || !selectedAspect || !selectedOption || !customPoints) return;
    
    const optionDetails = getSelectedOptionDetails();
    if (!optionDetails) return;

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/points/add`, {
        userId: selectedUser._id,
        points: Number(customPoints),
        reason: optionDetails.description,
        aspect: selectedAspect
      }, createAxiosConfig());
      
      // Reset form and close dialog
      setSelectedAspect("");
      setSelectedOption("");
      setCustomPoints("");
      setSelectedUser(null);
      setIsDialogOpen(false);
      
      // Refresh users data
      fetchUsers();
    } catch (error) {
      console.error("Error adding points:", error);
      if (axios.isAxiosError(error)) {
        // Handle specific axios errors
        console.error("Axios error details:", error.response?.data || error.message);
      }
    }
  };

  const handleDialogClose = () => {
    setSelectedAspect("");
    setSelectedOption("");
    setCustomPoints("");
    setIsDialogOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Points Management System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                  <p className="text-sm text-gray-600">{user.department}</p>
                  <p className="text-lg font-semibold text-blue-600 mt-2">
                    Total Points: {user.totalPoints}
                  </p>
                </div>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsDialogOpen(true);
                    }}
                  >
                    Add Points
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      Add Points for {selectedUser?.name}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Aspect Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Select Aspect Type</Label>
                      <Select value={selectedAspect} onValueChange={setSelectedAspect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose aspect type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="functional">Functional Aspects</SelectItem>
                          <SelectItem value="behavioral">Behavioral Aspects</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Option Selection */}
                    {selectedAspect && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Select Specific Criteria</Label>
                        <Select value={selectedOption} onValueChange={setSelectedOption}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose criteria" />
                          </SelectTrigger>
                          <SelectContent>
                            {getCurrentAspectOptions().map((option) => (
                              <SelectItem key={option.id} value={option.id}>
                                <span className="text-sm">{option.description}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Custom Points Input */}
                    {selectedOption && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Enter Points</Label>
                        <Input
                          type="number"
                          placeholder="Enter points (can be positive or negative)"
                          value={customPoints}
                          onChange={(e) => setCustomPoints(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Preview */}
                    {selectedOption && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">Preview:</h4>
                        <p className="text-sm text-gray-700">{getSelectedOptionDetails()?.description}</p>
                        {customPoints && (
                          <p className={`text-lg font-semibold mt-2 ${Number(customPoints) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            Points: {Number(customPoints) >= 0 ? '+' : ''}{customPoints}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={handleDialogClose}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddPoints}
                        disabled={!selectedAspect || !selectedOption || !customPoints}
                        className="flex-1"
                      >
                        Add Points
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PointsPage;