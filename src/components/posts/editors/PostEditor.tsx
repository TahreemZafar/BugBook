"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import Starterkit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { SubmitPost } from "./action";
import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "@/components/other/UserAvatar";
import { Button } from "@/components/ui/button";
import "./styles.css";
import { useSubmitPostMutation } from "./mutations";
import LoadingButton from "@/components/other/loadingButton";
import useMediaUpload, { Attachment } from "./useMediaUpload";
import { useRef } from "react";
import { ImageIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useDropzone } from "@uploadthing/react";


export default function PostEditor() {

    const { user } = useSession();

    const { 
        startUpload,
        isUploading,
        attachments,
        uploadProgress,
        removeAttachment,
        reset: resetMediaUpload,
     } = useMediaUpload();


    
     const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: startUpload,
     })

     const { onClick, ...rootProps } = getRootProps();    


 
    const mutation = useSubmitPostMutation();

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            Starterkit.configure({
                bold: false,
                italic: false,
            }),
            Placeholder.configure({
                placeholder: "What's crack-a-lackin'?",
            })
        ]
    })


    const input = editor?.getText({
        blockSeparator: "\n",
    }) || "";


    function onSubmit  () {

        mutation.mutate({
            content: input,
            mediaId: attachments?.map(a => a.mediaId).filter(Boolean) as string[],
        }, {
            onSuccess: () => {

          editor?.commands.clearContent();
            resetMediaUpload();

            }
        }) 


    }


    function onPaste ( e: React.ClipboardEvent<HTMLDivElement> ) {

        const files = Array.from(e.clipboardData.items)
            .filter(item => item.kind === "file")
            .map(item => item.getAsFile()) as File[];

            startUpload(files);
        
    }



  return (
    <div className=" flex flex-col gap-5 mt-3 bg-card p-5 shadow-sm dark:border-violet-500/90 border" >
        <div className="flex gap-4 ">

            <UserAvatar avatarUrl={ user.avatarUrl } className=" hidden sm:inline size-[54px] -mt-1 " />

            <div { ...rootProps } className=" w-full " >

        <EditorContent editor={editor} className={ cn(" w-full max-h-[20rem] overflow-y-scroll bg-background  border  px-5 py-3 ", isDragActive && " outline-dashed transition-transform outline-violet-700 border-none ")}
          onPaste={onPaste}
          />

            <input className=" focus:outline-none hidden sr-only " { ...getInputProps } />

            </div>

        </div>

        {
            !!attachments?.length && (
                <AttachmentsPreviews
                   attachments={attachments}
                   onRemoveClick={removeAttachment}
                />
            )
        }


        <div className="flex justify-end gap-3 items-center ">

            {
                isUploading && (
                    <>
                    <span className=" text-sm ">{ uploadProgress ?? 0 }</span>
                        <Loader2 className=" animate-spin size-5 text-violet-500 " />
                   </>
                )
            }

            <AddAttachmentButton 
                onFileSelected={startUpload} 
                disabled={isUploading || (attachments?.length ?? 0) >= 5 } />

            <LoadingButton
               loading={mutation.isPending} 
               onClick={onSubmit}
               disabled={!input.trim() || isUploading}
               className="min-w-20 border border-violet-700 "
               
            >Post</LoadingButton>
        </div>
      
    </div>
  )

}




interface AddAttachmentButtonProps {
    onFileSelected: ( files: File[] ) => void;
    disabled: boolean;
}



 function AddAttachmentButton ({ onFileSelected, disabled }: AddAttachmentButtonProps ) {

     const fileInputRef = useRef<HTMLInputElement>(null);


     return (
        <>
 
         <Button variant={"ghost"} size={"icon"} className=" text-primary hover:text-primary "
            disabled={disabled}
            onClick={() => {
                fileInputRef.current?.click();
            }}
          >
            <ImageIcon size={26} />

         </Button>

         <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden sr-only " 
            accept="image/* video/*" 
            multiple 
            onChange={(e) => {
                const files = e.target.files;
                if (files) {
                    onFileSelected(Array.from(files));
                }
                e.target.value = ""; // Reset the input value
            }} />


        </>
     )

 }






 interface AttachmentsPreviewProps {
    attachments: Attachment;
    onRemoveClick: () => void;
 }



 function AttachmentsPreview({ 
     attachments: { file, mediaId, isUploading },
     onRemoveClick }: AttachmentsPreviewProps)
      {

    const src = URL.createObjectURL(file);


    return (
        <div className={cn(" relative mx-auto size-fit ", isUploading && " opacity-50 ")}>
            {
                file.type.startsWith("image") ? (

                    <Image src={src} alt="Attachments Preview" width={500} height={500} className=" border size-fit max-h-[30rem] " />

                ) : (

                    <video controls className=" border size-fit max-h-[30rem]  " >
                        <source src={src} type={file.type} />
                        Your browser does not support the video tag.
                    </video>

                )
            }


            {
                !isUploading && (
                    <button onClick={onRemoveClick} 
                    className=" absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60 "
                    >
                        <X size={20} />
                    </button>
                )
            }

        </div>
    )

 }






 interface AttachmentsPreviewsProps {
    attachments: Attachment[];
    onRemoveClick: (mediaId: string) => void;
 }


 function AttachmentsPreviews ({ attachments, onRemoveClick }: AttachmentsPreviewsProps) {
    return (
        <div className={ cn("flex flex-col gap-3 ", attachments.length > 1 && " sm:grid sm:grid-cols-2 ") }>
            {
                attachments.map((attachment) => (

                    <AttachmentsPreview key={attachment.file.name} attachments={attachment} onRemoveClick={() => onRemoveClick(attachment.file.name)} />

                ))
            }
        </div>
    )
 }
















