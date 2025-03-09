# Discord Clone

This is a **Discord-like** application built with [Next.js](https://nextjs.org), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/).  
Users can create and join servers, manage roles, send messages (text, voice, and video), and interact in real-time.

## Features

- **Server Management**: Users can create, join, and delete servers.
- **Channel System**: Text, voice, and video channels can be created or removed.
- **Messaging System**: Users can send direct messages and server messages.
- **Roles & Permissions**:
  - **Admin**: Can manage roles, delete messages, remove channels, and kick users.
  - **Moderator**: Can create channels and delete only their own channels.
  - **Guest**: Can send messages (text, voice, video) but has limited permissions.
- **Real-time Communication**: Powered by **SignalR** and **LiveKit**.
- **Modern UI/UX**: Built with **ShadCN**, **Lucide Icons**, and **Tailwind CSS**.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org), [React](https://react.dev), [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/), [Zustand](https://github.com/pmndrs/zustand)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Real-time Communication**: [SignalR](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction), [LiveKit](https://livekit.io/)
- **UI Components**: [ShadCN](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/)
- **API Requests**: [Axios](https://axios-http.com/)
- **Emoji Support**: [Emoji Mart](https://github.com/missive/emoji-mart)
