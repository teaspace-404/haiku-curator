
import React from 'react';

interface IconProps {
  className?: string;
}

const MuseumIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M22 18v-2H2V18" />
      <path d="M20 16V7.5L12 3 4 7.5V16" />
      <path d="M2 16h20" />
      <path d="M10 16v-5h4v5" />
      <path d="M6 16v-5h2v5" />
      <path d="M16 16v-5h2v5" />
    </svg>
  );
};

export default MuseumIcon;
