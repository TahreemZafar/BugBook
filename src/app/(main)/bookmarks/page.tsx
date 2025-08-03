import { Metadata } from "next";
import Bookmarks from "./Bookmarks";
import TrendsSidebar from "@/components/other/TrendsSidebar";


export const metadata: Metadata = {
    title: "Bookmarks"
}


export default function Page () {

    return (
        <main className=" flex w-full min-w-0 gap-5 " >
            <div className=" w-full min-w-0 space-y-5 mt-3 ">
                <div className=" border-2 border-violet-500 dark:border-gray-300 bg-card p-4 shadow-sm ">
                    <h1 className="text-center text-xl  font-bold ">
                        Bookmarks
                    </h1>
                </div>

                <Bookmarks />

            </div>

            <TrendsSidebar />

        </main>
    )

}