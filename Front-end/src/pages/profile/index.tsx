import style from './index.module.css';
import { useUserContext } from '../../context/userContext';
import { photoArray } from '../../storage/profilePhotos';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { LogOut } from 'lucide-react';

export function Profile() {
    const { user } = useUserContext();
    const userPhoto = photoArray.find(photo => photo.id === user?.photo);
    const [name, setName] = useState(user?.name);
    const [error, setError] = useState(false);
    const [changeNameSuccessMsg, setChangeNameSuccessMsg] = useState(false);
    const navigate = useNavigate();

    async function changeName() {
        const response = await fetch(`${import.meta.env.VITE_BACK_END_ENDPOINT}/user/change-name`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                name: name
            })
        });

        if (!response.ok) {
            setError(true);
            setTimeout(() => {
                setError(false);
            }, 2000);
            return;
        }

        setChangeNameSuccessMsg(true);
        setTimeout(() => {
            setChangeNameSuccessMsg(false);
        }, 2000);
    }

    async function logout() {
        const response = await fetch(`${import.meta.env.VITE_BACK_END_ENDPOINT}/auth/logout`, {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            navigate("/auth/login");
        }
    }

    return (
        <>
            <main className={style.main}>
                <div className={style.mainContainer}>
                    <div className={style.logout}>
                        <button onClick={logout}>
                            <LogOut
                                color='red'
                            />
                        </button>
                    </div>
                    <img
                        className={style.profileImage}
                        src={userPhoto?.photo}
                        alt="profile image"
                    />
                    <div className={style.containerInputName}>
                        <label
                            htmlFor="inputName"
                        >
                            Name:
                        </label>
                        <div>
                            <input
                                type="text"
                                id="inputName"
                                placeholder='Choose a username'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <button onClick={changeName}>Change</button>
                        </div>
                    </div>
                    <AnimatePresence>
                        {error &&
                            <motion.p
                                key="change-name-error"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.3 }}
                                className={style.changeNameError}
                            >
                                Error updating name!<br />
                                Please try again later.
                            </motion.p>
                        }
                    </AnimatePresence>
                    <AnimatePresence>
                        {changeNameSuccessMsg &&
                            <motion.p
                                key="change-name-error"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.3 }}
                                className={style.changeNameSuccess}
                            >
                                Username updated successfully
                            </motion.p>
                        }
                    </AnimatePresence>
                    <button
                        className={style.joinButton}
                        onClick={() => navigate("/chat")}
                    >
                        Join the chat
                    </button>
                </div>
            </main>
        </>
    );
}