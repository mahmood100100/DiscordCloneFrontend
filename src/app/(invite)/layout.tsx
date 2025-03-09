"use client"
import { useAuth } from '@/hooks/use-auth'
import React from 'react'

const InviteLayout = ({ children }: { children: React.ReactNode }) => {
    const { accessToken } = useAuth();

    if(accessToken) {
        return <>{children}</>
    }

    return null;

}

export default InviteLayout