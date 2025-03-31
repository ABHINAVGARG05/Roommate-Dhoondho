import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import './ChatWindow.css';

const ChatWindow = ({ chatId, otherUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const profileData = JSON.parse(localStorage.getItem('profile'));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = [];
      snapshot.forEach((doc) => {
        newMessages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(newMessages);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        text: newMessage,
        senderId: profileData?.user?._id,
        senderName: profileData?.user?.firstname,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>{otherUser.firstname}</h3>
        <button onClick={onClose} className="close-button">×</button>
      </div>
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.senderId === profileData?.user?._id ? 'sent' : 'received'
            }`}
          >
            <div className="message-content">{message.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow; 