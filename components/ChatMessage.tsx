import React, { useState } from 'react';
import type { Message } from '../types';
import InfoIcon from './InfoIcon';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [showDetails, setShowDetails] = useState(false);
  const isUser = message.author === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] flex flex-col gap-2 animate-fade-in">
          {/* Handles artwork submission */}
          {message.image && (
            <div className="bg-slate-100 dark:bg-slate-700 rounded-lg shadow-lg overflow-hidden">
              <img 
                src={message.image} 
                alt="Artwork from museum" 
                className="w-full h-auto"
              />
              <div className="p-3 flex justify-between items-start gap-2">
                {message.text && (
                  <p className="text-sm text-sky-800 dark:text-slate-300 italic flex-grow pr-2">{message.text}</p>
                )}
                {message.artworkDetails && (
                  <button 
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex-shrink-0 text-slate-500 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-300 transition-colors duration-200"
                    aria-label="Show artwork details"
                  >
                    <InfoIcon className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Collapsible Details Section */}
              <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${showDetails ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                {message.artworkDetails && (
                  <div className="px-3 pb-3 border-t border-slate-200 dark:border-slate-600/50">
                    <ul className="text-xs text-sky-700 dark:text-slate-400 mt-2 space-y-1">
                      <li><strong>ID:</strong> {message.artworkDetails.systemNumber}</li>
                      <li><strong>Artist:</strong> {message.artworkDetails.artist}</li>
                      <li><strong>Date:</strong> {message.artworkDetails.date}</li>
                      <li><strong>Place:</strong> {message.artworkDetails.place}</li>
                      <li><strong>Type:</strong> {message.artworkDetails.objectType}</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Handles user's text reflection */}
          {!message.image && message.text && (
             <div className="bg-sky-500 rounded-lg py-2 px-3 shadow-lg">
              <p className="text-white whitespace-pre-wrap">{message.text}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // AI message
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] flex flex-col gap-2 animate-fade-in">
        {message.text && (
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 shadow-lg">
            <p className="font-serif text-lg leading-relaxed text-sky-900 dark:text-teal-100 whitespace-pre-line">{message.text}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;