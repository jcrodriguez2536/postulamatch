import React, { useState, useEffect, useRef } from 'react';
import { Chat } from "@google/genai";
import { ChatMessage } from '../types';
import { Send, User, Bot, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatTutorProps {
  chatSession: Chat | null;
  onClose: () => void;
}

const ChatTutor: React.FC<ChatTutorProps> = ({ chatSession, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "¡Hola! Soy tu Tutor Personal de IA. Pregúntame sobre la vacante, tu CV o los temas de estudio.", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await chatSession.sendMessage({ message: userMsg.text });
      
      const modelMsg: ChatMessage = { 
        role: 'model', 
        text: result.text || "Procesé eso, pero no tengo una respuesta de texto en este momento.", 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'model', text: "Tengo problemas para conectarme en este momento. Por favor, inténtalo de nuevo.", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/80 border border-white/50 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up backdrop-blur-xl">
        {/* Header */}
        <div className="bg-emerald-600/90 p-3 text-white flex items-center justify-between cursor-move backdrop-blur-md">
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/50 flex items-center justify-center">
                   <Sparkles className="w-4 h-4 text-emerald-100" />
                </div>
                <div>
                    <h3 className="font-bold text-sm leading-tight">Tutor IA</h3>
                    <p className="text-[10px] text-emerald-100 leading-tight">Contexto Limitado</p>
                </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-emerald-700/50 rounded transition-colors text-emerald-100 hover:text-white">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/30">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                         <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mb-1 ${msg.role === 'user' ? 'bg-stone-300/80' : 'bg-emerald-100/80'}`}>
                            {msg.role === 'user' ? <User className="w-3 h-3 text-stone-600"/> : <Bot className="w-3 h-3 text-emerald-600"/>}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm shadow-sm backdrop-blur-sm ${
                            msg.role === 'user' 
                                ? 'bg-emerald-600/90 text-white rounded-br-none' 
                                : 'bg-white/80 text-stone-700 border border-stone-200/50 rounded-bl-none prose prose-sm max-w-none'
                        }`}>
                           {msg.role === 'user' ? msg.text : <ReactMarkdown>{msg.text}</ReactMarkdown>}
                        </div>
                    </div>
                </div>
            ))}
            {isTyping && (
                <div className="flex justify-start">
                    <div className="flex flex-row items-end gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mb-1">
                            <Bot className="w-3 h-3 text-emerald-600" />
                        </div>
                        <div className="bg-white/80 p-3 rounded-2xl rounded-bl-none border border-stone-200 flex space-x-1 backdrop-blur-sm">
                            <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-75"></div>
                            <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white/50 border-t border-stone-200/50 backdrop-blur-sm">
            <div className="relative flex items-center">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Pregunta sobre tu CV..."
                    className="w-full pr-10 pl-3 py-2 border border-stone-300/50 rounded-full focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none resize-none bg-white/70 focus:bg-white transition-colors text-sm"
                    rows={1}
                    style={{minHeight: '40px'}}
                />
                <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="absolute right-1.5 p-1.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
  );
};

export default ChatTutor;