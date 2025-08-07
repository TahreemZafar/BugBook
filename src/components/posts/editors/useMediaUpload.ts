// import { useToast } from "@/components/ui/use-toast";
// import { useUploadThing } from "@/lib/uploadthing";
// import { useState } from "react";

// export interface Attachment {
//   file: File;
//   mediaId?: string;
//   isUploading: boolean;
// }

// export default function useMediaUpload() {
//   const { toast } = useToast();

//   const [attachments, setAttachments] = useState<Attachment[]>([]);

//   const [uploadProgress, setUploadProgress] = useState<number>();

//   const { startUpload, isUploading } = useUploadThing("attachment", {
//     onBeforeUploadBegin(files) {
//       const renamedFiles = files.map((file) => {
//         const extension = file.name.split(".").pop();
//         return new File(
//           [file],
//           `attachment_${crypto.randomUUID()}.${extension}`,
//           {
//             type: file.type,
//           },
//         );
//       });

//       setAttachments((prev) => [
//         ...prev,
//         ...renamedFiles.map((file) => ({ file, isUploading: true })),
//       ]);

//       return renamedFiles;
//     },
//     onUploadProgress: setUploadProgress,
//     onClientUploadComplete(res) {
//       setAttachments((prev) =>
//         prev.map((a) => {
//           const uploadResult = res.find((r) => r.name === a.file.name);

//           if (!uploadResult) return a;

//           return {
//             ...a,
//             mediaId: uploadResult.serverData.mediaId,
//             isUploading: false,
//           };
//         }),
//       );
//     },
//     onUploadError(e) {
//       setAttachments((prev) => prev.filter((a) => !a.isUploading));
//       toast({
//         variant: "destructive",
//         description: e.message,
//       });
//     },
//   });

//   function handleStartUpload(files: File[]) {
//     if (isUploading) {
//       toast({
//         variant: "destructive",
//         description: "Please wait for the current upload to finish.",
//       });
//       return;
//     }

//     if (attachments.length + files.length > 5) {
//       toast({
//         variant: "destructive",
//         description: "You can only upload up to 5 attachments per post.",
//       });
//       return;
//     }

//     startUpload(files);
//   }

//   function removeAttachment(fileName: string) {
//     setAttachments((prev) => prev.filter((a) => a.file.name !== fileName));
//   }

//   function reset() {
//     setAttachments([]);
//     setUploadProgress(undefined);
//   }

//   return {
//     startUpload: handleStartUpload,
//     attachments,
//     isUploading,
//     uploadProgress,
//     removeAttachment,
//     reset,
//   };
// }








import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

export default function useMediaUpload() {
  const { toast } = useToast();

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>();

  const canUploadMore = (incomingFiles: number) =>
    attachments.length + incomingFiles <= 5;

  const { startUpload, isUploading } = useUploadThing("attachment", {
    onBeforeUploadBegin(files) {
      const renamedFiles = files.map((file) => {
        const ext = file.name.split(".").pop() || "dat";
        return new File([file], `attachment_${crypto.randomUUID()}.${ext}`, {
          type: file.type,
        });
      });

      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({
          file,
          isUploading: true,
        })),
      ]);

      return renamedFiles;
    },

    onUploadProgress: setUploadProgress,

    onClientUploadComplete(res) {
      setAttachments((prev) =>
        prev.map((attachment) => {
          const result = res.find(
            (r) =>
              r.name === attachment.file.name &&
              r.serverData?.mediaId // Ensures matched upload
          );

          return result
            ? {
                ...attachment,
                mediaId: result.serverData.mediaId,
                isUploading: false,
              }
            : attachment;
        })
      );
    },

    onUploadError(error) {
      setAttachments((prev) => prev.filter((a) => !a.isUploading));
      toast({
        variant: "destructive",
        description: error.message || "Upload failed.",
      });
    },
  });

  function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast({
        variant: "destructive",
        description: "Please wait for the current upload to complete.",
      });
      return;
    }

    if (!canUploadMore(files.length)) {
      toast({
        variant: "destructive",
        description: "You can only upload up to 5 attachments per post.",
      });
      return;
    }

    startUpload(files);
  }

  function removeAttachment(fileName: string) {
    setAttachments((prev) =>
      prev.filter((attachment) => attachment.file.name !== fileName)
    );
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(undefined);
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset,
  };
}
