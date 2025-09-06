import style from './index.module.css';
import { UserTable } from './_components/userTable';
import { CircleX, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { Message, type message } from './_components/message';
import { useUserContext } from '../../context/userContext';
import { chatRoomWebsocket } from '../../webSocket/chatRoomWebsocket';

export function ChatRoom() {
    const { user } = useUserContext();
    const [userTableIsVisible, setUserTableIsVisible] = useState(false);
    const [messages, setMessages] = useState<message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const chatRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function getLastMessages() {
            const response = await fetch("http://localhost:8080/chat-room/message", {
                method: 'GET',
                credentials: 'include'
            });
            const result = await response.json();
            setMessages(result);
        }
        getLastMessages();

        chatRoomWebsocket.emit('status-online', { userId: user?.id });

        const handleSendMessage = (message: message) => {
            setMessages(prev => [...prev, message]);
        }
        chatRoomWebsocket.on("send-message", handleSendMessage);

        const handleBeforeUnload = () => {
            chatRoomWebsocket.emit('status-offline', { userId: user?.id });
        }
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            chatRoomWebsocket.off("send-message", handleSendMessage);
            chatRoomWebsocket.emit('status-offline', { userId: user?.id });
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, []);

    const handleSend = () => {
        if (!newMessage.trim()) {
            return;
        }

        const payload = {
            authorId: user?.id,
            content: newMessage
        }

        chatRoomWebsocket.emit("send-message", payload);
        setNewMessage("");
    };

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <>
            <main className={style.main}>
                <div className={style.mainContainer}>
                    <div className={style.containerButtons}>
                        <button
                            onClick={() => navigate("/me")}
                        >
                            <CircleX color='red' />
                        </button>
                        <button
                            onClick={() => setUserTableIsVisible(true)}
                        >
                            <Users />
                        </button>
                    </div>
                    <div className={style.chatContainer}>
                        <div className={messages.length < 1 ? style.emptyChat : style.chat} ref={chatRef}>
                            {messages.length < 1 ?
                                <p>There are no messages in the chat yet!<br />
                                    Be the first to interact.</p> : (
                                    messages.map((message) => (
                                        <Message key={message.id} data={message} />
                                    ))
                                )}
                        </div>
                        <div className={style.inputSendMsg}>
                            <input
                                type="text"
                                placeholder='Enter your message'
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSend();
                                    }
                                }}
                            />
                            <button onClick={handleSend}>send</button>
                        </div>
                    </div>
                    <AnimatePresence>
                        {userTableIsVisible &&
                            <UserTable setUserTableIsVisible={setUserTableIsVisible} />
                        }
                    </AnimatePresence>
                </div>
            </main >
        </>
    );
}