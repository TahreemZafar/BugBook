"use client";

import FollowingFeed from "@/app/(main)/FollowingFeed";
import ForYouFeed from "@/app/(main)/ForYouFeed";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense, useState } from "react";


export default function Tab() {

      const [ tab, setTab ] = useState("for-you")



  return (
    <>

<Tabs defaultValue="for-you">
  <TabsList>
    <TabsTrigger onClick={() => setTab("for-you")} value="for-you">For you</TabsTrigger>
    <TabsTrigger onClick={() => setTab("following")} value="following">Following</TabsTrigger>
  </TabsList>
  <div className="relative">
    <div className={tab === "for-you" ? "block" : "hidden"}>
        <Suspense>
      <ForYouFeed />
      </Suspense>
    </div>
    <div className={tab === "following" ? "block" : "hidden"}>
        <Suspense>
      <FollowingFeed />
      </Suspense>
    </div>
  </div>
</Tabs>


   </>
  )
}
