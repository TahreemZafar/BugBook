import { Metadata } from "next";
import SearchResults from "./SearchResults";
import TrendsSidebar from "@/components/other/TrendsSidebar";


interface PageProps {
    searchParams: { q: string };
}


export function generateMetadata({ searchParams: { q } }: PageProps): Metadata {
    return {
        title: `Search Results for "${q}"`,
    };
}



export default function Page({ searchParams: {q} }: PageProps) {


   return (
           <main className=" flex w-full min-w-0 gap-5 " >
               <div className=" w-full min-w-0 space-y-5 mt-3 ">
                   <div className=" border-2 border-violet-500 dark:border-gray-300 bg-card p-4 shadow-sm ">
                       <h1 className="text-center text-xl line-clamp-2 break-all font-bold ">
                           Search Results for <span className=" text-violet-500 " > "{q}"</span>
                       </h1>
                   </div>
   
                     <SearchResults query={q} />
   
               </div>
   
                <TrendsSidebar />
   
           </main>
       )
   

}