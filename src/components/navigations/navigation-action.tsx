import React from 'react';
import { Plus } from 'lucide-react';
import ActionTooltip from '@/components/ui/action-tooltip';
import { useModal } from '@/hooks/use-modal-store';

const NavigationAction = () => {

    const { onOpen } = useModal();

    return (
        <div>
            <ActionTooltip side="right" align="center" label="Add a new Server">
                <div onClick={() => { onOpen("createServer") }} className="group flex items-center justify-center cursor-pointer">
                    <div className="flex h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] 
                                    transition-all overflow-hidden justify-center items-center
                                    bg-white dark:bg-neutral-800 group-hover:bg-emerald-500">
                        <Plus className="text-emerald-500 group-hover:text-white transition-all" size={25} />
                    </div>
                </div>
            </ActionTooltip>
        </div>
    );
};

export default NavigationAction;
