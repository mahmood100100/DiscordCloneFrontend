import InitialModal from "@/components/modals/initial-modal";
import { getServersForUserProfileApiCall } from "@/lib/server";
import { setServers } from "@/redux/slices/server-slice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function SetupPage() {
    const { user } = useSelector((state: any) => state.auth);
    const { servers } = useSelector((state: any) => state.server);
    const router = useRouter();
    const dispatch = useDispatch();
    const [serverLoading, setServerLoading] = useState(true);

    useEffect(() => {
        const fetchServers = async () => {
            if (!user?.profile?.id) return;
            try {
                const result = await getServersForUserProfileApiCall(user.profile.id);
                if (result.success) {
                    dispatch(setServers(result.servers));
                    if (result.servers.length > 0) {
                        router.replace(`/servers/${result.servers[0].id}`);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch servers", error);
            } finally {
                setServerLoading(false);
            }
        };
        fetchServers();
    }, [user, dispatch, router]);

    if (serverLoading && servers.length === 0) {
        return "fetching the servers...";
    }

    return (
        <div>
            {!serverLoading && servers.length === 0 && (
                <InitialModal />
            )}
        </div>
    );
}
