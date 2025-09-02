import style from './index.module.css';
import { useForm, type FieldErrors } from 'react-hook-form';
import chatRoomImg from '../../assets/chat-rom-image.jpg';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';

type SignInForm = {
    email: string;
    password: string;
}

export function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [serverError, setServerError] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<SignInForm>();

    const onSubmit = async (data: SignInForm) => {
        const response = await fetch(`${import.meta.env.VITE_BACK_END_ENDPOINT}/auth/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                email: data.email,
                password: data.password
            })
        });

        switch (response.status) {
            case 200:
                setEmail("");
                setPassword("");
                navigate('/me');
                break;
            case 404:
                setError("email", {
                    type: "manual",
                    message: "E-mail not found"
                });
                setEmail("");
                break;
            case 401:
                setError("password", {
                    type: "manual",
                    message: "Invalid password"
                });
                setPassword("");
                break;
            default:
                setEmail("");
                setPassword("");
                setServerError(!serverError);
                break;
        }
    }

    const onError = (errors: FieldErrors<SignInForm>) => {
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
                        <h1>Login to your Account</h1>
                        <div className={style.containerInputs}>
                            <input
                                className={errors.email ? style.inputErro : ''}
                                type="text"
                                value={email}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" }
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
                                    Error logging in!<br />
                                    Please try again later.
                                </motion.p>
                            }
                        </AnimatePresence>
                        <div className={style.containerButtons}>
                            <button type="submit">
                                Sign-in
                            </button>
                            <p>Or</p>
                            <button
                                type="button"
                                onClick={() => navigate("/auth/register")}
                            >
                                Sign-up
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}