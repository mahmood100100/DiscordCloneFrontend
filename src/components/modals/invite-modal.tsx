import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModal } from "@/hooks/use-modal-store";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { generateNewInviteCodeApiCall } from "@/lib/server";
import { useDispatch } from "react-redux";
import { updateServerSuccess } from "@/redux/slices/server-slice";

const InviteModal = () => {
    const origin = useOrigin();
    const { isOpen, onClose, type, data, onOpen } = useModal();
    const isModalOpen = isOpen && type === "invite";
    const dispatch = useDispatch();
    const { server } = data;
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
    const [isCopied, setIsCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(inviteUrl);
            setIsCopied(true);

            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy text: ", error);
        }
    };

    const onGenerateNewLink = async () => {
        try {
            setIsLoading(true);

            if (!server) {
                return;
            }

            const response = await generateNewInviteCodeApiCall(server.id);

            if (response.success) {
                const updatedServer = {
                    ...server,
                    inviteCode: response.inviteCode,
                };

                onOpen("invite", { server: updatedServer });

                dispatch(updateServerSuccess(updatedServer));
            } else {
                console.log(response.error);
            }
        } catch (error) {
            console.error("Error generating new invite code:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Server Invite Link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input
                            disabled={isLoading}
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                            value={inviteUrl}
                            readOnly
                        />
                        <Button onClick={onCopy} size="icon" disabled={isLoading}>
                            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                    <Button
                        className="text-xs mt-4 text-zinc-500"
                        variant="link"
                        size="sm"
                        onClick={onGenerateNewLink}
                        disabled={isLoading}
                    >
                        Generate a new Link
                        <RefreshCw className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InviteModal;