"use client";

import { Layout, LogOut, LucideLogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { logout } from "./action";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export const LogoutMenu = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenuItem
      disabled={isLoading}
      onClick={(e) => {
        e.stopPropagation();
        handleLogout();
      }}
    >
      <LucideLogOut />
      {isLoading ? "Logging out..." : "Log out"}
    </DropdownMenuItem>
  );
};
