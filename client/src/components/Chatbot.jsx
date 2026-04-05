import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, X, Send } from 'lucide-react';

const Chatbot = () => {
    const { api } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ sender: 'ai', text: 'Hi! I am FitAI. Ask me about your health goals, diet, or tips to stay active!' }]);
    const [input, setInput] = useState('');
    const chatRef = useRef(null);

    useEffect(() => {
        if(chatRef.current) {
             chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if(!input.trim()) return;
        
        const userMsg = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        
        try {
            const res = await api.post('/chat', { message: userMsg });
            setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
        } catch(err) {
            setMessages(prev => [...prev, { sender: 'ai', text: 'Oops! I am having trouble connecting right now.' }]);
        }
    };

    return (
        <div className="chatbot-widget">
            {isOpen && (
                <div className="chat-window animate-fade-in">
                    <div style={{ background: 'var(--primary)', padding: '1rem', fontWeight: 'bold' }}>
                        FitAI Assistant
                    </div>
                    <div className="chat-messages" ref={chatRef}>
                        {messages.map((m, i) => (
                            <div key={i} className={`msg ${m.sender}`}>
                                {m.text}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSend} className="chat-input" style={{margin:0}}>
                        <input style={{margin:0, borderRight:'none'}} value={input} onChange={e => setInput(e.target.value)} placeholder="Ask anything..." />
                        <button style={{margin:0, width:'60px'}} type="submit"><Send size={18} /></button>
                    </form>
                </div>
            )}
            <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
        </div>
    );
};

export default Chatbot;
