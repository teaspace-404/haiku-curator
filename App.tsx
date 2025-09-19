
import React, { useState, useEffect, useRef } from 'react';
import type { Message, Conversation } from './types';
import { getHaikuForImage, getReflectionForImageAndText } from './services/geminiService';
import { getRandomArtwork } from './services/vamService';
import ChatMessage from './components/ChatMessage';
import ArtworkDiscoveryButton from './components/ArtworkDiscoveryButton';
import LoadingSpinner from './components/LoadingSpinner';
import UserInput from './components/UserInput';
import HistoryDropdown from './components/HistoryDropdown';
import PlusIcon from './components/PlusIcon';
import SunIcon from './components/SunIcon';
import MoonIcon from './components/MoonIcon';

const MAX_HISTORY_LENGTH = 20;

const App: React.FC = () => {
  const [history, setHistory] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationState, setConversationState] = useState<'idle' | 'awaiting_response' | 'showing_input'>('idle');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return 'dark';
  });
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Effect to apply theme class and save preference
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load from localStorage on initial mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('haiku-history');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory) as Conversation[];
        if (parsedHistory.length > 0) {
          setHistory(parsedHistory);
          setCurrentConversationId(parsedHistory[parsedHistory.length - 1].id);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to load history, starting fresh.", e);
    }
    // If no history or it's invalid, start a new conversation
    startNewConversation(true);
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('haiku-history', JSON.stringify(history));
    }
  }, [history]);

  const currentConversation = history.find(c => c.id === currentConversationId);
  const messages = currentConversation?.messages || [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const startNewConversation = (isInitial = false) => {
    const newId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
        id: newId,
        title: 'New Conversation',
        messages: [{
            id: 'initial-welcome',
            author: 'ai',
            text: "Welcome, wanderer.\nLet's find some hidden art,\nWhat will we see now?",
        }],
        currentArtwork: null
    };

    setHistory(prevHistory => {
      const newHistory = isInitial ? [] : prevHistory;
      const updatedHistory = [...newHistory, newConversation];
      if (updatedHistory.length > MAX_HISTORY_LENGTH) {
        return updatedHistory.slice(updatedHistory.length - MAX_HISTORY_LENGTH);
      }
      return updatedHistory;
    });

    setCurrentConversationId(newId);
    setConversationState('idle');
    setError(null);
  };

  const handleSelectConversation = (id: string) => {
    const targetConversation = history.find(c => c.id === id);
    if (!targetConversation) return;

    setCurrentConversationId(id);
    const lastMessage = targetConversation.messages[targetConversation.messages.length - 1];
    
    if (lastMessage?.author === 'ai' && targetConversation.messages.length > 1) {
        setConversationState('awaiting_response');
    } else {
        setConversationState('idle');
    }
  };

  const handleDiscoverNewArtwork = async () => {
    setIsLoading(true);
    setError(null);
    setConversationState('idle'); 

    try {
      const { base64Image, mimeType, title, details } = await getRandomArtwork();
      
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        author: 'user',
        image: base64Image,
        text: title, 
        artworkDetails: details,
      };

      await new Promise(res => setTimeout(res, 100));

      const haiku = await getHaikuForImage(base64Image, mimeType);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        author: 'ai',
        text: haiku,
      };
      
      setHistory(prev => prev.map(conv => {
        if (conv.id === currentConversationId) {
          const newMessages = [...conv.messages, userMessage, aiMessage];
          let newTitle = conv.title;
          if (conv.messages.length === 1 && conv.title === 'New Conversation') {
            const lines = haiku.split('\n').filter(line => line.trim() !== '');
            newTitle = lines[lines.length - 1] || 'Untitled Haiku';
          }
          return {
            ...conv,
            title: newTitle,
            messages: newMessages,
            currentArtwork: { base64Image, mimeType },
          };
        }
        return conv;
      }));
      setConversationState('awaiting_response');

    } catch (e) {
      const err = e as Error;
      const errorMessage = err.message || 'An unknown error occurred.';
      setError(errorMessage);
      const errorAiMessage: Message = {
        id: `ai-error-${Date.now()}`,
        author: 'ai',
        text: "My thoughts are clouded,\nThe museum's halls are dim,\nPlease try to search once more.",
      };
      setHistory(prev => prev.map(conv => 
        conv.id === currentConversationId ? { ...conv, messages: [...conv.messages, errorAiMessage] } : conv
      ));
      setConversationState('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserResponseSubmit = async (responseText: string) => {
    if (!responseText.trim() || !currentConversation?.currentArtwork) return;
    
    setIsLoading(true);
    setError(null);
    setConversationState('idle');

    const userMessage: Message = {
      id: `user-text-${Date.now()}`,
      author: 'user',
      text: responseText,
    };
    
    setHistory(prev => prev.map(conv => 
      conv.id === currentConversationId ? { ...conv, messages: [...conv.messages, userMessage] } : conv
    ));
    
    try {
      const { base64Image, mimeType } = currentConversation.currentArtwork;
      const reflection = await getReflectionForImageAndText(base64Image, mimeType, responseText);
      const aiMessage: Message = {
        id: `ai-reflection-${Date.now()}`,
        author: 'ai',
        text: reflection,
      };
      setHistory(prev => prev.map(conv => 
        conv.id === currentConversationId ? { ...conv, messages: [...conv.messages, aiMessage] } : conv
      ));
      setConversationState('awaiting_response');
    } catch (e) {
      const err = e as Error;
      const errorMessage = err.message || 'An unknown error occurred.';
      setError(errorMessage);
      const errorAiMessage: Message = {
          id: `ai-error-${Date.now()}`,
          author: 'ai',
          text: "My apologies,\nA mental fog has descended,\nCould you repeat that?",
      };
      setHistory(prev => prev.map(conv => 
        conv.id === currentConversationId ? { ...conv, messages: [...conv.messages, errorAiMessage] } : conv
      ));
      setConversationState('awaiting_response');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFooterContent = () => {
    if (isLoading) return null;

    switch (conversationState) {
      case 'showing_input':
        return (
          <div className="flex items-start gap-2">
            <UserInput onSubmit={handleUserResponseSubmit} disabled={isLoading} />
            <div className="pt-1">
              <ArtworkDiscoveryButton onClick={handleDiscoverNewArtwork} disabled={isLoading} isSecondary />
            </div>
          </div>
        );
      case 'awaiting_response':
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setConversationState('showing_input')}
              className="flex-grow px-4 py-3 text-white font-bold rounded-lg shadow-md transition-all duration-300 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-offset-white"
            >
              Give my response
            </button>
            <ArtworkDiscoveryButton onClick={handleDiscoverNewArtwork} disabled={isLoading} isSecondary />
          </div>
        );
      case 'idle':
      default:
        return <ArtworkDiscoveryButton onClick={handleDiscoverNewArtwork} disabled={isLoading} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-900 text-sky-900 dark:text-slate-200 transition-colors duration-300">
      <header className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 p-4 fixed top-0 left-0 right-0 z-10 flex justify-between items-center gap-4">
        <div className="flex-1 flex justify-start">
          <HistoryDropdown
            history={history}
            currentConversationId={currentConversationId}
            onSelectConversation={handleSelectConversation}
          />
        </div>
        <h1 className="text-lg md:text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-500 dark:from-teal-200 dark:to-cyan-400 whitespace-nowrap">
          The Haiku Curator
        </h1>
        <div className="flex-1 flex justify-end items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 dark:text-slate-300 hover:text-sky-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => startNewConversation()}
            className="p-2 text-slate-500 dark:text-slate-300 hover:text-sky-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
            aria-label="Start new conversation"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 pt-20 pb-32">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-center items-center gap-4">
               <LoadingSpinner />
               <p className="text-slate-500 dark:text-slate-400 font-serif italic">Muse is reflecting...</p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 fixed bottom-0 left-0 right-0 z-10 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-2xl mx-auto">
          {error && <p className="text-red-500 dark:text-red-400 text-center text-sm mb-2">{error}</p>}
          {renderFooterContent()}
        </div>
      </footer>
    </div>
  );
};

export default App;
