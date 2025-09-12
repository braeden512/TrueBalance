"use client";

// this file gives context to other frontend files about what user is logged in and their information
// really important file

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
     redirectIfAuthenticated: (redirectTo?: string) => Promise<void>; 
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) setToken(storedToken);
    }, []);

    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const logout = () => {
        // setLoggingOut is just to make sure navbar disappears at same time as redirect
       
        setLoggingOut(true);
        localStorage.removeItem("token");
        router.push("/login");
        setToken(null);
    };

    const redirectIfAuthenticated = async (redirectTo: string = "/dashboard") => {
        if (!token) return;

        try {
            const res = await fetch(`${apiUrl}/api/dashboard/verify`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                console.log('safe')
                router.push(redirectTo);
            } else {
                console.log("logging out")
                logout(); 
            }
        } catch (err) {
            console.error(err);
            logout();
        }
    };



    const value = {
        token,
        login,
        logout,
        redirectIfAuthenticated,
        isAuthenticated: !!token || loggingOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    // make sure its used in the right context
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};