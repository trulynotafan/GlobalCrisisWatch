import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Header = () => {
  const router = useRouter();
  const showBackButton = router.pathname !== '/';

  return (
    <header className="bg-dark-secondary py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={() => router.back()}
                className="md:hidden p-2 hover:bg-dark-accent rounded-lg transition"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
            )}
            <Link href="/" className="text-2xl font-bold">
              Global Crisis Watch
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/afaanbayes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-dark-muted hover:text-white transition"
            >
              by Afaan
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 