import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useUserContext } from "../context/userContext";

interface AuthProps {
    children: React.ReactNode;
}

export function Auth({ children }: AuthProps) {
    const { setUser } = useUserContext();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACK_END_ENDPOINT}/auth/validate-session`, {
                    credentials: "include",
                });

                if (!response.ok) {
                    navigate("/auth/login");
                }

                const result = await response.json();
                setUser(result.data);
                setIsAuthenticated(true);
            } catch (error) {
                navigate("/auth/login");
            }
        }
        fetchUser();
    }, []);

    return (isAuthenticated ? children : null);
}