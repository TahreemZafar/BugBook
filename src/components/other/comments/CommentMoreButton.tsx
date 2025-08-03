import DeletePostDialog from "@/components/posts/DeletePostDialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CommentData } from "@/lib/types";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteCommentDialog from "./DeleteCommentDialog";


interface CommentMoreButtonProps {
    comment: CommentData;
    className?: string;
}


export default function CommentMoreButton({ comment, className }: CommentMoreButtonProps) {
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


     <DeleteCommentDialog
        comment={comment}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false) }
     />
      
    </>
  )
}