// "use client";

// import { EditorContent, useEditor } from "@tiptap/react";
// import Starterkit from "@tiptap/starter-kit";
// import Placeholder from "@tiptap/extension-placeholder";
// import { useSession } from "@/app/(main)/SessionProvider";
// import UserAvatar from "@/components/other/UserAvatar";
// import { Button } from "@/components/ui/button";
// import "./styles.css";
// import { useSubmitPostMutation } from "./mutations";
// import LoadingButton from "@/components/other/loadingButton";
// import { useRef, useState } from "react";
// import { ImageIcon, Loader2, X } from "lucide-react";
// import { cn } from "@/lib/utils";
// import Image from "next/image";
// import { useUploadThing } from "@/lib/uploadthing";
// import useMediaUpload from "./useMediaUpload";
// import { useDropzone } from "@uploadthing/react";

// export default function PostEditor() {
//   const { user } = useSession();
//   const mutation = useSubmitPostMutation();

//   const editor = useEditor({
//     extensions: [
//       Starterkit.configure({ bold: false, italic: false }),
//       Placeholder.configure({ placeholder: "What's crack-a-lackin'?" }),
//     ],
//   });


//  const { 
        
//         uploadProgress,
//         removeAttachment,
//         reset: resetMediaUpload,
//      } = useMediaUpload();

        
    



//   const input = editor?.getText({ blockSeparator: "\n" }) || "";

//   const [attachments, setAttachments] = useState<
//     { file: File; url?: string; mediaId?: string; isUploading?: boolean }[]
//   >([]);

//   const { startUpload, isUploading } = useUploadThing("attachment", {
//     onClientUploadComplete: (res) => {
//       const updated = res.map((r, i) => ({
//         ...attachments[i],
//         url: r.ufsUrl,
//         mediaId: r.serverData?.mediaId,
//         isUploading: false,
//       }));
//       setAttachments(updated);
//     },
//     onUploadError: (error) => {
//       console.error("Upload error:", error);
//     },
//   });


//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//         onDrop: startUpload,
//      })

//      const { onClick, ...rootProps } = getRootProps();    




//   const handleFileUpload = (files: File[]) => {
//     const pending = files.map((file) => ({ file, isUploading: true }));
//     setAttachments((prev) => [...prev, ...pending]);
//     startUpload(files);
//   };

//   const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
//     const files = Array.from(e.clipboardData.items)
//       .filter((item) => item.kind === "file")
//       .map((item) => item.getAsFile()) as File[];
//     handleFileUpload(files);
//   };

//   const handleRemove = (fileName: string) => {
//     setAttachments((prev) => prev.filter((a) => a.file.name !== fileName));
//   };

