"use client";       

import InfiniteScrollContainer from "@/components/other/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkelton from "@/components/posts/postLoadingSkelton";
import kyInstance from "@/lib/ky";
import { PostPage } from "@/lib/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react";



export default function FollowingFeed() {

     const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status
     } = useInfiniteQuery({
        queryKey: ["post-feed", "following"],
        queryFn: ({ pageParam }) => kyInstance.get(
          "/api/posts/following",
          pageParam ? { searchParams: { cursor: pageParam }} : {}
        ).json<PostPage>(),
        initialPageParam: null as string | null ,
        getNextPageParam: ( lastPage ) => lastPage.cursor
      });


      const posts = data?.pages.flatMap( page => page.posts ) || [];



      if ( status === "pending" ) {
        return <PostsLoadingSkelton />
      }


      if ( status === "success" && !posts.length && !hasNextPage ) {
          return (
            <>
             <p className=" text-center text-muted-foreground mt-10 text-xl "> No posts found. </p>
              <p className="  text-center text-muted-foreground mt-2 text-lg" > Start following people to see their posts.</p> 
              </>
          )
      }


      if ( status === "error" ) {
         return <h3 className=" text-center text-destructive " > An Error occured while loading Posts </h3>
      }



  return (
    <InfiniteScrollContainer className=" space-y-5 mt-5 " 
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
