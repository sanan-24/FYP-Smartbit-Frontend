import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sparkles, Send, Loader2, X, MessageSquare, User } from 'lucide-react';
import { fetchAISuggestions, clearSuggestions, addMessage } from '../features/aiSlice';
import { motion, AnimatePresence } from 'framer-motion';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const chatContainerRef = useRef(null);
  const dispatch = useDispatch();
  const { chatHistory, loading, error } = useSelector((state) => state.ai);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    // Add user message to UI immediately
    dispatch(addMessage({ role: 'user', content: query }));
    
    // Fetch AI response
    dispatch(fetchAISuggestions(query));
    
    // Clear input field
    setQuery('');
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 bg-primary-500 text-white p-4 rounded-full shadow-glow hover:scale-110 transition-all duration-300 group"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6 group-hover:rotate-12" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-28 right-8 z-50 w-full max-w-[400px] bg-white dark:bg-secondary-900 rounded-[2.5rem] shadow-premium border border-slate-100 dark:border-white/5 overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="bg-primary-500 p-6 text-white shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg tracking-tight">Smart Bite AI</h3>
                    <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Personal Foodie</p>
                  </div>
                </div>
                <button 
                  onClick={() => dispatch(clearSuggestions())}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  title="Clear Chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content / Chat Area */}
            <div 
              ref={chatContainerRef}
              className="flex-grow p-6 overflow-y-auto space-y-4 scroll-smooth"
            >
              {chatHistory.length === 0 ? (
                <div className="text-center py-10 space-y-4 h-full flex flex-col justify-center">
                  <div className="bg-primary-50 dark:bg-primary-900/20 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto">
                    <MessageSquare className="h-8 w-8 text-primary-500" />
                  </div>
                  <p className="text-secondary-500 dark:text-secondary-400 font-medium px-4">
                    What are you craving today? I can suggest something trending and spicy!
                  </p>
                </div>
              ) : (
                chatHistory.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                      msg.role === 'user' ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-white/10 text-primary-500'
                    }`}>
                      {msg.role === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl max-w-[80%] text-sm font-medium leading-relaxed ${
                      msg.role === 'user' 
                      ? 'bg-primary-500 text-white rounded-tr-none shadow-sm' 
                      : 'bg-slate-100 dark:bg-white/5 text-secondary-900 dark:text-white rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}

              {loading && (
                <div className="flex items-start space-x-3">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center text-primary-500">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 rounded-tl-none">
                    <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-xs font-bold text-center">
                  {error}
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-secondary-950/50 shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tell me what you want to eat..."
                  className="w-full bg-white dark:bg-secondary-900 border-none rounded-2xl py-4 pl-6 pr-14 focus:ring-2 focus:ring-primary-500/20 text-sm font-medium dark:text-white transition-all outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-500 text-white rounded-xl shadow-glow hover:bg-primary-600 transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
