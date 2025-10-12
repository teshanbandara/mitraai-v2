import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Trash2, Mic, MicOff } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m MitraAI. How can I help you today?\n\nහායි! මම MitraAI. ඔබට උදව්වක් අවශ්‍යද?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'si-LK';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const messageText = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        message: messageText,
        sessionId: sessionId
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.message
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error. Please try again.\n\nසමාවෙන්න, දෝෂයක් ඇතිවුණා.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = async () => {
    try {
      await axios.delete(`${API_URL}/chat/${sessionId}`);
      setMessages([
        {
          role: 'assistant',
          content: 'Hello! I\'m MitraAI. How can I help you today?\n\nහායි! මම MitraAI. ඔබට උදව්වක් අවශ්‍යද?'
        }
      ]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-6 py-4 flex-shrink-0 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200/50">
              <MessageCircle className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl font-medium text-slate-800">MitraAI</h1>
              <p className="text-xs text-slate-500 hidden sm:block">Your calm assistant</p>
            </div>
          </div>
          
          <button
            onClick={clearChat}
            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 rounded-xl transition-all duration-200"
            title="Clear chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl px-5 py-3.5 shadow-sm transition-all duration-200 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-indigo-200/50'
                    : 'bg-white/90 backdrop-blur-sm text-slate-700 border border-slate-200/50 shadow-slate-200/50'
                }`}
              >
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-slideUp">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl px-5 py-3.5 border border-slate-200/50 shadow-sm shadow-slate-200/50">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-md border-t border-slate-200/50 px-4 sm:px-6 py-5 flex-shrink-0 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleVoiceInput}
              className={`flex-shrink-0 p-3 rounded-2xl transition-all duration-300 ${
                isListening 
                  ? 'bg-gradient-to-br from-red-400 to-pink-400 text-white shadow-lg shadow-red-200/50 scale-105' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105'
              }`}
              title={isListening ? 'Stop' : 'Voice'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-5 py-3.5 bg-white/90 border border-slate-200/50 rounded-2xl focus:ring-2 focus:ring-indigo-300/50 focus:border-indigo-300 outline-none text-sm sm:text-base text-slate-700 placeholder-slate-400 transition-all duration-200 shadow-sm"
              disabled={isLoading}
            />

            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 p-3 bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-200/50 hover:scale-105 hover:shadow-xl disabled:shadow-none disabled:scale-100"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;