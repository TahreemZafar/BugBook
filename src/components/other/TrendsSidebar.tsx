import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import UserAvatar from "./UserAvatar";
import { Button } from "../ui/button";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";
import FollowButton from "./FollowButton";
import { getUserDataSelect } from "@/lib/types";
import UserTooltip from "./UserTooltip";



export default function TrendsSidebar() {
  return (
    <div className=" sticky top-[5.25rem] hidden h-fit md:w-[245px] lg:w-[260px] overflow-y-auto flex-none space-y-5 md:block xl:w-[19rem] " >

         <Suspense fallback={ <Loader2 className=" mx-auto animate-spin text-violet-600 size-8 " /> } >       
        <WhoToFollow />
        <TrendingTopics />
        </Suspense>
    </div>
  )
}





async function WhoToFollow () {

     const { user } = await validateRequest();

     if ( !user ) return null;


     const usersToFollow = await prisma.user.findMany({
         where: {
            NOT: {
                id: user.id
            },
            followers: {
                none: {
                    followerId: user.id
                }
            }
         },
         select: getUserDataSelect(user.id),
         take: 4,
     })


     return (
        <div className=" space-y-5 rounded-2xl bg-card border dark:border-violet-500 p-5 shadow-sm ">
            <div className=" text-xl font-bold ">Who To Follow</div> 
                { usersToFollow.map((user) => (

                    <div key={user.id} className=" flex items-center justify-between gap-3 ">

                      <UserTooltip user={user}  >

                        <Link href={`/users/${user.username}`} className=" flex items-center gap-3 "  >
                         <UserAvatar avatarUrl={user.avatarUrl} className=" flex-none " />

                         <div>
                            <p className=" line-clamp-1 break-all font-semibold hover:underline ">
                                { user.displayName}
                            </p>

                            <p className=" line-clamp-1 break-all text-muted-foreground "> 
                                @{user.username}
                            </p>
                         </div>

                        </Link>

                        </UserTooltip>

                        <FollowButton userId={user.id} 
                           initialState={{
                            followers: user._count.followers,
                            isFollowedByUser: user.followers.some(
                                ({ followerId }) => followerId === user.id
                            )
                           }}
                        />
                    </div>
                )) }
            
        </div>
     )


}




const getTrendingTopics = unstable_cache(
    async () => {
        const result = await prisma.$queryRaw<{ hashtag: string, count: bigint }[]>`
           SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]]+', 'g'))) AS hashtag, COUNT(*) AS count FROM posts
            GROUP BY (hashtag)
           ORDER BY count DESC, hashtag ASC
            LIMIT 5
        `;

        return result.map((row) => ({
            hashtag: row.hashtag,
            count: Number(row.count)    
        }))
    },
    ["TrendingTopics"],
    {
        revalidate:3 * 60 * 60, // Revalidate every 3 hours
    }
)


async function TrendingTopics () {

     const trendingTopics = await getTrendingTopics();

    return (
        <div className=" space-y-5 rounded-2xl bg-card border dark:border-violet-500 p-5 shadow-sm " >
            <div className="text-xl font-semibold ">
                Trending Topics
            </div>

            {
                trendingTopics.map(({hashtag, count}) => {
                    const title = hashtag.split("#")[1];

                    return (
                        <Link href={`/hashtag/${title}`} className=" block " key={title} >

                            <p className=" line-clamp-1 break-all font-semibold hover:underline " title={hashtag} >
                                { hashtag }
                            </p>

                            <p className="text-sm text-muted-foreground ">

                                { formatNumber(count) } { count === 1 ? "post" : "posts" }

                            </p>

                        </Link>
                    )
                })
            }

        </div>
    )

}