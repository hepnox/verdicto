import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";

const handleLogout = () => {
  console.log("Logout");
  // Implement logout logic
};

export const LogoutMenu = () => {
  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      size="sm"
      className="border-none w-full flex items-center gap-2 justify-start"
    >
      <LogOut className="size-4" />
      Log out
    </Button>
  );
};
