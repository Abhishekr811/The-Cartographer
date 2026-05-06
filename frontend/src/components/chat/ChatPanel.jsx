import { useState, useRef, useEffect } from 'react';
import Heading from '../typography/Heading';
import Text from '../typography/Text';
import ActionButton from '../interaction/ActionButton';
import styles from './ChatPanel.module.css';
import { submitChatMessage } from '../../api/chat';

export default function ChatPanel({ topicId, claims = [], relations = [], papers = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const data = await submitChatMessage(
        userMessage,
        topicId || 'unknown',
        { claims, relations, papers }
      );
      
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: data.answer,
        references: data.references 
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: `Error generating response: ${err.message}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        className={styles.fab} 
        onClick={() => setIsOpen(true)}
        aria-label="Open Contextual Chat"
      >
        <span className={styles.fabIcon}>💬</span>
        <span className={styles.fabText}>Ask Context</span>
      </button>
    );
  }

  return (
    <div className={styles.chatPanel}>
      <div className={styles.header}>
        <div>
          <Heading level="h4">Contextual Chat</Heading>
          <Text size="small" className={styles.subtitle}>Grounded in your active research query</Text>
        </div>
        <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
      </div>
      
      <div className={styles.messageList}>
        {messages.map(msg => (
          <div key={msg.id} className={`${styles.messageWrapper} ${msg.role === 'user' ? styles.wrapperUser : styles.wrapperAssistant}`}>
            <div className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.assistantMsg}`}>
              <Text size="small">{msg.content}</Text>
              {msg.references && msg.references.length > 0 && (
                <div className={styles.references}>
                  <Text size="small" weight="semibold">Sources:</Text>
                  <div className={styles.refList}>
                    {msg.references.map((ref, idx) => (
                      <span key={idx} className={styles.refBadge}>{ref.substring(0, 8)}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className={`${styles.messageWrapper} ${styles.wrapperAssistant}`}>
            <div className={`${styles.message} ${styles.assistantMsg}`}>
              <Text size="small" className={styles.typing}>Thinking...</Text>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className={styles.inputArea}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this topic..."
          className={styles.input}
          disabled={isLoading}
        />
        <ActionButton type="submit" disabled={!input.trim() || isLoading} size="small">
          Send
        </ActionButton>
      </form>
    </div>
  );
}
