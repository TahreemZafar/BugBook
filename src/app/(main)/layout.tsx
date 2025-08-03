import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import { validateRequest } from "@/auth";
import Navbar from "./Navbar";
import Menubar from "./Menubar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user) redirect("/login");

  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto max-w-7xl p-5 flex w-full grow gap-5 ">

          <Menubar className=" sticky top-[5.30rem] z-20 h-fit hidden border dark:border-violet-500 sm:block  flex-none space-y-3 rounded-2xl bg-card px-3 py-5 lg:px-5 shadow-sm lg:w-[225px] xl:w-[17rem] " />

          {children}

          </div>
 
            <Menubar className=" sticky bottom-0 flex w-full justify-center gap-5 border-t-2 dark:border-violet-500/90 bg-card p-3 sm:hidden "  />

      </div>
    </SessionProvider>
  );
}
