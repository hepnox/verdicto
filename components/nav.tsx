import Link from 'next/link';
import { cn } from '@/lib/utils';

const Nav = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">Verdicto</span>
            </Link>
          </div>
          <div className="flex space-x-8">
            <Link 
              href="/crimes" 
              className={cn(
                "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              )}
            >
              Crimes
            </Link>
            <Link 
              href="/auth/login" 
              className={cn(
                "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              )}
            >
              Login
            </Link>
            <Link 
              href="/auth/register" 
              className={cn(
                "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
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