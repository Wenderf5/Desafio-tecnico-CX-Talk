import style from './index.module.css';
import { UserTable } from './_components/userTable';
import { CircleX, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { Message, type message } from './_components/message';
import { useUserContext } from '../../context/userContext';
import { socket } from '../../webSocket/socket';

export function ChatRoom() {
    const [userTableIsVisible, setUserTableIsVisible] = useState(false);
    const navigate = useNavigate();
    const { user } = useUserContext();
    const [messages, setMessages] = useState<message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function getLastMessages() {
            const response = await fetch(`${import.meta.env.VITE_BACK_END_ENDPOINT}/chat-room/message`, {
                method: 'GET',
                credentials: 'include'
            });
            const result = await response.json();
            setMessages(result);
        }
        getLastMessages();

        socket.emit('status-online', { userId: user?.id });

        const handleSendMessage = (message: message) => {
            setMessages(prev => [...prev, message]);
        };

        socket.on("send-message", handleSendMessage);

        const handleBeforeUnload = () => {
            socket.emit('status-offline', { userId: user?.id });
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            socket.off("send-message", handleSendMessage);
            socket.emit('status-offline', { userId: user?.id });
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const handleSend = () => {
        if (!newMessage.trim()) return;

        const payload = {
            authorId: user?.id,
            content: newMessage
        };

        socket.emit("send-message", payload);
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