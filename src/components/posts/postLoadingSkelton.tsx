import { Skeleton } from "../ui/skeleton";


export default function PostsLoadingSkelton () {
    return (
        <div className=" space-y-5 ">
            <PostLoadingSkelton />
            <PostLoadingSkelton />
            <PostLoadingSkelton />
        </div>
    )
}


export function PostLoadingSkelton() {
  return (
    <div className=" w-full animate-pulse space-y-3 mt-5 rounded-2xl border border-gray-200 dark:border-violet-400 bg-card p-5 shadow-sm " >
        <div className="flex flex-wrap gap-3 ">
            <Skeleton className=" size-12 rounded-full " />

            <div className=" space-y-1.5 ">
                <Skeleton className=" h-4 w-24 rounded " />
                <Skeleton className=" h-4 w-20 rounded " />
            </div>

        </div>

        <Skeleton className=" h-16 rounded " />
      
    </div>
  )
}
