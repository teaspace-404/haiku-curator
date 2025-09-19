
import React, { useState, useEffect, useRef } from 'react';
import type { Conversation } from '../types';
import HistoryIcon from './HistoryIcon';

interface HistoryDropdownProps {
  history: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

const HistoryDropdown: React.FC<HistoryDropdownProps> = ({ history, currentConversationId, onSelectConversation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (id: string) => {
    onSelectConversation(id);
    setIsOpen(false);
  };

  const currentTitle = history.find(c => c.id === currentConversationId)?.title || 'Conversation History';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center md:gap-2 text-sky-800 dark:text-slate-300 md:hover:text-sky-950 md:dark:hover:text-white transition-colors p-2 md:p-0 rounded-full md:rounded-none hover:bg-slate-200 dark:hover:bg-slate-700 md:hover:bg-transparent dark:md:hover:bg-transparent"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <HistoryIcon className="w-5 h-5" />
        <span className="hidden md:inline truncate max-w-xs text-left">{currentTitle}</span>
        <svg className={`hidden md:inline-block w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-20 animate-fade-in">
          <div className="p-1 max-h-80 overflow-y-auto">
            {history.slice().reverse().map((conv) => (
              <a
                href="#"
                key={conv.id}
                onClick={(e) => { e.preventDefault(); handleSelect(conv.id); }}
                className={`block px-3 py-2 text-sm rounded-md truncate ${
                  conv.id === currentConversationId
                    ? 'bg-sky-500 text-white'
                    : 'text-sky-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-sky-950 dark:hover:text-white'
                }`}
              >
                {conv.title}
              </a>
            ))}
             {history.length === 0 && (
                <p className="px-3 py-2 text-sm text-sky-700 dark:text-slate-500">No history yet.</p>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryDropdown;
