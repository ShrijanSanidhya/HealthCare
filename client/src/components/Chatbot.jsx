import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

const SUGGESTED_QUESTIONS = [
    'What should I eat today?',
    'How many calories should I have?',
    'Give me protein tips',
    'I feel tired, any advice?',
];

const Chatbot = () => {
    const { api } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Hi! I\'m your personal FitAI assistant 🤖\n\nAsk me about meals, calories, workouts, or how to reach your health goals!' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatRef = useRef(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages, isTyping, isOpen]);

    const sendMessage = async (messageText) => {
        const userMsg = messageText.trim();
        if (!userMsg) return;

        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await api.post('/chat', { message: userMsg });
            // Add a short delay so the typing indicator shows meaningfully
            await new Promise(r => setTimeout(r, 600));
            setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { sender: 'ai', text: 'I\'m having trouble connecting to the server right now. Please try again!' }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSend = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <div className="chatbot-widget">
            {isOpen && (
                <div className="chat-window animate-fade-in">
                    {/* Header */}
                    <div style={{ background: 'linear-gradient(90deg, var(--primary), #7b2cbf)', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Bot size={20} />
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>FitAI Assistant</div>
                                <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>Personalized health intelligence</div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ width: 'auto', background: 'transparent', padding: '4px' }}>
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="chat-messages" ref={chatRef} style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {messages.map((m, i) => (
                            <div key={i} className={`msg ${m.sender}`} style={{ whiteSpace: 'pre-line' }}>
                                {m.text}
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="msg ai" style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '0.6rem 1rem' }}>
                                <span className="typing-dot" style={{ width: '7px', height: '7px', background: 'var(--primary)', borderRadius: '50%', animation: 'typingBounce 1s infinite' }}></span>
                                <span className="typing-dot" style={{ width: '7px', height: '7px', background: 'var(--primary)', borderRadius: '50%', animation: 'typingBounce 1s 0.2s infinite' }}></span>
                                <span className="typing-dot" style={{ width: '7px', height: '7px', background: 'var(--primary)', borderRadius: '50%', animation: 'typingBounce 1s 0.4s infinite' }}></span>
                            </div>
                        )}
                    </div>

                    {/* Suggested questions */}
                    {messages.length <= 1 && (
                        <div style={{ padding: '0.5rem 1rem', display: 'flex', flexWrap: 'wrap', gap: '6px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            {SUGGESTED_QUESTIONS.map((q, i) => (
                                <button key={i} onClick={() => sendMessage(q)} style={{ background: 'rgba(133,154,81,0.15)', border: '1px solid rgba(133,154,81,0.4)', borderRadius: '20px', padding: '0.3rem 0.75rem', fontSize: '0.75rem', width: 'auto', color: 'var(--primary)', cursor: 'pointer' }}>
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <form onSubmit={handleSend} className="chat-input" style={{ margin: 0 }}>
                        <input
                            style={{ margin: 0, borderRadius: '8px 0 0 8px', borderRight: 'none' }}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask anything about health..."
                            disabled={isTyping}
                        />
                        <button style={{ margin: 0, width: '52px', borderRadius: '0 8px 8px 0' }} type="submit" disabled={isTyping || !input.trim()}>
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            )}

            <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)} style={{ boxShadow: '0 4px 20px rgba(133,154,81,0.4)' }}>
                {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
            </button>
        </div>
    );
};

export default Chatbot;
