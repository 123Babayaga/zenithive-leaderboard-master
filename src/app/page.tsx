// "use client"

// import React, { JSX, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';
// import axios from 'axios';


// interface FormData {
//   name: string;
//   email: string;
//   role: string;
//   password: string;
// }

// interface FormErrors {
//   name?: string;
//   email?: string;
//   role?: string;
//   password?: string;
// }

// export default function SignInPage(): JSX.Element {
//   const router = useRouter();
//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     email: '',
//     role: '',
//     password: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [authMessage, setAuthMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

//   const handleInputChange = (field: keyof FormData, value: string): void => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: ''
//       }));
//     }
//     // Clear auth message when user types
//     if (authMessage) {
//       setAuthMessage(null);
//     }
//   };

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};
    
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }
    
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (): Promise<void> => {
//   if (!validateForm()) {
//     return;
//   }

//   setIsSubmitting(true);
//   setAuthMessage(null);

//   try {
//     const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/auth`, {
//       email: formData.email,
//       password: formData.password
//     });

//     const data = response.data;

//     Cookies.set('authToken', data.token, { expires: 7, secure: true, sameSite: 'strict' });
//     localStorage.setItem('userInfo', JSON.stringify(data.user));

//     if (formData.password === 'zenithive123') {
//       router.push('/change-password');
//       setAuthMessage({
//         type: 'success',
//         message: 'Please change your default password to continue'
//       });
//     } else {
//       router.push('/leaderboard');
//       setAuthMessage({
//         type: 'success',
//         message: `Welcome back, ${data.user.name}! Role: ${data.user.role}`
//       });
//     }

//     setFormData({ name: '', email: '', role: '', password: '' });

//   } catch (error: unknown) {
//     let errorMessage = 'Authentication failed';
//     if (error && typeof error === 'object' && 'response' in error) {
//       const err = error as { response?: { data?: { error?: string } } };
//       errorMessage = err.response?.data?.error || errorMessage;
//     }
//     setAuthMessage({
//       type: 'error',
//       message: errorMessage
//     });
//     console.error('Auth error:', error);
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <Card className="w-full max-w-md shadow-xl">
//         <CardHeader className="space-y-1">
//           <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
//           <CardDescription className="text-center">
//             Enter your email and password to access your account
//           </CardDescription>
//         </CardHeader>
        
//         <CardContent className="space-y-4">
//           {/* Email Field */}
//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>): void => handleInputChange('email', e.target.value)}
//                 className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
//               />
//             </div>
//             {errors.email && (
//               <p className="text-sm text-red-500">{errors.email}</p>
//             )}
//           </div>

//           {/* Password Field */}
//           <div className="space-y-2">
//             <Label htmlFor="password">Password</Label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//               <Input
//                 id="password"
//                 type={showPassword ? 'text' : 'password'}
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>): void => handleInputChange('password', e.target.value)}
//                 className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
//               />
//               <button
//                 type="button"
//                 onClick={(): void => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
//               >
//                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//               </button>
//             </div>
//             {errors.password && (
//               <p className="text-sm text-red-500">{errors.password}</p>
//             )}
//           </div>

//           {/* Auth Message */}
//           {authMessage && (
//             <Alert className={authMessage.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
//               <AlertDescription className={authMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}>
//                 {authMessage.message}
//               </AlertDescription>
//             </Alert>
//           )}
//         </CardContent>

//         <CardFooter className="flex flex-col space-y-4">
//           <Button 
//             onClick={handleSubmit} 
//             className="w-full"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? 'Signing In...' : 'Sign In'}
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }


"use client"

import React, { JSX, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { loginUser, clearError } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function SignInPage(): JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Handle successful authentication
  useEffect(() => {
    if (isAuthenticated && user) {
        console.log('User successfully logged in:', user); 
      if (formData.password === 'zenithive123') {
        setSuccessMessage('Please change your default password to continue');
        router.push('/change-password');
      } else {
        setSuccessMessage(`Welcome back, ${user.name}! Role: ${user.role}`);
        router.push('/leaderboard');
      }
      // Reset form
      setFormData({ email: '', password: '' });
    }
  }, [isAuthenticated, user, router, formData.password]);

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    // Clear auth error when user types
    if (error) {
      dispatch(clearError());
    }
    
    // Clear success message
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    dispatch(clearError());
    dispatch(loginUser({
      email: formData.email,
      password: formData.password
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => handleInputChange('email', e.target.value)}
                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => handleInputChange('password', e.target.value)}
                className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={(): void => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {successMessage && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}