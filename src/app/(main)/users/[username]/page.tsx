import { validateRequest } from "@/auth"
import FollowButton from "@/components/other/FollowButton"
import FollowerCount from "@/components/other/FollowerCount"
import TrendsSidebar from "@/components/other/TrendsSidebar"
import UserAvatar from "@/components/other/UserAvatar"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma"
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types"
import { formatNumber } from "@/lib/utils"
import { formatDate } from "date-fns"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import UserPosts from "./UserPosts"
import Linkify from "@/components/other/Linkify"
import EditProfileButton from "@/app/api/users/username/[username]/EditProfileButton"


interface PageProps {
    params: { username: string }
}



const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();

  return user;
});


export async function generateMetadata({
  params: { username },
}: PageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}


export default async function Page ({ params: { username } }: PageProps) {

        const { user: loggedInUser } = await validateRequest()

        if ( !loggedInUser ) {
            return (
                <p className=" text-destructive mt-10 text-center ">
                    You&apos;re not authorized to view this page.
                </p>
            )
        }


    const user = await getUser(username, loggedInUser.id)

    console.log(user.displayName, loggedInUser.displayName)

    return (
        <main className=" flex w-full min-w-0 gap-5 ">
            <div className=" w-full min-w-0 space-y-5 ">
                 <UserProfile user={user} loggedInUserId={loggedInUser.id} />
                 <div className=" bg-card  p-5 border-2 border-violet-500 dark:border-gray-300/80 shadow-sm  ">
                    <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s posts
          </h2>
        </div>
        
        <UserPosts userId={user.id} loggedInUser={loggedInUser.id} />
      </div>
      <TrendsSidebar />
        </main>
    )



}





interface UserProfileProps {
    user: UserData,
    loggedInUserId: string,
}


async function UserProfile ({ user, loggedInUserId }: UserProfileProps) {

     const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

    return (
        <div className=" py-7 w-full border mt-2 dark:border-violet-500 space-y-7 rounded-2xl bg-card p-5 shadow-sm  ">
            <UserAvatar avatarUrl={user.avatarUrl} size={200} className=" mx-auto size-full max-h-[230px] max-w-56 rounded-full " />

            
            <div className="flex flex-wrap gap-3 sm:flex-nowrap ">
                <div className=" me-auto space-y-3 ">
                    <div>
                        <h1 className=" text-3xl font-bold " >{user.username}</h1>
                        <div className=" text-muted-foreground ">@{user.username}</div>
                    </div>

                    <div className=""> 
           Member since { formatDate(user.createdAt, "MMM, d, yyyy") }
                 </div>

                 <div className="flex items-center gap-3 ">
                    <span>
                        Posts: {' '}
                        <span className=" font-semibold ">
                            { formatNumber(user._count.posts)}
                        </span>
                    </span>

                    <FollowerCount userId={user.id} initialState={followerInfo} />

                 </div>

                </div>

         {user.id === loggedInUserId ? (
           <EditProfileButton user={user} />
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}


            </div>

            {user.bio && (
        <>
          <div className=" w-full h-[1px] bg-gray-400 " />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
 

        </div>
    )


}