//   const handleSubmit = () => {
//     mutation.mutate(
//       {
//         content: input,
//         mediaId: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
//       },
//       {
//         onSuccess: () => {
//           editor?.commands.clearContent();
//           setAttachments([]);
//         },
//       }
//     );
//   };

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   return (
//     <div className="flex flex-col gap-5 mt-3 bg-card p-5 shadow-sm dark:border-violet-500/90 border">
//       <div className="flex gap-4">
//         <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline size-[54px] -mt-1" />

//         <div
//           className="w-full"
//           onPaste={handlePaste}
//         >


//         <input className=" focus:outline-none hidden sr-only " { ...getInputProps() } />

//           <EditorContent
//             editor={editor}
//             className={cn(
//               "w-full max-h-[20rem] overflow-y-scroll bg-background border px-5 py-3"
//             )}
//           />
//         </div>
//       </div>

//       {!!attachments.length && (
//         <AttachmentsPreviews attachments={attachments} onRemoveClick={handleRemove} />
//       )}

//       <div className="flex justify-end gap-3 items-center">
//         {isUploading && (
//           <>
//             <span className="text-sm">{uploadProgress ?? 0}%</span>
//             <Loader2 className="animate-spin size-5 text-violet-500" />
//           </>
//         )}

//         <Button
//           variant="ghost"
//           size="icon"
//           className="text-primary hover:text-primary"
//           disabled={isUploading || attachments.length >= 5}
//           onClick={() => fileInputRef.current?.click()}
//         >
//           <ImageIcon size={26} />
//         </Button>

//         <input
//           type="file"
//           ref={fileInputRef}
//           className="hidden sr-only"
//           accept="image/*,video/*"
//           multiple
//           onChange={(e) => {
//             const files = e.target.files;
//             if (files) handleFileUpload(Array.from(files));
//             e.target.value = "";
//           }}
//         />

//         <LoadingButton
//           loading={mutation.isPending}
//           onClick={handleSubmit}
//           disabled={!input.trim() || isUploading}
//           className="min-w-20 border border-violet-700"
//         >
//           Post
//         </LoadingButton>
//       </div>
//     </div>
//   );
// }










// interface AttachmentsPreviewProps {
//   attachment: {
//     file: File;
//     url?: string;
//     isUploading?: boolean;
//   };
//   onRemoveClick: () => void;
// }

// function AttachmentsPreview({ attachment, onRemoveClick }: AttachmentsPreviewProps) {

//   const src = attachment.url ?? URL.createObjectURL(attachment.file);

//   if (!attachment?.file) return null; 

// //   return (
// //     <div className={cn("relative mx-auto size-fit", attachment.isUploading && "opacity-50")}>
// //       {attachment.file.type.startsWith("image") ? (
// //         <Image
// //           src={src}
// //           alt="Attachments Preview"
// //           width={500}
// //           height={500}
// //           className="border size-fit max-h-[30rem]"
// //         />
// //       ) : (
// //         <video controls className="border size-fit max-h-[30rem]">
// //           <source src={src} type={attachment.file.type} />
// //           Your browser does not support the video tag.
// //         </video>
// //       )}

// //       {!attachment.isUploading && (
// //         <button
// //           onClick={onRemoveClick}
// //           className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
// //         >
// //           <X size={20} />
// //         </button>
// //       )}
// //     </div>
// //   );


//  return (
//         <div className={cn(" relative mx-auto size-fit ", attachment.isUploading && " opacity-50 ")}>
//             {
//                 attachment?.file?.type.startsWith("image") ? (

//                     <Image src={src} alt="Attachments Preview" width={500} height={500} className=" border size-fit max-h-[30rem] " />

//                 ) : (

//                     <video controls className=" border size-fit max-h-[30rem]  " >
//                         <source src={src} type={attachment.file.type} />
//                         Your browser does not support the video tag.
//                     </video>

//                 )
//             }


//             {
//                 !attachment.isUploading && (
//                     <button onClick={onRemoveClick} 
//                     className=" absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60 "
//                     >
//                         <X size={20} />
//                     </button>
//                 )
//             }

//         </div>
//     )



  
// }






// // function AttachmentsPreview({ attachment, onRemoveClick }: AttachmentsPreviewProps) {
// //   if (!attachment?.file) return null; // ✅ Prevent rendering if file is missing

// //   const src = attachment.url ?? URL.createObjectURL(attachment.file);

// //   return (
// //     <div className={cn("relative mx-auto size-fit", attachment.isUploading && "opacity-50")}>
// //       {attachment.file.type.startsWith("image") ? (
// //         <Image
// //           src={src}
// //           alt="Attachments Preview"
// //           width={500}
// //           height={500}
// //           className="border size-fit max-h-[30rem]"
// //         />
// //       ) : (
// //         <video controls className="border size-fit max-h-[30rem]">
// //           <source src={src} type={attachment.file.type} />
// //           Your browser does not support the video tag.
// //         </video>
// //       )}

// //       {!attachment.isUploading && (
// //         <button
// //           onClick={onRemoveClick}
// //           className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
// //         >
// //           <X size={20} />
// //         </button>
// //       )}
// //     </div>
// //   );
// // }





// interface AttachmentsPreviewsProps {
//   attachments: {
//     file: File;
//     url?: string;
//     mediaId?: string;
//     isUploading?: boolean;
//   }[];
//   onRemoveClick: (fileName: string) => void;
// }

// function AttachmentsPreviews({ attachments, onRemoveClick }: AttachmentsPreviewsProps) {
//   return (
//     <div className={cn("flex flex-col gap-3", attachments.length > 1 && "sm:grid sm:grid-cols-2")}>
//       {attachments.map((attachment) => (
//         <AttachmentsPreview
//           key={attachment?.file?.name}
//           attachment={attachment}
//           onRemoveClick={() => onRemoveClick(attachment.file.name)}
//         />
//       ))}
//     </div>
//   );
// }
