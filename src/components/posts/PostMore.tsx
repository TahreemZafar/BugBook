import { PostData } from "@/lib/types"
import { useState } from "react";
import DeletePostDialog from "./DeletePostDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";


interface PostMoreProps {
    post: PostData,
    className?: string,
}


export default function PostMore({ post, className }: PostMoreProps) {

    const [ showDeleteDialog, setShowDeleteDialog ] = useState(false);

  return (
    <>

    <DropdownMenu>
        <DropdownMenuTrigger asChild >
          <Button size="icon" variant="ghost" className={className}>
          <MoreHorizontal className=" size-5 text-muted-foreground " />
          </Button>
        </DropdownMenuTrigger>

         <DropdownMenuContent className=" dark:border-gray-400  " >
             <DropdownMenuItem onClick={ () => setShowDeleteDialog(true) } >

               <span className="flex items-center justify-center font-semibold gap-2 text-[17px] text-destructive ">
                 <Trash2 className=" size-5 " />
                  Delete
               </span>

             </DropdownMenuItem>
         </DropdownMenuContent>

    </DropdownMenu>


     <DeletePostDialog
        post={post}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false) }
     />
      
    </>
  )
}
