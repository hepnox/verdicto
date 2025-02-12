import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Nav = () => {
  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Verdicto" width={32} height={32} />
              <span className="text-2xl font-bold ml-2">Verdicto</span>
            </Link>
          </div>
          <div className="flex space-x-8">
            <Link
              href="/crimes"
              className={cn(
                "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900",
              )}
            >
              Crimes
            </Link>
            <Link
              href="/auth/login"
              className={cn(
                "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900",
              )}
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className={cn(
                "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900",
              )}
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
