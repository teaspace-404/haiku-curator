import React from 'react';
import MuseumIcon from './MuseumIcon';

interface ArtworkDiscoveryButtonProps {
  onClick: () => void;
  disabled: boolean;
  isSecondary?: boolean;
}

const ArtworkDiscoveryButton: React.FC<ArtworkDiscoveryButtonProps> = ({ onClick, disabled, isSecondary = false }) => {
  const primaryClasses = "w-full flex-grow px-4 py-3 bg-teal-500 text-slate-900 font-bold rounded-lg shadow-md transition-all duration-300 hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed";
  const secondaryClasses = "px-3 py-3 bg-slate-200 dark:bg-slate-700 text-teal-600 dark:text-teal-200 rounded-lg shadow-md transition-all duration-300 hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed";

  return (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-3 ${isSecondary ? secondaryClasses : primaryClasses}`}
        aria-label={isSecondary ? "Discover New Artwork" : undefined}
    >
        <MuseumIcon className="w-6 h-6" />
        {!isSecondary && <span>Discover New Artwork</span>}
    </button>
  );
};

export default ArtworkDiscoveryButton;