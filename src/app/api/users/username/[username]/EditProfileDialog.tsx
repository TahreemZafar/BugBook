import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserData } from "@/lib/types";
import { updateUserProfileSchma, updateUserProfileValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUpdateProfileMutation } from "./mutations";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LoadingButton from "@/components/other/loadingButton";
import { useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { Label } from "@/components/ui/label";
import avatarPlaceholder from "@/assets/avatar-placeholder.png"
import { Camera } from "lucide-react";
import CropImageDialog from "@/components/other/CropImageDialog";
import Resizer from "react-image-file-resizer";


interface EditProfileDialogProps {
    user: UserData;
    open: boolean;
    onOpenChange: ( open: boolean ) => void;
}


export default function EditProfileDialog ({ open, onOpenChange, user }: EditProfileDialogProps ) {

    const [ croppedAvater, setCroppedAvater ] = useState<Blob | null>()


    const form = useForm<updateUserProfileValues>({

        resolver: zodResolver(updateUserProfileSchma),
        defaultValues: {
            displayName: user.displayName,
            bio: user.bio || "",
        }

    })

    const mutation = useUpdateProfileMutation();

    async function onSubmit ( values: updateUserProfileValues ) {

        const newAvaterFile = croppedAvater
        ? new File([croppedAvater], `avatar_${user.id}.webp`) : undefined;
        
        mutation.mutate(
            { 
                values,
                avatar: newAvaterFile,
             },
            { 
                onSuccess: () => {
                    setCroppedAvater(null);
                    onOpenChange(false);
                }
            }
        )

    }


    return (
        
        <Dialog open={open} onOpenChange={onOpenChange}  >
            <DialogContent  className=" mx-auto " >
                <DialogHeader>
                    <DialogTitle className="  text-violet-700 text-xl lg:text-[22px] mb-2 text-center " >Edit Profile. </DialogTitle>
                </DialogHeader>


                <div className=" space-y-2 items-center justify-center mx-auto ">

                    <AvaterInput
                        src={ 
                            croppedAvater
                            ? URL.createObjectURL(croppedAvater)
                            : user.avatarUrl || avatarPlaceholder
                        }
                        onImageCropped={setCroppedAvater}
                    />

                </div>

 
                <Form { ...form } >

                    <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-3 " >

                        <FormField 
                           control={form.control}
                           name="displayName"
                           render={({field}) => (
                              <FormItem>
                                 <FormLabel>Display Name</FormLabel>

                                 <FormControl>
                                    <Input placeholder="Your dispaly name here" { ...field } className="  text-[17px] placeholder:text-[15px] " />
                                 </FormControl>

                                 <FormMessage />

                              </FormItem>
                           )}
                        
                        ></FormField>



                        <FormField 
                           control={form.control}
                           name="bio"
                           render={({field}) => (
                              <FormItem>
                                 <FormLabel>Bio</FormLabel>

                                 <FormControl>

                                 <Textarea 
                                   placeholder=" Tell us a little bit about yourself. "
                                   className=" resize-none text-[17px] placeholder:text-[15px] "
                                   { ...field }
                                 />

                                 </FormControl>

                                 <FormMessage />

                              </FormItem>
                           )}
                        
                        ></FormField>


                        <DialogFooter>
                            <LoadingButton type="submit" loading={mutation.isPending} className=" border border-violet-700 mt-1 " >
                                Save Changes
                            </LoadingButton>
                        </DialogFooter>


                    </form>

                </Form>

            </DialogContent>
        </Dialog>

    )

}




interface AvaterInputProps {
    src: string | StaticImageData;
    onImageCropped: ( blob: Blob | null ) => void;
}



function AvaterInput ({ src, onImageCropped }: AvaterInputProps) {

    const [ imageToCrop, setImageToCrop ] = useState<File>();

    const fileInputRef = useRef<HTMLInputElement>(null);


    function onImageSelected ( image: File | null ) {

        if ( !image ) return;

        Resizer.imageFileResizer(
            image,
            1024,
            1024,
            "WEBP",
            100,
            0,
            (value: string | Blob | File | ProgressEvent<FileReader>) => {
                if (value instanceof File) {
                    setImageToCrop(value);
                } else {
                    setImageToCrop(undefined);
                }
            },
            "file"
        )

         
 
    }


    return (
        <>

         <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageToCrop(e.target.files?.[0])}
            ref={fileInputRef}
            className=" hidden sr-only "
         />

         <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className=" group relative block  "
           >

            <Image
               src={src}
               alt="Avater Preview"
               width={150}
               height={150}
               className=" border border-violet-800  size-32 flex-none rounded-full object-cover "
            />

            <span className=" absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black bg-opacity-30 text-white transition-colors group-hover:bg-opacity-25 duration-200 ">
                <Camera size={24} />
            </span>

           </button>


           { imageToCrop && (

             <CropImageDialog
                src={URL.createObjectURL(imageToCrop)}
                cropAspectRatio={1}
                onCropped={onImageCropped}
                onClose={() => {
                    setImageToCrop(undefined)
                    if ( fileInputRef.current ) {
                        fileInputRef.current.value = ''
                    }
                }}
             />

           )}

        
        </>
    )


}