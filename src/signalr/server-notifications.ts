// src/signalr/server-notifications.ts
import { serverSignalRService } from "@/lib/signalr-service";
import { useDispatch, useSelector } from "react-redux";
import { deleteServerSuccess } from "@/redux/slices/server-slice";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useServerNotifications = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const servers = useSelector((state: RootState) => state.server.servers);

  const setupListeners = () => {
    serverSignalRService.on("ReceiveServerDeleted", (deletedServerId) => {
      const isDeleted = servers.some((server) => server.id === deletedServerId);
      dispatch(deleteServerSuccess(deletedServerId));
      if (isDeleted) {
        toast.error("The server you were in has been deleted.");
        router.replace("/");
      }
    });
  };

  const cleanup = () => {
    serverSignalRService.off("ReceiveServerDeleted");
  };

  return { setupListeners, cleanup };
};