import style from './index.module.css';
import { useForm, type FieldErrors } from 'react-hook-form';
import chatRoomImg from '../../assets/chat-rom-image.jpg';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from "framer-motion";
import { photoArray } from '../../storage/profilePhotos';

type SignUpForm = {
    name: string;
    email: string;
    password: string;
}

export function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [serverError, setServerError] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<SignUpForm>();

    const onSubmit = async (data: SignUpForm) => {
        const response = await fetch(`${import.meta.env.VITE_BACK_END_ENDPOINT}/auth/register`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                password: data.password,
                profilePhoto: photoArray[Math.floor(Math.random() * photoArray.length)].id
            })
        });

        switch (response.status) {
            case 201:
                setName("");
                setEmail("");
                setPassword("");
                setServerError(false);
                navigate('/me');
                break;
            case 409:
                setError("email", {
                    type: "manual",
                    message: "This email is already in use"
                });
                setEmail("");
                break;
            default:
                setName("");
                setEmail("");
                setPassword("");
                setServerError(!serverError);
                break;
        }
    }

    const onError = (errors: FieldErrors<SignUpForm>) => {
        if (errors.name) {
            setName("");
        }
        if (errors.email) {
            setEmail("");
        }
        if (errors.password) {
            setPassword("");
        }
    }

    return (
        <>
            <main className={style.main}>
                <div className={style.mainContainer}>
                    <img
                        className={style.chatRoomImg}
                        src={chatRoomImg}
                        alt="Chat room"
                    />
                    <form
                        onSubmit={handleSubmit(onSubmit, onError)}
                        className={style.form}
                    >
                        <h1>Create your Account</h1>
                        <div className={style.containerInputs}>
                            <input
                                className={errors.name ? style.inputErro : ''}
                                type="text"
                                value={name}
                                {...register("name", {
                                    required: "Name is required",
                                    pattern: {
                                        value: /\S+/,
                                        message: "Name cannot be empty or only spaces"
                                    }
                                })}
                                placeholder={errors.name ? errors.name.message : 'User name'}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                className={errors.email ? style.inputErro : ''}
                                type="text"
                                value={email}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^\s*[^\s@]+@[^\s@]+\.[^\s@]+\s*$/,
                                        message: "Invalid email"
                                    }
                                })}
                                placeholder={errors.email ? errors.email.message : 'E-mail'}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                className={errors.password ? style.inputErro : ''}
                                type="text"
                                value={password}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 8, message: "Min 8 characters" },
                                    pattern: {
                                        value: /^\S+$/,
                                        message: "Password cannot contain spaces",
                                    },
                                })}
                                placeholder={errors.password ? errors.password.message : 'Password'}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <AnimatePresence>
                            {serverError &&
                                <motion.p
                                    key="server-error"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.3 }}
                                    className={style.error}
                                >
                                    Error creating account!<br />
                                    Please try again later.
                                </motion.p>
                            }
                        </AnimatePresence>
                        <div className={style.containerButtons}>
                            <button type="submit">
                                Sign-up
                            </button>
                            <p>Or</p>
                            <button
                                type="button"
                                onClick={() => navigate("/auth/login")}
                            >
                                Sign-in
                            </button>
                        </div>
                    </form>
                </div >
            </main >
        </>
    )
}