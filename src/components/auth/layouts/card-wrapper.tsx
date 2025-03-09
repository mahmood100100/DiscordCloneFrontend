"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardFooter
} from '@/components/ui/card';
import AuthHeader from '@/components/auth/layouts/auth-header';
import BackButton from '@/components/auth/layouts/back-button';

interface CardWrapperProps {
    label: string;
    title: string;
    cardClassName?: string;
    cardContentClassName?: string;
    backButtonHref: string;
    backButtonLabel: string;
    children: React.ReactNode;
}

const CardWrapper = ({
    label,
    title,
    backButtonHref,
    backButtonLabel,
    cardClassName = '',
    cardContentClassName = '',
    children
}: CardWrapperProps) => {
    return (
        <Card className={`xl:w-4/12 lg:w-5/12 md:w-6/12 sm:w-7/12 w-full bg-[#313338] text-white shadow-xl rounded-lg border border-[#1e1f22] ${cardClassName}`}>
            <CardHeader className="p-4 border-b border-[#1e1f22] text-center">
                <AuthHeader label={label} title={title} className="text-[#f2f3f5]" />
            </CardHeader>
            
            <CardContent className={`py-6 px-5 ${cardContentClassName}`}>
                {children}
            </CardContent>

            <CardFooter className="p-4 flex justify-center border-t border-[#1e1f22]">
                <BackButton 
                    href={backButtonHref} 
                    label={backButtonLabel} 
                    className="text-[#f2f3f5] hover:text-[#ffffff] transition duration-300" 
                />
            </CardFooter>
        </Card>
    );
};

export default CardWrapper;
