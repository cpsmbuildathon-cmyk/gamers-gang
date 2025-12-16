import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }> = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseStyle = "px-6 py-2 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)] border border-cyan-400",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white border border-slate-500",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-400"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-6 rounded-xl shadow-xl ${className}`}>
    {children}
  </div>
);

export const Loader: React.FC = () => (
  <div className="flex justify-center items-center space-x-2 animate-pulse text-cyan-400">
    <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
    <div className="w-3 h-3 bg-cyan-400 rounded-full delay-75"></div>
    <div className="w-3 h-3 bg-cyan-400 rounded-full delay-150"></div>
    <span>AI Thinking...</span>
  </div>
);

export const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="flex items-center text-slate-400 hover:text-white mb-4 transition-colors">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    Back to Arcade
  </button>
);
