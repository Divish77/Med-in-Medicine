'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  MessageSquare, 
  ChevronDown, 
  ShoppingCart, 
  Check, 
  Clock, 
  ShieldCheck,
  RefreshCw,
  GripHorizontal
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const AiChatbot = () => {
  const { 
    activeOrderId, 
    deliveryLocation, 
    addToCart, 
    setActiveTab, 
    setIsPrescriptionModalOpen,
    setIsLocationModalOpen,
    showToast,
    user
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome_1',
      sender: 'bot',
      text: "Hello! 👋 I'm **MedAI**, your 24x7 instant pharmacy assistant for **Med-in-Minutes** ⚡.\n\nAsk me about medicine availability, 10-minute delivery coverage, prescription verification, or tracking your order!",
      time: 'Just now'
    }
  ]);

  const messagesEndRef = useRef(null);

  // Draggable Window State
  const [windowPos, setWindowPos] = useState({ x: 0, y: 0 });
  const [isDraggingWindow, setIsDraggingWindow] = useState(false);
  const windowDragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const chatWindowRef = useRef(null);

  // Draggable Floating Button State
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const [isDraggingBtn, setIsDraggingBtn] = useState(false);
  const btnDragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0, moved: false });
  const btnRef = useRef(null);

  // Keep elements within screen boundaries on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowPos((prev) => {
        const winW = chatWindowRef.current?.offsetWidth || 380;
        const winH = chatWindowRef.current?.offsetHeight || 560;
        const minX = -(window.innerWidth - 24 - winW);
        const maxX = 24;
        const minY = -(window.innerHeight - 24 - winH);
        const maxY = 24;
        return {
          x: Math.min(Math.max(prev.x, minX), maxX),
          y: Math.min(Math.max(prev.y, minY), maxY)
        };
      });
      setBtnPos((prev) => {
        const btnW = btnRef.current?.offsetWidth || 150;
        const btnH = btnRef.current?.offsetHeight || 48;
        const minX = -(window.innerWidth - 24 - btnW);
        const maxX = 24;
        const minY = -(window.innerHeight - 24 - btnH);
        const maxY = 24;
        return {
          x: Math.min(Math.max(prev.x, minX), maxX),
          y: Math.min(Math.max(prev.y, minY), maxY)
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Window drag handlers
  const handleWindowPointerDown = (e) => {
    if (e.target.closest('button')) return;
    setIsDraggingWindow(true);
    windowDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: windowPos.x,
      initialY: windowPos.y
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleWindowPointerMove = (e) => {
    if (!isDraggingWindow) return;
    const dx = e.clientX - windowDragRef.current.startX;
    const dy = e.clientY - windowDragRef.current.startY;
    const winW = chatWindowRef.current?.offsetWidth || 380;
    const winH = chatWindowRef.current?.offsetHeight || 560;
    const minX = -(window.innerWidth - 24 - winW);
    const maxX = 24;
    const minY = -(window.innerHeight - 24 - winH);
    const maxY = 24;
    setWindowPos({
      x: Math.min(Math.max(windowDragRef.current.initialX + dx, minX), maxX),
      y: Math.min(Math.max(windowDragRef.current.initialY + dy, minY), maxY)
    });
  };

  const handleWindowPointerUp = (e) => {
    if (isDraggingWindow) {
      setIsDraggingWindow(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Button drag handlers
  const handleBtnPointerDown = (e) => {
    setIsDraggingBtn(true);
    btnDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: btnPos.x,
      initialY: btnPos.y,
      moved: false
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleBtnPointerMove = (e) => {
    if (!isDraggingBtn) return;
    const dx = e.clientX - btnDragRef.current.startX;
    const dy = e.clientY - btnDragRef.current.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      btnDragRef.current.moved = true;
    }
    const btnW = btnRef.current?.offsetWidth || 150;
    const btnH = btnRef.current?.offsetHeight || 48;
    const minX = -(window.innerWidth - 24 - btnW);
    const maxX = 24;
    const minY = -(window.innerHeight - 24 - btnH);
    const maxY = 24;
    setBtnPos({
      x: Math.min(Math.max(btnDragRef.current.initialX + dx, minX), maxX),
      y: Math.min(Math.max(btnDragRef.current.initialY + dy, minY), maxY)
    });
  };

  const handleBtnPointerUp = (e) => {
    if (isDraggingBtn) {
      setIsDraggingBtn(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      if (!btnDragRef.current.moved) {
        setIsOpen(true);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    "⚡ How does 10-minute delivery work?",
    "📍 Check if 110001 is serviceable",
    "📋 Do I need a prescription?",
    "💊 Recommend medicines for fever & pain",
    ...(activeOrderId ? [`📦 Track order ${activeOrderId}`] : [])
  ];

  const handleSend = async (messageText) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || loading) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: {
            activeOrderId,
            pincode: deliveryLocation?.pincode,
            user: user ? { name: user.name, id: user.id } : null
          }
        })
      });

      const data = await res.json();

      const botMsg = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: data.reply || "I am here to assist! Feel free to ask about medicines, delivery, or tracking.",
        medicines: data.medicines || null,
        action: data.action || null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          sender: 'bot',
          text: "⚠️ Sorry, I could not connect right now. Please verify your internet connection or check our FAQ section.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format bold markdown text and bullet points into React nodes
  const formatText = (text) => {
    return text.split('\n').map((line, idx) => {
      // Replace **text** with <strong>text</strong>
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} style={{ color: 'inherit', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <span key={idx} style={{ display: 'block', minHeight: line.trim() === '' ? '8px' : 'auto', marginBottom: '3px' }}>
          {formattedParts}
        </span>
      );
    });
  };

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .medai-floating-btn {
            bottom: 76px !important;
            right: 14px !important;
            padding: 10px 16px !important;
            font-size: 0.85rem !important;
          }
          .medai-chat-window {
            bottom: 74px !important;
            right: 12px !important;
            max-width: calc(100vw - 24px) !important;
            width: calc(100vw - 24px) !important;
            height: calc(100vh - 96px) !important;
            max-height: calc(100vh - 96px) !important;
            border-radius: 16px !important;
          }
        }
      `}</style>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          ref={btnRef}
          className="medai-floating-btn"
          onPointerDown={handleBtnPointerDown}
          onPointerMove={handleBtnPointerMove}
          onPointerUp={handleBtnPointerUp}
          aria-label="Open MedAI Chatbot"
          title="Click to open or drag to move anywhere"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            transform: `translate3d(${btnPos.x}px, ${btnPos.y}px, 0)`,
            zIndex: 9990,
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: isDraggingBtn ? '0 16px 36px rgba(5, 150, 105, 0.6)' : '0 8px 24px rgba(5, 150, 105, 0.4)',
            cursor: isDraggingBtn ? 'grabbing' : 'grab',
            userSelect: 'none',
            touchAction: 'none',
            transition: isDraggingBtn ? 'none' : 'box-shadow 0.25s ease',
            fontFamily: 'inherit',
            fontWeight: 700,
            fontSize: '0.92rem'
          }}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Bot size={22} />
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '8px',
              height: '8px',
              background: '#34d399',
              borderRadius: '50%',
              border: '2px solid white'
            }} />
          </div>
          <span>Ask MedAI</span>
          <span style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.72rem',
            letterSpacing: '0.04em'
          }}>
            ⚡ 24x7
          </span>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className="medai-chat-window"
          role="dialog"
          aria-label="MedAI Customer Support"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            transform: `translate3d(${windowPos.x}px, ${windowPos.y}px, 0)`,
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '560px',
            maxHeight: 'calc(100vh - 48px)',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: isDraggingWindow ? '0 24px 50px rgba(0, 0, 0, 0.3)' : '0 16px 40px rgba(0, 0, 0, 0.2)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            overflow: 'hidden',
            transition: isDraggingWindow ? 'none' : 'box-shadow 0.2s ease',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {/* Header (Draggable Handle) */}
          <div
            onPointerDown={handleWindowPointerDown}
            onPointerMove={handleWindowPointerMove}
            onPointerUp={handleWindowPointerUp}
            title="Click & drag header to move window"
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: 'white',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              cursor: isDraggingWindow ? 'grabbing' : 'grab',
              userSelect: 'none',
              touchAction: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '11px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(4px)'
                }}
              >
                <Bot size={20} color="white" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>MedAI Assistant</h3>
                  <Sparkles size={13} color="#fef08a" />
                </div>
                <div style={{ fontSize: '0.72rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', background: '#34d399', borderRadius: '50%' }} />
                  Online | Instant 10-min Support
                </div>
              </div>
            </div>

            {/* Drag Pill indicator & Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '3px 8px',
                  background: isDraggingWindow ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  color: '#ecfdf5',
                  pointerEvents: 'none'
                }}
              >
                <GripHorizontal size={14} />
                <span>Move</span>
              </div>
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: `welcome_${Date.now()}`,
                      sender: 'bot',
                      text: "Chat cleared! How else may I assist you with your medicine or order?",
                      time: 'Just now'
                    }
                  ]);
                }}
                title="Reset Chat"
                aria-label="Reset Chat"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  opacity: 0.8
                }}
              >
                <RefreshCw size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                aria-label="Close Chat"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Service Banner */}
          <div
            style={{
              background: '#f0fdf4',
              borderBottom: '1px solid #dcfce7',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: '#166534',
              fontWeight: 600
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={13} color="#059669" />
              <span>Current PIN: <strong>{deliveryLocation?.pincode || '110001'}</strong> (~10 mins)</span>
            </div>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#059669',
                textDecoration: 'underline',
                fontSize: '0.72rem',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              Change
            </button>
          </div>

          {/* Messages Stream */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: '#f8fafc'
            }}
          >
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '88%',
                    alignSelf: isUser ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      background: isUser ? '#059669' : '#ffffff',
                      color: isUser ? '#ffffff' : '#1e293b',
                      padding: '11px 14px',
                      borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      fontSize: '0.85rem',
                      lineHeight: '1.5',
                      boxShadow: isUser ? '0 2px 8px rgba(5,150,105,0.2)' : '0 2px 6px rgba(0,0,0,0.04)',
                      border: isUser ? 'none' : '1px solid #e2e8f0',
                      wordBreak: 'break-word'
                    }}
                  >
                    {formatText(m.text)}

                    {/* Interactive Medicines Recommendation Cards */}
                    {m.medicines && m.medicines.length > 0 && (
                      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {m.medicines.map((med) => (
                          <div
                            key={med._id}
                            style={{
                              background: '#f8fafc',
                              border: '1px solid #cbd5e1',
                              borderRadius: '10px',
                              padding: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '8px'
                            }}
                          >
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <strong style={{ fontSize: '0.82rem', color: '#0f172a', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {med.name}
                              </strong>
                              <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>
                                ₹{med.price}
                              </span>
                              <span style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: '6px' }}>
                                {med.packSize}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                addToCart(med);
                                showToast(`Added ${med.name} to cart!`);
                              }}
                              className="btn btn-primary"
                              style={{
                                padding: '6px 10px',
                                fontSize: '0.72rem',
                                borderRadius: '6px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <ShoppingCart size={12} /> Add
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Action Button */}
                    {m.action?.type === 'TRACK_ORDER' && (
                      <button
                        onClick={() => {
                          setActiveTab('track');
                          setIsOpen(false);
                        }}
                        style={{
                          marginTop: '8px',
                          width: '100%',
                          background: '#0284c7',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        🚚 View Live Scooter Map
                      </button>
                    )}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '3px', padding: '0 4px' }}>
                    {m.time}
                  </span>
                </div>
              );
            })}

            {loading && (
              <div style={{ alignSelf: 'flex-start', background: '#ffffff', border: '1px solid #e2e8f0', padding: '10px 14px', borderRadius: '16px 16px 16px 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bot size={16} color="#059669" />
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>MedAI is typing…</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div
            style={{
              padding: '8px 12px',
              background: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: '5px 11px',
                  fontSize: '0.72rem',
                  color: '#334155',
                  cursor: 'pointer',
                  fontWeight: 600,
                  flexShrink: 0
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: '12px 14px',
              background: '#ffffff',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about medicines, delivery, or track order..."
              disabled={loading}
              style={{
                flex: 1,
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '10px 12px',
                fontSize: '0.84rem',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              aria-label="Send Message"
              style={{
                background: input.trim() && !loading ? '#059669' : '#cbd5e1',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s ease'
              }}
            >
              <Send size={17} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

