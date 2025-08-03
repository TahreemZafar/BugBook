"use client";       

import InfiniteScrollContainer from "@/components/other/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkelton from "@/components/posts/postLoadingSkelton";
import kyInstance from "@/lib/ky";
import {  PostPage } from "@/lib/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react";



interface SearchResultsProps {
    query: string;
}


export default function SearchResults({ query }: SearchResultsProps) {

     const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status
     } = useInfiniteQuery({
        queryKey: ["post-feed", "search", query],
        queryFn: ({ pageParam }) => kyInstance.get(
          "/api/search",

            {
                searchParams: {
                q: query,
                ...( pageParam ? { cursor: pageParam } : {})
                }
            }
         
        ).json<PostPage>(),
        initialPageParam: null as string | null ,
        getNextPageParam: ( lastPage ) => lastPage.cursor,
        gcTime: 0,
      });


      const posts = data?.pages.flatMap( page => page.posts ) || [];



      if ( status === "pending" ) {
        return <PostsLoadingSkelton />
      }


      if ( status === "success" && !posts.length && !hasNextPage ) {
          return (
             <p className=" text-center text-muted-foreground mt-10 text-lg "> No results found. Try searching for something else. </p>
          )
      }


      if ( status === "error" ) {
         return <h3 className=" text-center text-destructive mt-10 " > An Error occured while loading Posts. </h3>
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
