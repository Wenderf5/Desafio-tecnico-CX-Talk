import style from './index.module.css';
import { User } from './_components/user';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { chatRoomWebsocket } from '../../../../webSocket/chatRoomWebsocket';

interface props {
    setUserTableIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface user {
    id: string;
    photo: string;
    name: string;
    status: string;
}

export function UserTable({ setUserTableIsVisible }: props) {
    const userTableElementRef = useRef<HTMLDivElement>(null);
    const [users, setUsers] = useState<user[]>([]);

    useEffect(() => {
        async function fetchUsers() {
            const response = await fetch("http://localhost:8080/user", {
                method: 'GET',
                credentials: 'include'
            });
            const result = await response.json();

            if (!response.ok) {
                return;
            }
            setUsers(result.data);
        }
        fetchUsers();

        const handleStatusOnline = (payload: { userId: string, status: string }) => {
            setUsers(prevUsers => prevUsers.map(user =>
                user.id === payload.userId ? { ...user, status: payload.status } : user
            ));
        }
        chatRoomWebsocket.on('status-online', handleStatusOnline);

        const handleStatusOffline = (payload: { userId: string, status: string }) => {
            setUsers(prevUsers => prevUsers.map(user =>
                user.id === payload.userId ? { ...user, status: payload.status } : user
            ));
        }
        chatRoomWebsocket.on('status-offline', handleStatusOffline);

        const handleClickOutside = (e: MouseEvent) => {
            if (userTableElementRef.current && !userTableElementRef.current.contains(e.target as Node)) {
                setUserTableIsVisible(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            chatRoomWebsocket.off('status-online', handleStatusOnline);
            chatRoomWebsocket.off('status-offline', handleStatusOffline);
            document.removeEventListener('click', handleClickOutside);
        }
    }, []);

    return (
        <div className={style.overlay}>
            <motion.div
                key="user-table"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.2 }}
                style={{ height: "100%" }}
            >
                <div
                    ref={userTableElementRef}
                    className={style.userTable}
                >
                    {users?.map((user) => (
                        <User key={user.id} userData={user} />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}