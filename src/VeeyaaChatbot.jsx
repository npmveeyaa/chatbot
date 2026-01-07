import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Veeyaa Custom Chatbot Component
 * 
 * A React component that provides a custom chatbot UI.
 * API integration will be added later.
 * 
 * @param {Object} props - Component props
 * @param {Array<string>} props.hideOnRoutes - Array of route patterns where chatbot should be hidden (default: ['/customer'])
 * @param {string} props.position - Chatbot position: 'bottom-right' | 'bottom-left' (default: 'bottom-right')
 * @param {string} props.primaryColor - Primary color for the chatbot (default: '#677a58')
 * @param {string} props.backgroundColor - Background color for the chatbot (default: '#ffffff')
 * @param {string} props.apiUrl - API URL for chatbot messages (will be used later)
 * @param {Function} props.onMessage - Callback when a message is sent
 */
const VeeyaaChatbot = ({
  hideOnRoutes = ['/customer'],
  position = 'bottom-right',
  primaryColor = '#677a58',
  backgroundColor = '#ffffff',
  apiUrl,
  onMessage
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Check if chatbot should be hidden based on route
  const shouldHide = hideOnRoutes.some(route => location.pathname.startsWith(route));

  useEffect(() => {
    if (shouldHide && isOpen) {
      setIsOpen(false);
    }
  }, [shouldHide, isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: 'Hello! How can I help you today?',
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    if (onMessage) {
      onMessage(userMessage.text);
    }

    // TODO: Replace with actual API call when API is ready
    // For now, simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: 'Thank you for your message! Our team will get back to you soon.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  if (shouldHide) {
    return null;
  }

  return (
    <div className={`veeyaa-chatbot-container veeyaa-chatbot-${position}`}>
      {/* Chat Button */}
      <button
        className="veeyaa-chatbot-toggle"
        onClick={toggleChat}
        style={{ backgroundColor: primaryColor }}
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="veeyaa-chatbot-window" style={{ backgroundColor }}>
          {/* Header */}
          <div className="veeyaa-chatbot-header" style={{ backgroundColor: primaryColor }}>
            <div className="veeyaa-chatbot-header-content">
              <div className="veeyaa-chatbot-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="veeyaa-chatbot-header-text">
                <h3>Chat Support</h3>
                <span className="veeyaa-chatbot-status">Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="veeyaa-chatbot-messages" ref={chatContainerRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`veeyaa-chatbot-message veeyaa-chatbot-message-${message.sender}`}
              >
                <div
                  className="veeyaa-chatbot-message-bubble"
                  style={{
                    backgroundColor: message.sender === 'user' ? primaryColor : '#f0f0f0',
                    color: message.sender === 'user' ? '#ffffff' : '#333333'
                  }}
                >
                  {message.text}
                </div>
                <span className="veeyaa-chatbot-message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="veeyaa-chatbot-message veeyaa-chatbot-message-bot">
                <div className="veeyaa-chatbot-typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="veeyaa-chatbot-input-container">
            <input
              type="text"
              className="veeyaa-chatbot-input"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
            />
            <button
              className="veeyaa-chatbot-send"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              style={{ backgroundColor: primaryColor }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VeeyaaChatbot;
