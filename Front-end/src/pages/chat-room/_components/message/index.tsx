import { useUserContext } from '../../../../context/userContext';
import style from './index.module.css';

export interface message {
    author: {
        id: string;
        name: string
    }
    id: string;
    content: string;
    createdAt: string;
}

interface props {
    data: message;
}

export function Message({ data }: props) {
    const { user } = useUserContext();
    const date = new Date(data.createdAt);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')
        }/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')
        }`;

    return (
        <div className={style.msgContainer}>
            <div className={user?.id === data.author.id ? style.messageRight : style.messageLeft}>
                <p className={style.userName}>{data.author.name}</p>
                <p className={style.message}>{data.content}</p>
                <p className={style.date}>{formattedDate}</p>
            </div>
        </div>
    );
}