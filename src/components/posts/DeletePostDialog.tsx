import { PostData } from "@/lib/types";
import { useDeletePostMutation } from "./mutation";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "../ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import LoadingButton from "../other/loadingButton";
import { Button } from "../ui/button";


interface DeletePostDialogProps {
    post: PostData,
    open: boolean,
    onClose: () => void;
}


export default function DeletePostDialog({
     post, open, onClose
}: DeletePostDialogProps) {

    const mutation = useDeletePostMutation();


    function handleOpenChange(open: boolean) {
        if ( !open || !mutation.isPending ) {
            onClose();
        }
    }



    return (
        <Dialog open={open} onOpenChange={handleOpenChange} >
            <DialogContent className=" dark:border-gray-300 " >
                <DialogHeader>
                    <DialogTitle className=" font-semibold text-lg " >Delete Post?</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this post? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <LoadingButton
                        className=" outline-none focus-visible:ring-red-500 "
                        variant={"destructive"}
                        onClick={() => mutation.mutate( post.id, {
                            onSuccess: onClose
                        } )}
                        loading={mutation.isPending}
                    >
                        Delete
                    </LoadingButton>

                    <Button variant={"outline"} onClick={onClose} disabled={mutation.isPending} >Cancel</Button>

                </DialogFooter>

            </DialogContent>  
        </Dialog>
    )

}
