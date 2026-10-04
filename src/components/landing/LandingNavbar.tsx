import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

export const LandingNavbar: React.FC = () => {
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Left: VIDORA wordmark */}
      <div className="flex-1 flex items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded bg-[#111318] dark:bg-white flex items-center justify-center transition-transform group-hover:scale-105">
            <Play className="w-3.5 h-3.5 text-white dark:text-[#10131A] ml-0.5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-[#111318] dark:text-[#F5F7FA]">
            VIDORA
          </span>
        </Link>
      </div>

      {/* Center: Product Links */}
      <div className="hidden md:flex flex-1 items-center justify-center gap-8 text-sm font-medium text-[#667085] dark:text-[#A7AFBD]">
        <a href="#product" className="hover:text-[#111318] dark:hover:text-white transition-colors">Product</a>
        <a href="#how-it-works" className="hover:text-[#111318] dark:hover:text-white transition-colors">How it works</a>
        <a href="#insights" className="hover:text-[#111318] dark:hover:text-white transition-colors">Insights</a>
      </div>

      {/* Right: Sign in & Get started */}
      <div className="flex-1 flex items-center justify-end gap-6">
        <ThemeToggle />
        
        <Link 
          to="/login" 
          className="text-sm font-medium text-[#667085] hover:text-[#111318] dark:text-[#A7AFBD] dark:hover:text-white transition-colors"
        >
          Sign in
        </Link>
        <Link 
          to="/register" 
          className="hidden sm:inline-flex items-center justify-center h-9 px-4 rounded-full bg-[#111318] text-white dark:bg-white dark:text-[#111318] text-sm font-medium transition-transform hover:scale-105 active:scale-95"
        >
          Get started
        </Link>
      </div>
    </motion.nav>
  );
};
