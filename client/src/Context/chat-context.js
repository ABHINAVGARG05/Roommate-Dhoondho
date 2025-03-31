import React, { createContext, useState, useContext } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [activeChats, setActiveChats] = useState([]);
  const MAX_CHATS = 3;

  const startChat = async (otherUser) => {
    try {
      // Check if chat already exists
      const existingChat = activeChats.find(chat => chat.otherUser._id === otherUser._id);
      if (existingChat) {
        return existingChat;
      }

      // Check chat limit
      if (activeChats.length >= MAX_CHATS) {
        toast.error(`You can only have ${MAX_CHATS} active chats at a time`);
        return null;
      }

      // Create new chat
      const chatData = {
        participants: [otherUser._id],
        createdAt: new Date(),
        lastMessage: null,
        lastMessageTime: null,
      };

      const chatRef = await addDoc(collection(db, 'chats'), chatData);
      const newChat = {
        id: chatRef.id,
        otherUser,
      };

      setActiveChats(prev => [...prev, newChat]);
      return newChat;
    } catch (error) {
      toast.error('Failed to start chat');
      return null;
    }
  };

  const closeChat = (chatId) => {
    setActiveChats(prev => prev.filter(chat => chat.id !== chatId));
  };

  return (
    <ChatContext.Provider value={{ activeChats, startChat, closeChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 