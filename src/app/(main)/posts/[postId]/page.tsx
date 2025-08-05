import { validateRequest } from "@/auth";
import FollowButton from "@/components/other/FollowButton";
import Linkify from "@/components/other/Linkify";
import UserAvatar from "@/components/other/UserAvatar";
import UserTooltip from "@/components/other/UserTooltip";
import Post from "@/components/posts/Post";
import prisma from "@/lib/prisma";
import { getPostDataInclude, UserData } from "@/lib/types";
import { log } from "console";
import { Loader2, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";


interface PageProps {
    params: {
        postId: string; 
    }
}


const getPost = cache(async (postId: string, loggedInUserId: string) => {   
    
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        },
        include: getPostDataInclude(loggedInUserId)
    })

    if ( !post ) notFound();

    return post;
    
})



export async function generateMetadata({ params: { postId } }: PageProps) {

    const { user } = await validateRequest();

    if ( !user ) return {};

    const post = await getPost(postId, user.id);

    return {
        title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
    }

}


export default async function Page({ params: { postId } }: PageProps) {

    const { user } = await validateRequest();

    
        if ( !user ) {
            return (
                <p className=" text-destructive mt-10 text-center ">
                    You&apos;re not authorized to view this page.
                </p>
            )
        }

    const post = await getPost(postId, user.id);

    return (
        <main className=" flex  w-full min-w-0 gap-5 " >
            <div className=" w-full mt-2 min-w-0 space-y-5 ">

                <Post post={post} />

            </div>

            <div className=" sticky top-[5.25rem] hidden h-fit w-72 xl:w-[19rem] flex-none lg:block ">

                <Suspense fallback={ <Loader2 className=" mx-auto animate-spin items-center text-violet-500 " /> } >

                <UserInfoSideBar user={post.user} />

                </Suspense>

            </div>

        </main>
    );


}




interface UserInfoSideBarProps {
    user: UserData;
}


 async function UserInfoSideBar({ user }: UserInfoSideBarProps) {

    const { user: loggedInUser } = await validateRequest();

    if ( !loggedInUser ) return 
       

    return (
        <div className=" rounded-2xl border dark:border-violet-500 bg-card p-5 shadow-sm space-y-5 ">

            <div className=" text-xl font-bold "> About this User. </div>

            <UserTooltip user={user}>

                 <Link href={`/users/${user.username}`} className=" flex items-center gap-3 ">

                 <UserAvatar avatarUrl={user.avatarUrl} className=" flex-none " />

                 <div className="  ">

                    <p className=" line-clamp-1 break-all font-semibold hover:underline ">
                        { user.displayName }
                    </p>

                    <p className=" line-clamp-1 break-all text-[14px] text-muted-foreground ">
                        @{ user.username }

                    </p>

                 </div>
                    
                </Link>

            </UserTooltip>


            <Linkify>

                <div className=" line-clamp-6 whitespace-pre-line break-words text-muted-foreground ">
                    { user.bio  }
                </div>

            </Linkify>

            {
                loggedInUser.id !== user.id && (
                    <FollowButton 
                        userId={user.id} 
                        initialState={{
                            followers: user._count.followers,
                            isFollowedByUser: user.followers.some(
                                ({ followerId }) => followerId === loggedInUser.id
                            )
                        }}
                     />
                )
            }
               

        </div>
    );
}