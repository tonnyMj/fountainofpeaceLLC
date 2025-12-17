"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I am the automated assistant for Fountain of Hope. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setLoading(true);

        try {
            // Pass last few messages for context (optional, but good for follow-up)
            // We only pass basic history to keep tokens low
            const recentHistory = messages.slice(-4).map(m => ({ role: m.role, content: m.content }));

            const res = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history: recentHistory
                })
            });

            const data = await res.json();
            const reply = data.reply || "I'm having trouble connecting right now. Please call us!";

            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble answering right now. Please try again later or call (253) 861-1691." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 mb-4 overflow-hidden border border-gray-100 flex flex-col animate-scale-in origin-bottom-right" style={{ maxHeight: '600px', height: '80vh' }}>
                    {/* Header */}
                    <div className="bg-primary p-4 text-white flex justify-between items-center shadow-md shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-2 rounded-full">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Hope Assistant</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    <span className="text-xs text-secondary-light">Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-primary text-white' : 'bg-secondary text-primary'}`}>
                                    {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>
                                <div className={`p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${m.role === 'user'
                                        ? 'bg-primary text-white rounded-tr-none'
                                        : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center shrink-0">
                                    <Bot size={14} />
                                </div>
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                                    <Loader2 size={16} className="animate-spin text-primary" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                        <form onSubmit={handleSend} className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your question..."
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="bg-primary text-white p-2.5 rounded-full hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                        <div className="text-center mt-2 text-[10px] text-gray-400">
                            AI can make mistakes. For urgent matters, please call.
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:bg-primary-dark transition-all transform hover:scale-110 flex items-center gap-2 group animate-bounce-subtle"
                >
                    <MessageCircle size={28} />
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap font-bold">
                        Chat with us
                    </span>
                </button>
            )}
        </div>
    );
}
