"use client"

import React, { JSX, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';

interface FormData {
  currentPassword: string;
  newPassword: string;
}

interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
}

export default function ChangePasswordPage(): JSX.Element {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    currentPassword: 'zenithive123',
    newPassword: ''
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    // Clear message when user types
    if (message) {
      setMessage(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (formData.currentPassword !== 'zenithive123') {
      newErrors.currentPassword = 'Current password must be zenithive123';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters long';
    } else if (formData.newPassword === 'zenithive123') {
      newErrors.newPassword = 'New password cannot be the same as the default password';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) {
    return;
  }

  setIsSubmitting(true);
  setMessage(null);

  try {
    const token = Cookies.get('authToken');
    if (!token) {
      setMessage({
        type: 'error',
        message: 'Authentication token not found. Please login again.'
      });
      router.push('/signin');
      return;
    }

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/users/change-password`,
      {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    setMessage({
      type: 'success',
      message: 'Password changed successfully! Redirecting to leaderboard...'
    });

    setTimeout(() => {
      router.push('/leaderboard');
    }, 2000);

    console.log('Password change successful:', response.data);
  } catch (error: unknown) {
    setMessage({
      type: 'error',
      message: 'Failed to change password'
    });
    console.error('Password change error:', error);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-orange-600" />
            Change Password
          </CardTitle>
          <CardDescription className="text-center">
            You must change your default password to continue
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Current Password Field (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="currentPassword"
                type="password"
                value={formData.currentPassword}
                readOnly
                className="pl-10 bg-gray-50 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-500">This is your default password and cannot be changed</p>
            {errors.currentPassword && (
              <p className="text-sm text-red-500">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password Field */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                value={formData.newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => handleInputChange('newPassword', e.target.value)}
                className={`pl-10 pr-10 ${errors.newPassword ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={(): void => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500">{errors.newPassword}</p>
            )}
            <p className="text-xs text-gray-500">
              Password must be at least 6 characters and cannot be &quot;zenithive123&quot;
            </p>
          </div>

          {/* Message */}
          {message && (
            <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                {message.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-orange-600 hover:bg-orange-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Changing Password...' : 'Change Password'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => router.push('/signin')}
            className="w-full"
          >
            Back to Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}