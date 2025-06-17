// "use client";

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import Cookies from "js-cookie";

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   department: string;
//   totalPoints: number;
// }

// const UsersPage = () => {
//   const [form, setForm] = useState({ name: "", email: "", department: "" });
//   const [users, setUsers] = useState<User[]>([]);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [errors, setErrors] = useState({ name: "", email: "" });
//   const [isLoading, setIsLoading] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);

//   const fetchUsers = async () => {
//     try {
//       const token = Cookies.get("authToken");

//       const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setUsers(res.data);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       // Optional: handle auth errors like redirecting to login
//     }
//   };

//   useEffect(() => {
//     fetchUsers();

//     const userInfoString = localStorage.getItem("userInfo");
//     if (userInfoString) {
//       try {
//         const userInfo = JSON.parse(userInfoString);
//         if (userInfo.role === "Admin") {
//           setIsAdmin(true);
//         }
//       } catch (error) {
//         console.error("Error parsing userInfo from localStorage:", error);
//       }
//     }
//   }, []);

//   const validateEmail = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const validateForm = () => {
//     const newErrors = { name: "", email: "" };
//     let isValid = true;

//     // Name validation
//     if (!form.name.trim()) {
//       newErrors.name = "Name is required";
//       isValid = false;
//     } else if (form.name.trim().length < 2) {
//       newErrors.name = "Name must be at least 2 characters long";
//       isValid = false;
//     }

