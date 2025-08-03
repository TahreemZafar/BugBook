import { CommentsPage, PostData } from "@/lib/types";
import CommentInput from "./CommentInput";
import { useInfiniteQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import Comment from "./Comment";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";


interface CommentsProps {
    post: PostData;
}



export default function Comments ({ post }: CommentsProps) {

   const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", post.id],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            `/api/posts/${post.id}/comments`,
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<CommentsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.previousCursor,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 3, 
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });

  const comments = data?.pages.flatMap((page) => page.comments) || [];
      return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          type="button"
          variant="link"
          className="mx-auto text-[15px] block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
          
        >
          Load previous comments
        </Button>
      )}
      {status === "pending" && <Loader2 className="mx-auto text-violet-600 size-7 mt-6 animate-spin" />}
      {status === "success" && !comments.length && (
        <p className="text-center mt-9 text-muted-foreground">No comments yet.</p>
      )}
      {status === "error" && (
        <p className="text-center mt-2 text-destructive">
          An error occurred while loading comments.
        </p>
      )}
      <div className="divide-y dark:divide-gray-500 ">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}