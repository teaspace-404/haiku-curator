
import React, { useState, useEffect } from 'react';
import CloseIcon from './CloseIcon';

interface PromptEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, instruction: string) => void;
  currentName: string;
  currentInstruction: string;
}

const PromptEditorModal: React.FC<PromptEditorModalProps> = ({ isOpen, onClose, onSave, currentName, currentInstruction }) => {
  const [name, setName] = useState(currentName);
  const [instruction, setInstruction] = useState(currentInstruction);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setInstruction(currentInstruction);
    }
  }, [isOpen, currentName, currentInstruction]);

  const handleSave = () => {
    onSave(name, instruction);
  };
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="prompt-editor-title"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 id="prompt-editor-title" className="text-lg font-semibold text-sky-900 dark:text-slate-100">
            Edit Agent Prompt
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
            aria-label="Close prompt editor"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </header>

        <main className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="agent-name" className="block text-sm font-medium text-sky-800 dark:text-slate-300 mb-1">
              Agent Name
            </label>
            <input
              id="agent-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 text-sky-900 dark:text-slate-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="agent-instruction" className="block text-sm font-medium text-sky-800 dark:text-slate-300 mb-1">
              Agent Instructions
            </label>
            <textarea
              id="agent-instruction"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 text-sky-900 dark:text-slate-200 rounded-md p-2 h-48 resize-y focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors font-mono text-sm"
              rows={8}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Use <code className="bg-slate-200 dark:bg-slate-700 rounded px-1 py-0.5">{'{agentName}'}</code> to include the agent's name in the instructions.
            </p>
          </div>
        </main>

        <footer className="flex justify-end gap-4 p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 dark:focus:ring-offset-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800 transition-colors"
          >
            Save Changes
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PromptEditorModal;
