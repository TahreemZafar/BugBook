"use client";


import kyInstance from "@/lib/ky";
import { UserData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";
import Link from "next/link";
import { PropsWithChildren } from "react";
import UserTooltip from "./UserTooltip";


interface UserLinkWithTooltipProps extends PropsWithChildren {
    username: string;
}


export default function UserLinkWithTooltip ({ username, children }: UserLinkWithTooltipProps ) {

    const { data, error, isLoading } = useQuery({
        queryKey: ["user-data", username],
        queryFn: () => kyInstance.get(`/api/users/username/${username}`).json<UserData>(),
        retry(failureCount, error) {
            if ( error instanceof HTTPError && error.response.status === 404 ) {
                return false
            }
            return failureCount > 3
        },
        staleTime: Infinity,
    })

    if (error) {
        console.error("UserLinkWithTooltip error for username:", username, error);
    }

    if (isLoading) {
        return (
            <span className="font-medium text-primary opacity-50">{children}</span>
        );
    }

    if (!data) {
        return (
            <Link href={`/users/${username}`} className="font-medium text-primary hover:underline" >

                { children }
            
            </Link>
        )
    }


      return (

        <UserTooltip user={data} >

            <Link href={`/users/${username}`} className="font-medium text-primary hover:underline" >

                { children }
            
            </Link>

            </UserTooltip>

        )


}