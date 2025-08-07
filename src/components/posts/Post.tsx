"use client";

import { PostData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../other/UserAvatar";
import { cn, formatRelativeDate } from "@/lib/utils";
import { useSession } from "@/app/(main)/SessionProvider";
import PostMore from "./PostMore";
import Linkify from "../other/Linkify";
import UserTooltip from "../other/UserTooltip";
import { Media } from "@prisma/client";
import Image from "next/image";
import LikeButton from "../other/LikeButton";
import BookmarkButton from "../other/BookmarkButton";
import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import Comments from "../other/comments/Comments";

interface PostProps {
    post: PostData;
}



export default function Post({ post }: PostProps) {
    const { user } = useSession();
    const [showComments, setShowComments] = useState(false);
    const [relativeDate, setRelativeDate] = useState<string>(() => {
        // Render static date on server to avoid mismatch
        return post.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    });
    useEffect(() => {
        setRelativeDate(formatRelativeDate(post.createdAt));
    }, [post.createdAt]);

    return (
        <article className=" group/post space-y-4 dark:border-violet-500 border rounded-2xl bg-card p-5 shadow-sm ">
            <div className="flex justify-between gap-3 ">
                <div className="flex flex-wrap gap-3 ">
                    <UserTooltip user={post.user} >
                        <Link href={`/users/${post.user.username}`} >
                            <UserAvatar avatarUrl={post.user.avatarUrl} />
                        </Link>
                    </UserTooltip>
                    <div>
                        <UserTooltip user={post.user} >
                            <Link 
                                href={`/users/${post.user.username}`} 
                                className=" block font-medium hover:underline"
                            >
                                { post.user.displayName }
                            </Link>
                        </UserTooltip>
                        <Link
                            href={`/posts/${post.id}`}
                            className=" block text-sm text-muted-foreground hover:underline"
                            suppressHydrationWarning
                        >
                            {relativeDate}
                        </Link>
                    </div>
                </div>
                {post.user.id === user.id && (
                    <PostMore post={post} className=" opacity-0 transition-opacity group-hover/post:opacity-100 " />
                )}
            </div>
            <Linkify>
                <div className=" whitespace-pre-line break-words pt-1 " >
                    { post.content }
                </div>
            </Linkify>
            {!!post.attachments?.length && (
                <MediaPreviews attachments={post.attachments} />
            )}
            <div className=" h-[1px] w-full bg-gray-400 " />
            
            <div className=" flex justify-between gap-5 ">
                <div className="flex items-center gap-4 ">
                    <LikeButton postId={post.id} initialState={{
                        likes: post._count.likes,
                        isLikedByUser: post.likes.some(like => like.userId === user.id)
                    }} />
                    <CommentButton post={post} onClick={() => setShowComments(!showComments)} />
                </div>
                <BookmarkButton
                    postId={post.id}
                    initialState={{
                        isBookmarkedByUser: post.bookmarks.some(bookmark => bookmark.userId === user.id)
                    }}
                />
            </div>
            {showComments && <Comments post={post} />}
        </article>
    );
}
 





interface MediaPreviewsProps {
    attachments: Media[];
}



function MediaPreviews({ attachments }: MediaPreviewsProps) {
    return (
        <>

          <div className={ cn(" flex flex-col  h-full w-full ", attachments.length > 1 && " sm:grid  gap-3 sm:grid-cols-2 ") }>
            {attachments.map((media) => (
                <MediaPreview key={media.id} media={media} />
            ))} 
          </div>

        </>
    )
}







interface MediaPreviewProps {
    media: Media;
}




function MediaPreview ({ media }: MediaPreviewProps) {

    if ( media.type === "IMAGE" ) {
        return (
            <Image
               src={media.url}
               alt="Attachments"
               priority
                width={500}
                height={500}
                className=" border size-fit object-contain w-full  "
            />
        )
    }

    

    
    if ( media.type === "VIDEO" ) {
        return (
           <div>
              <video controls src={media.url} className=" border w-full size-fit object-cover max-h-[30rem] ">

              </video>
           </div>
        )
    }


    return <p className=" text-destructive text-center " > Unsupported Media type. </p>
    
}






interface CommentButtonProps {
    post: PostData;
    onClick: () => void;
}



function CommentButton ({ post, onClick }: CommentButtonProps) {

    return (
        <button type="button" className=" flex items-center gap-2 " onClick={onClick} >

            <MessageSquare size={20} className="mt-1 hover:text-primary hover:fill-primary "  />

            <span className=" text-sm font-medium tabular-nums ">
                { post._count.Comment } {" "}

                <span className=" hidden sm:inline ">comments</span>

            </span>

        </button>
    )
}