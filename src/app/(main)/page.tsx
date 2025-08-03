

import Tab from "@/components/other/Tab";
import TrendsSidebar from "@/components/other/TrendsSidebar";
import PostEditor from "@/components/posts/editors/PostEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React, { Suspense } from "react";
import ForYouFeed from "./ForYouFeed";
import FollowingFeed from "./FollowingFeed";

export default function Home() {



  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />

          <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">For you</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <Suspense>
            <ForYouFeed />
            </Suspense>
          </TabsContent>
          <TabsContent value="following">
            <Suspense>
            <FollowingFeed />
            </Suspense>
          </TabsContent>
        </Tabs>

          {/* <Tab /> */}

      </div>
      <TrendsSidebar />
    </main>
  );
}
