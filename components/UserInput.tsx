import React, { useState, useRef } from 'react';
import SendIcon from './SendIcon';

interface UserInputProps {
  onSubmit: (text: string) => void;
  disabled: boolean;
}

const UserInput: React.FC<UserInputProps> = ({ onSubmit, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
      // Reset textarea height after submission
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-grow flex items-start gap-2">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Share your thoughts..."
        className="flex-grow bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sky-900 dark:text-slate-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200 max-h-40 placeholder-sky-600 dark:placeholder-slate-500"
        rows={1}
        style={{ overflowY: 'auto' }}
      />
      <button 
        type="submit" 
        disabled={disabled || !text.trim()}
        className="px-3 py-3 bg-sky-500 text-white rounded-lg shadow-md transition-all duration-300 hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
        aria-label="Send response"
      >
        <SendIcon className="w-6 h-6" />
      </button>
    </form>
  );
};

export default UserInput;