"use client";       

import InfiniteScrollContainer from "@/components/other/InfiniteScrollContainer";
import DeletePostDialog from "@/components/posts/DeletePostDialog";
import Post from "@/components/posts/Post";
import PostsLoadingSkelton from "@/components/posts/postLoadingSkelton";
import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { PostData, PostPage } from "@/lib/types"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react";



interface UserPostsProps {
    userId: string,
    loggedInUser: string
}


export default function UserPosts({ userId, loggedInUser }: UserPostsProps) {

     const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status
     } = useInfiniteQuery({
        queryKey: ["post-feed", "user-posts", userId],
        queryFn: ({ pageParam }) => kyInstance.get(
          `/api/users/${userId}/posts`,
          pageParam ? { searchParams: { cursor: pageParam }} : {}
        ).json<PostPage>(),
        initialPageParam: null as string | null ,
        getNextPageParam: ( lastPage ) => lastPage.cursor
      });


      const posts = data?.pages.flatMap( page => page.posts ) || [];



      if ( status === "pending" ) {
        return <PostsLoadingSkelton />
      }


      if ( status === "success" && !posts.length && !hasNextPage && userId !== loggedInUser ) {
          return (
             <p className=" text-center text-muted-foreground mt-10 text-lg "> This user has'nt posted anything yet. </p>
          )
      }

      
      if ( status === "success" && !posts.length && !hasNextPage && userId === loggedInUser ) {
          return (
             <p className=" text-center text-muted-foreground mt-10 text-lg "> You have not posted anything yet. </p>
          )
      }


      if ( status === "error" ) {
         return <h3 className=" text-center text-destructive mt-10 " > An Error occured while loading Posts </h3>
      }



  return (
    <InfiniteScrollContainer className=" mt-5 space-y-5 " 
       onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >

     {
        posts.map((post) => (
            <Post key={post.id} post={post} />
        ))
     }

     { isFetchingNextPage && <Loader2 className=" mx-auto animate-spin text-violet-600 size-8 my-4 " /> }


      
    </InfiniteScrollContainer>
  )
}
