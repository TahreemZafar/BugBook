        import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
        import { useToast } from "@/components/ui/use-toast";
        import { DefaultStreamChatGenerics, useChatContext } from "stream-chat-react";
        import { useSession } from "../SessionProvider";
        import { useState } from "react";
        import useDebounce from "@/hooks/useDebounce";
        import { UserResponse } from "stream-chat";
        import { useMutation, useQuery } from "@tanstack/react-query";
        import { Check, Loader2, SearchIcon, X } from "lucide-react";
        import UserAvatar from "@/components/other/UserAvatar";
import LoadingButton from "@/components/other/loadingButton";


        interface NewChatDialogProps {
        onOpenChange: ( open: boolean ) => void;
        onChatCreated: () => void;
        }


        export default function NewChatDialog ({ onOpenChange, onChatCreated }: NewChatDialogProps) {

        const { client, setActiveChannel } = useChatContext();
        const { toast } = useToast();
        const { user: LoggedInUser } = useSession();

        const [ searchInput, setSearchInput ] = useState("");
        const searchInputDebounced = useDebounce(searchInput);

        const [ selectedUsers, setSelectedUsers ] = useState<
        UserResponse<DefaultStreamChatGenerics>[]
        >([]);


        const { data, isFetching, isError, isSuccess,  } = useQuery({
        queryKey: ["stream-users", searchInputDebounced ],
        queryFn: async () => client.queryUsers({
        id: { $ne: LoggedInUser.id },
        role: { $ne: "admin" },
        ...(searchInputDebounced 
            ? {
                $or: [
                    { name: { $autocomplete: searchInputDebounced } },
                    { username: { $autocomplete: searchInputDebounced } }
                ]
            } : {}
            )

        },

        { name: 1, username: 1 },
        { limit: 15 }

        )
        })


        const mutation = useMutation({
            mutationFn: async () => {
                const channel = client.channel("messaging", {
                    members: [ LoggedInUser.id, ...selectedUsers.map((u) => u.id) ],
                    name: selectedUsers.length > 1 ? LoggedInUser.displayName + ", " + selectedUsers.map((u) => u.name).join(", ") : undefined
                });

                await channel.create();
                return channel;
            },

            onSuccess: (channel) => {
                setActiveChannel(channel);
                onChatCreated();
            },
            onError: (error) => {
                console.error("Error while starting chat ", error);

                toast({
                    variant: "destructive",
                    description: " An Error occured while starting chat. Please try again! "
                })
            }
        })



return (
<Dialog open onOpenChange={onOpenChange}  >
<DialogContent className=" bg-card p-0 border-2  border-violet-500 " >
<DialogHeader className=" px-6 pt-6 " >
<DialogTitle>New Chat</DialogTitle>
</DialogHeader>

<div className=" ">
<div className="group relative ">
    <SearchIcon className=" absolute left-5 mt-3 size-5 -translate-y-5 transform text-muted-foreground group-focus-within:text-primary top-1/2 " />

    <input 
        placeholder="Search users..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className=" w-full bg-violet-50 dark:bg-secondary h-12 pe-4 ps-14 focus:outline-none "
    
    />

</div>

{
    !!selectedUsers.length && (
        <div className=" mt-4 flex flex-wrap gap-2 p-2 ">
            {
                selectedUsers.map(user => (
                    <SelectedUsersTag 
                        key={user.id}
                        user={user}
                        onRemove={() => {
                        setSelectedUsers((prev) => 
                            prev.filter((u) => u.id !== user.id ),
                        )
                        }}

                    />
                ))
            }
        </div>
    )
}

<div className=" my-1 w-full h-[1px] bg-gray-400/90 " />

<div className=" h-96 overflow-y-auto ">
{
    isSuccess && 
    data.users.map( users => (
        <UserResults
            key={ users.id }
            user={users}
            selected={selectedUsers.some(u => u.id === users.id)}
            onClick={() => {
            setSelectedUsers(prev => 
                prev.some(u => u.id === users.id)
                ? prev.filter(u => u.id !== users.id) 
                : [ ...prev, users ]
            )
            }}
        />
    ))
}

    {
        isSuccess && !data.users.length && (
            <p className=" my-3 text-center mt-10 text-muted-foreground ">
                No Users found. Try a different name.
            </p>
        )
    }

    {
        isFetching && <Loader2 className=" mx-auto my-3 mt-10 animate-spin text-violet-500 size-8 " />
    }

    {
        isError && (
            <p className=" my-3 text-center text-destructive ">
                An Error occured while loading users.
            </p>
        )
    }


</div>

</div>


   <DialogFooter className=" px-6 pb-6 " >

      <LoadingButton 
          disabled={!selectedUsers.length}
          loading={ mutation.isPending }
          onClick={() => mutation.mutate()}         
       
      >
        Start Chat
        </LoadingButton>
   </DialogFooter>


</DialogContent>
</Dialog>
)

}




        interface UserResultsProps {
        user: UserResponse<DefaultStreamChatGenerics>;
        selected: boolean,
        onClick: () => void;
        }


        function UserResults ({ user, selected, onClick }: UserResultsProps ) {

        return (
        <button 
        onClick={onClick}
        className=" flex w-full items-center justify-between px-4 py-2.5 transition-colors hover:bg-muted/50 ">

        <div className="flex items-center gap-2 ">

            <UserAvatar avatarUrl={user.image} />

            <div className=" flex flex-col text-start ">
                <p className=" font-bold "> { user.name } </p>
                <p className=" text-muted-foreground ">@{ user.username }</p>
            </div>

        </div>

        { selected && <Check className=" size-5 text-violet-500 " /> }

        </button>
        )

        }





        interface SelectedUsersTagProps {
        user: UserResponse<DefaultStreamChatGenerics>
        onRemove: () => void;
        }


        function SelectedUsersTag ({ user, onRemove }: SelectedUsersTagProps) {

        return (
        <button
        onClick={onRemove}
        className=" flex items-center gap-2 border dark:border-gray-500 p-1 py-2 hover:bg-muted/50 ">

        <UserAvatar avatarUrl={user.image} size={24} />
        <p className="font-bold"> { user.name } </p>

        <X className=" mx-2 size-5 text-muted-foreground " />

        </button>
        )

        }