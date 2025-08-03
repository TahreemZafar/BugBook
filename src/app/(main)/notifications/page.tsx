import TrendsSidebar from "@/components/other/TrendsSidebar"
import { Metadata } from "next"
import Notifications from "./Notificatons"




export const metadata: Metadata = {
    title: "Notifications"
}


export default function Page () {

    return (
        <main className=" flex w-full min-w-0 gap-5 " >
            <div className=" w-full min-w-0 space-y-5 mt-3 ">
                <div className=" border-2 border-violet-500 dark:border-gray-300 bg-card p-4 shadow-sm ">
                    <h1 className="text-center text-xl  font-bold ">
                        Notifications
                    </h1>
                </div>

                <Notifications />

            </div>

            <TrendsSidebar />

        </main>
    )

}