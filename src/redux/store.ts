import { configureStore } from "@reduxjs/toolkit";
import {authReducer} from "@/redux/slices/auth-slice";
import { serverReducer } from "./slices/server-slice";
import { conversationReducer } from "./slices/conversation-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    server: serverReducer,
    conversation : conversationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
