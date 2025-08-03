"use client";       

import InfiniteScrollContainer from "@/components/other/InfiniteScrollContainer";
import PostsLoadingSkelton from "@/components/posts/postLoadingSkelton";
import kyInstance from "@/lib/ky";
import {  NotificationsPage } from "@/lib/types"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react";
import Notification from "./Notificaton";
import { useEffect } from "react";



export default function Notifications() {

     const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status
     } = useInfiniteQuery({
        queryKey: ["notificatons"],
        queryFn: ({ pageParam }) => kyInstance.get(
          "/api/notifications",
          pageParam ? { searchParams: { cursor: pageParam }} : {}
        ).json<NotificationsPage>(),
        initialPageParam: null as string | null ,
        getNextPageParam: ( lastPage ) => lastPage.nextCursor
      });

      const queryClient = useQueryClient();

      const { mutate } = useMutation({
          mutationFn: () => kyInstance.patch("api/notifications/mark-as-read"),
          onSuccess:() => {
            queryClient.setQueryData(["unread-notification-count"], {
               unreadCount: 0
            })
          },
          onError(error) {

            console.log("Failed to mark notifications as read!", error)
             
          },
      })


      useEffect(() => {
         mutate()
      },[mutate])


      const notifications = data?.pages.flatMap( page => page.notifications ) || [];



      if ( status === "pending" ) {
        return <PostsLoadingSkelton />
      }


      if ( status === "success" && !notifications.length && !hasNextPage ) {
          return (
             <p className=" text-center text-muted-foreground mt-10 text-lg "> You don't have any notificatons yet. </p>
          )
      }


      if ( status === "error" ) {
         return <h3 className=" text-center text-destructive mt-10 " > An Error occured while loading notificatons. </h3>
      }



  return (
    <InfiniteScrollContainer className=" mt-5 space-y-5 " 
       onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >

     {
        notifications.map((notification) => (
            <Notification key={ notification.id } notification={ notification } />
        ))
     }

     { isFetchingNextPage && <Loader2 className=" mx-auto animate-spin text-violet-600 size-8 my-4 " /> }


      
    </InfiniteScrollContainer>
  )
}
