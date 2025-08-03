import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfileValues } from "@/lib/validation";
import { UpdateUserProfile } from "./action";
import { PostPage } from "@/lib/types";


export function useUpdateProfileMutation () {

     const { toast } = useToast();
     const router = useRouter()
     const queryClient = useQueryClient();

     const { startUpload: startAvatarUpload } = useUploadThing("avatar");


     const mutation = useMutation({
        mutationFn: async ({ values, avatar }: { values: updateUserProfileValues, avatar?: File }) => {

            return Promise.all([
                UpdateUserProfile(values), 
                avatar && startAvatarUpload([avatar])
            ])

        },

        onSuccess: async ([ updatedUser, uploadResult ]) => {
            const newAvaterUrl = uploadResult?.[0].serverData.avatarUrl;

            const queryFilters: QueryFilters = {
                queryKey: ["post-feed"]
            }


            await queryClient.cancelQueries(queryFilters);

            queryClient.setQueriesData<InfiniteData<PostPage, string|null>>(
                queryFilters,
                ( oldData ) => {

                    if ( !oldData ) return;

                    return {
                        pageParams: oldData.pageParams,
                        pages: oldData.pages.map(page => ({
                            cursor: page.cursor,
                            posts: page.posts.map(post => {
                                if ( post.user.id === updatedUser.updateUser.id ) {
                                    return {
                                        ...post,
                                        user: {
                                            ...updatedUser.updateUser,
                                            avatarUrl: newAvaterUrl || updatedUser.updateUser.avatarUrl
                                            
                                        }
                                    }
                                }

                                return post;
                            })
                        }))
                    }

                }
            );

            router.refresh();

            toast({
                description: "Profile Updated Successfully!"
            });

        },

        onError(error) {

            console.log(error);

            toast({
                variant: "destructive",
                description: " Failed to update Profile. Please try again! "
            })
            
        },

     });


     return mutation;


}