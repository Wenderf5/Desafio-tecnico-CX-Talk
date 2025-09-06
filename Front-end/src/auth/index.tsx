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
                const response = await fetch("http://localhost:8080/auth/validate-session", {
                    credentials: "include",
                });

                if (!response.ok) {
                    navigate("/auth/login");
                    return;
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