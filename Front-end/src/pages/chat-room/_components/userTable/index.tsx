import style from './index.module.css';
import { User } from './_components/user';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { socket } from '../../../../webSocket/socket';

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
    const ref = useRef<HTMLDivElement>(null);
    const [users, setUsers] = useState<user[]>([]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setUserTableIsVisible(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setUserTableIsVisible]);

    useEffect(() => {
        async function fetchUsers() {
            const response = await fetch(`${import.meta.env.VITE_BACK_END_ENDPOINT}/user`, {
                method: 'GET',
                credentials: 'include'
            });
            const result = await response.json();
            setUsers(result.data);

            socket.on('status-online', handleStatusOnline);
            socket.on('status-offline', handleStatusOffline);
        }

        const handleStatusOnline = (payload: { id: string; status: string }) => {
            setUsers(prevUsers => prevUsers.map(user =>
                user.id === payload.id ? { ...user, status: payload.status } : user
            ));
        };

        const handleStatusOffline = (payload: { id: string; status: string }) => {
            setUsers(prevUsers => prevUsers.map(user =>
                user.id === payload.id ? { ...user, status: payload.status } : user
            ));
        };

        fetchUsers();

        return () => {
            socket.off('status-online', handleStatusOnline);
            socket.off('status-offline', handleStatusOffline);
        };
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
                    ref={ref}
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