// context/UserContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface UserProfile {
    profileImage: string;
    displayName: string;
}

interface UserContextType {
    userProfile: UserProfile;
    setUserProfile: (profile: UserProfile) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userProfile, setUserProfile] = useState<UserProfile>({
        profileImage: '',
        displayName: '',
    });

    return (
        <UserContext.Provider value={{ userProfile, setUserProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