//     // Email validation
//     if (!form.email.trim()) {
//       newErrors.email = "Email is required";
//       isValid = false;
//     } else if (!validateEmail(form.email)) {
//       newErrors.email = "Please enter a valid email address";
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleCreate = async () => {
//     if (!validateForm()) return;

//     setIsLoading(true);

//     try {
//       const token = Cookies.get("authToken"); // Get token from cookie

//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/users/create`,
//         form,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setForm({ name: "", email: "", department: "" });
//       setErrors({ name: "", email: "" });
//       setShowCreateForm(false);
//       fetchUsers();
//     } catch (error) {
//       console.error("Error creating user:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setForm({ name: "", email: "", department: "" });
//     setErrors({ name: "", email: "" });
//     setShowCreateForm(false);
//   };

//   const clearError = (field: string) => {
//     setErrors({ ...errors, [field]: "" });
//   };

//   return (
//     <div className="max-w-3xl mx-auto space-y-6 p-6">
//       {isAdmin && !showCreateForm && (
//         <div className="flex justify-center">
//           <Button
//             onClick={() => setShowCreateForm(true)}
//             className="px-6 py-2 text-lg"
//             size="lg"
//           >
//             Create New User
//           </Button>
//         </div>
//       )}

//       {isAdmin && showCreateForm && (
//         <div className="animate-in slide-in-from-top-4 duration-300">
//           <Card className="shadow-lg border-2">
//             <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
//               <CardTitle className="text-xl text-center text-gray-800">
//                 Create New User
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4 p-6">
//               <div>
//                 <Label
//                   htmlFor="name"
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   Name <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="name"
//                   placeholder="Enter full name"
//                   value={form.name}
//                   onChange={(e) => {
//                     setForm({ ...form, name: e.target.value });
//                     if (errors.name) clearError("name");
//                   }}
//                   className={`mt-1 ${
//                     errors.name ? "border-red-500 focus:border-red-500" : ""
//                   }`}
//                 />
//                 {errors.name && (
//                   <p className="text-red-500 text-sm mt-1">{errors.name}</p>
//                 )}
//               </div>

//               <div>
//                 <Label
//                   htmlFor="email"
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   Email <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="Enter email address"
//                   value={form.email}
//                   onChange={(e) => {
//                     setForm({ ...form, email: e.target.value });
//                     if (errors.email) clearError("email");
//                   }}
//                   className={`mt-1 ${
//                     errors.email ? "border-red-500 focus:border-red-500" : ""
//                   }`}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//                 )}
//               </div>

//               <div>
//                 <Label
//                   htmlFor="department"
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   Department
//                 </Label>
//                 <Input
//                   id="department"
//                   placeholder="Enter department (optional)"
//                   value={form.department}
//                   onChange={(e) =>
//                     setForm({ ...form, department: e.target.value })
//                   }
//                   className="mt-1"
//                 />
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <Button
//                   onClick={handleCreate}
//                   disabled={isLoading}
//                   className="flex-1"
//                 >
//                   {isLoading ? "Creating..." : "Create User"}
//                 </Button>
//                 <Button
//                   variant="outline"
//                   onClick={handleCancel}
//                   disabled={isLoading}
//                   className="flex-1"
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {users.map((user) => (
//           <Card key={user._id}>
//             <CardHeader>
//               <CardTitle>{user.name}</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-1">
//               <p>
//                 <strong>Email:</strong> {user.email}
//               </p>
//               <p>
//                 <strong>Department:</strong> {user.department}
//               </p>
//               <p>
//                 <strong>Total Points:</strong> {user.totalPoints}
//               </p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UsersPage;


"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { fetchUsers, createUser, clearCreateError } from "@/store/slices/usersSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks/redux";

interface CreateUserForm {
  name: string;
  email: string;
  department: string;
  role: string;
}

interface FormErrors {
  name: string;
  email: string;
   role: string;
}

const UsersPage = () => {
  const dispatch = useAppDispatch();
  const { users, isLoading, error, createLoading, createError } = useAppSelector((state) => state.users);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState<CreateUserForm>({
    name: "",
    email: "",
    department: "",
    role: ""
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({ name: "", email: "",role:"" });
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [userCreated, setUserCreated] = useState(false); // Track if user was actually created

  const isAdmin = currentUser?.role === "Admin";

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Handle successful user creation - only show success when user was actually created
  useEffect(() => {
    if (userCreated && !createLoading && !createError) {
      setSuccessMessage("User created successfully!");
      setShowCreateForm(false);
      setUserCreated(false); // Reset the flag
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  }, [createLoading, createError, userCreated]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = { name: "", email: "" ,role:""};
    let isValid = true;

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
      isValid = false;
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!form.role.trim()) {
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    const result = await dispatch(createUser(form));

    if (createUser.fulfilled.match(result)) {
      setForm({ name: "", email: "", department: "", role: "" });
      setErrors({ name: "", email: "",role:"" });
      setUserCreated(true); // Set flag to indicate user was created
    }
  };

  const handleCancel = () => {
    setForm({ name: "", email: "", department: "", role: "" });
    setErrors({ name: "", email: "",role:""});
    setShowCreateForm(false);
    if (createError) {
      dispatch(clearCreateError());
    }
  };

  const clearError = (field: string) => {
    setErrors({ ...errors, [field]: "" });
  };

  const handleInputChange = (field: keyof CreateUserForm, value: string) => {
    setForm({ ...form, [field]: value });
    if (field !== 'department' && errors[field as keyof FormErrors]) {
      clearError(field);
    }
    if (createError) {
      dispatch(clearCreateError());
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleCreateNewUser = () => {
    setShowCreateForm(true);
    setSuccessMessage(""); // Clear any existing success message
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      {/* Success Message */}
      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {isAdmin && !showCreateForm && (
        <div className="flex justify-center">
          <Button
            onClick={handleCreateNewUser}
            className="px-6 py-2 text-lg"
            size="lg"
          >
            Create New User
          </Button>
        </div>
      )}

      {isAdmin && showCreateForm && (
        <div className="animate-in slide-in-from-top-4 duration-300">
          <Card className="shadow-lg border-2">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-xl text-center text-gray-800">
                Create New User
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {/* Create Error Message */}
              {createError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {createError}
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`mt-1 ${errors.name ? "border-red-500 focus:border-red-500" : ""
                    }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`mt-1 ${errors.email ? "border-red-500 focus:border-red-500" : ""
                    }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="role"
                  className="text-sm font-medium text-gray-700"
                >
                  Role <span className="text-red-500">*</span>
                </Label>
                <select
                  id="role"
                  value={form.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="employee">Employee</option>
                </select>

                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">Role is required</p>
                )}
              </div>


              <div>
                <Label
                  htmlFor="department"
                  className="text-sm font-medium text-gray-700"
                >
                  Department
                </Label>
                <Input
                  id="department"
                  placeholder="Enter department (optional)"
                  value={form.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCreate}
                  disabled={createLoading}
                  className="flex-1"
                >
                  {createLoading ? "Creating..." : "Create User"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={createLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Grid */}
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading users...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((user) => (
            <Card key={user._id}>
              <CardHeader>
                <CardTitle>{user.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Department:</strong> {user.department}
                </p>
                <p>
                  <strong>Total Points:</strong> {user.totalPoints}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersPage;