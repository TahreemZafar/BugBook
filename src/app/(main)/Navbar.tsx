import SearchField from "@/components/other/SearchField";
import UserButton from "@/components/other/UserButton";
import Link from "next/link";


export default function Navbar() {
  return (
    <header className=" sticky top-0 z-10 bg-card border border-b-violet-400  dark:border-b-gray-400 shadow-violet-200 shadow-lg dark:shadow-none   " >
       <div className="flex max-w-7xl mx-auto items-center md:justify-center justify-evenly flex-wrap gap-5 px-2 pt-3 sm:px-5 py-2 sm:py-3 ">
          <Link href={"/"} className=" text-2xl font-bold text-primary " >bugbook</Link>

            <SearchField />

           <UserButton className=" sm:ms-auto " />
       </div>
    </header>
  )
}
