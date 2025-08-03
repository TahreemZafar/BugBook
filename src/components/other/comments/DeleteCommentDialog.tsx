import { CommentData } from "@/lib/types";
import { useDeleteCommentMutation } from "./mutations";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoadingButton from "../loadingButton";
import { Button } from "@/components/ui/button";


interface DeleteCommentDialogProps {
    comment: CommentData;
    open: boolean;
    onClose: () =>  void;
}


export default function DeleteCommentDialog({ comment, open, onClose }: DeleteCommentDialogProps) {

    const mutation = useDeleteCommentMutation();


    function handleOpenChange( open: boolean ) {
        if ( !open || !mutation.isPending ) {
            onClose();
        }
    }


     return (
        <Dialog open={open} onOpenChange={handleOpenChange} >
            <DialogContent className=" dark:border-gray-300 " >
                <DialogHeader>
                    <DialogTitle className=" font-semibold text-lg " >Delete Comment?</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this comment? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <LoadingButton
                        className=" outline-none focus-visible:ring-red-500 "
                        variant={"destructive"}
                        onClick={() => mutation.mutate( comment.id, {
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