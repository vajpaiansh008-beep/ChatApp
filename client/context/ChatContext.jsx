import { createContext, useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUserState] = useState(null);
  const [unseenMessage, setUnseenMessage] = useState({});

  const { socket, axios } = useContext(AuthContext);
  const selectedUserRef = useRef(null);

  const setSelectedUser = (user) => {
    selectedUserRef.current = user;
    setSelectedUserState(user);
  };

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.user || []);
        setUnseenMessage(data.unseenMessages || {});
      }
    } catch (error) {
      toast.error(
        error.response?.data?.msg || error.message || "Failed to fetch users",
      );
    }
  };

  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.msg ||
          error.message ||
          "Failed to fetch messages",
      );
    }
  };

  const sendMessage = async (messageData) => {
    // FIXED: Read directly from the updated mutable ref to avoid async state closure lags
    const currentChatUser = selectedUserRef.current;
    if (!currentChatUser?._id) return;

    try {
      const { data } = await axios.post(
        `/api/messages/send/${currentChatUser._id}`,
        messageData,
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.msg || error.message || "Failed to send message",
      );
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const currentChatPartner = selectedUserRef.current;

      const incomingSenderId =
        (newMessage.senderId || newMessage.sender)?._id ||
        newMessage.senderId ||
        newMessage.sender;

      const activePartnerId =
        currentChatPartner?._id?.toString() || currentChatPartner?.toString();

      if (
        activePartnerId &&
        incomingSenderId &&
        incomingSenderId.toString() === activePartnerId.toString()
      ) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`).catch(() => {});
      } else {
        setUnseenMessage((prev) => {
          const targetId = incomingSenderId?.toString();
          if (!targetId) return prev;
          return {
            ...prev,
            [targetId]: (prev[targetId] || 0) + 1,
          };
        });
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, axios]);

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    setMessages,
    sendMessage,
    setSelectedUser,
    unseenMessage,
    setUnseenMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
