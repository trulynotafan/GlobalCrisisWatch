import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

const UserProfile: React.FC = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        {user.picture && (
          <img 
            src={user.picture} 
            alt={user.name || 'User'} 
            className="w-8 h-8 rounded-full"
          />
        )}
        <span>{user.name}</span>
        <Link 
          href="/api/auth/logout"
          className="text-sm text-red-600 hover:text-red-800"
        >
          Logout
        </Link>
      </div>
    );
  }

  return (
    <Link 
      href="/api/auth/login"
      className="text-blue-600 hover:text-blue-800"
    >
      Login
    </Link>
  );
};

export default UserProfile; 