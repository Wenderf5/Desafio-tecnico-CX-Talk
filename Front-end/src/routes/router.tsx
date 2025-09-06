import { createBrowserRouter, redirect } from "react-router";
import { App } from "../App";
import { SignUp } from "../pages/sign-up";
import { SignIn } from "../pages/sign-in";
import { Profile } from "../pages/profile";
import { Auth } from "../auth";
import { verifySession } from "../auth/verifySession";
import { ChatRoom } from "../pages/chat-room";

export const router = createBrowserRouter([
    {
        path: "/auth",
        element: <App />,
        children: [
            {
                path: "register",
                element: <SignUp />,
                loader: async () => {
                    const isAuthenticated = await verifySession();
                    if (isAuthenticated) {
                        return redirect('/me');
                    }
                }
            },
            {
                path: "login",
                element: <SignIn />,
                loader: async () => {
                    const isAuthenticated = await verifySession();
                    if (isAuthenticated) {
                        return redirect('/me');
                    }
                }
            }
        ]
    },
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                loader: async () => redirect('/me')
            },
            {
                path: "me",
                element: (
                    <Auth>
                        <Profile />
                    </Auth>
                )
            },
            {
                path: "chat",
                element: (
                    <Auth>
                        <ChatRoom />
                    </Auth>
                )
            }
        ]
    }
])