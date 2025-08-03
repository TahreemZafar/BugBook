"use client";

import { Button } from "@/components/ui/button";
import { UserData } from "@/lib/types";
import { useState } from "react";
import EditProfileDialog from "./EditProfileDialog";


interface EditProfileButtonProps {
    user: UserData;
}


export default function EditProfileButton ({ user }: EditProfileButtonProps) {

     const [ showDialog, setShowDialog ] = useState(false);


     return (
        <>

        <Button variant={"outline"} onClick={() => setShowDialog(true)} className=" border-violet-700 dark:bg-violet-700 dark:border-violet-500 hover:bg-violet-500 dark:hover:border-2 dark:hover:border-gray-400 dark:border dark:hover:bg-transparent px-4 py-2.5 text-[16px] hover:text-white border-2 " >
            Edit Profile
        </Button>

        <EditProfileDialog user={user} open={showDialog} onOpenChange={setShowDialog} />


        </>
     )


}