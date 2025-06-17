// "use client";

// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Home, Users, Trophy, LogOut } from "lucide-react";
// import Cookies from "js-cookie";
// import { useEffect, useState } from "react";
// import { isAdmin } from "@/lib/auth";

// interface NavItem {
//   name: string;
//   icon: React.ReactNode;
//   path: string;
// }

// export default function Sidebar() {
//   const router = useRouter();
//   const [admin, setAdmin] = useState<boolean>(false);

//   useEffect(() => {
//     setAdmin(isAdmin());
//   }, []);

//   const navItems: NavItem[] = [
//     { name: "Leaderboard", icon: <Trophy size={18} />, path: "/leaderboard" },
//     { name: "Users", icon: <Users size={18} />, path: "/users" },
//     ...(admin
//       ? [
//           { name: "Points", icon: <Home size={18} />, path: "/points" },
//           { name: "Resources", icon: <Home size={18} />, path: "/resources" },
//           { name: "Projects", icon: <Home size={18} />, path: "/projects" },
//           {
//             name: "Project-management",
//             icon: <Home size={18} />,
//             path: "/project-management",
//           },
//         ]
//       : []),
//   ];

//   const handleLogout = () => {
//     Cookies.remove("authToken");
//     localStorage.clear();
//     router.push("/");
//   };

//   return (
//     <aside className="w-64 h-screen bg-white shadow-md border-r p-4 flex flex-col justify-between">
//       <div>
//         <h2 className="text-xl font-bold mb-6">Sidebar</h2>
//         {navItems.map((item) => (
//           <Button
//             key={item.name}
//             variant="ghost"
//             className="w-full justify-start text-left mb-2"
//             onClick={() => router.push(item.path)}
//           >
//             <span className="mr-2">{item.icon}</span>
//             {item.name}
//           </Button>
//         ))}
//       </div>
//       <Button
//         variant="ghost"
//         className="w-full justify-start text-left text-red-600"
//         onClick={handleLogout}
//       >
//         <span className="mr-2">
//           <LogOut size={18} />
//         </span>
//         Logout
//       </Button>
//     </aside>
//   );
// }



"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, Users, Trophy, LogOut } from "lucide-react";
import { useEffect } from "react";
import { logout, loadUserFromToken } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks/redux";

interface NavItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

export default function Sidebar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const isAdmin = user?.role === "Admin";

  useEffect(() => {
    // Load user from token on component mount
    if (!isAuthenticated) {
      dispatch(loadUserFromToken());
    }
  }, [dispatch, isAuthenticated]);

  const navItems: NavItem[] = [
    { name: "Leaderboard", icon: <Trophy size={18} />, path: "/leaderboard" },
    { name: "Users", icon: <Users size={18} />, path: "/users" },
    ...(isAdmin
      ? [
          { name: "Points", icon: <Home size={18} />, path: "/points" },
          { name: "Resources", icon: <Home size={18} />, path: "/resources" },
          { name: "Projects", icon: <Home size={18} />, path: "/projects" },
          {
            name: "Project-management",
            icon: <Home size={18} />,
            path: "/project-management",
          },
        ]
      : []),
  ];

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <aside className="w-64 h-screen bg-white shadow-md border-r p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">Sidebar</h2>
        {navItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            className="w-full justify-start text-left mb-2"
            onClick={() => router.push(item.path)}
          >
            <span className="mr-2">{item.icon}</span>
            {item.name}
          </Button>
        ))}
      </div>
      <Button
        variant="ghost"
        className="w-full justify-start text-left text-red-600"
        onClick={handleLogout}
      >
        <span className="mr-2">
          <LogOut size={18} />
        </span>
        Logout
      </Button>
    </aside>
  );
}