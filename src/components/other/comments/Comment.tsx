import { CommentData } from "@/lib/types";
import UserTooltip from "../UserTooltip";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { formatRelativeDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSession } from "@/app/(main)/SessionProvider";
import CommentMoreButton from "./CommentMoreButton";


interface CommentProps {
    comment: CommentData;
}


export default function Comment ({ comment }: CommentProps) {
    

    const { user } = useSession();

     const [relativeDate, setRelativeDate] = useState<string>(() => {
        return comment.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    });

    
    useEffect(() => {
        setRelativeDate(formatRelativeDate(comment.createdAt));
    }, [comment.createdAt]);

    return (
        <div className=" flex items-center gap-3 py-3 group/comment ">
            <span className=" hidden sm:inline ">
                <UserTooltip user={comment.user} >
                    <Link href={`/users/${comment.user.username}`} >

                     <UserAvatar avatarUrl={ comment.user.avatarUrl } size={40} />
                    
                    </Link>
                </UserTooltip>
            </span>
            <div className="">
                <div className="flex items-center gap-1 text-sm ">

                <UserTooltip user={comment.user} >
                    <Link href={`/users/${comment.user.username}`}
                      className=" font-medium hover:underline "
                    >

                      { comment.user.displayName }
                    
                    </Link>
                </UserTooltip>

                <span className=" text-muted-foreground text-[13px] mt-1 mb-1 ml-1 "
                 suppressHydrationWarning
                >
                    { relativeDate }
                </span>

                </div>

                { comment.content }

            </div>


            { comment.user.id === user.id && (
                <CommentMoreButton comment={comment} className=" ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100 "  />
            ) }

        </div>
    )

}