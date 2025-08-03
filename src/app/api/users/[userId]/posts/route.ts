import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostPage } from "@/lib/types";
import { NextRequest } from "next/server";


export async function GET (
    req: NextRequest,
    { params: { userId } }: { params: { userId: string }  }
) {

   try {

        
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    //  await new Promise( r => setTimeout(r, 2000) )

    const pageSize = 8;

        const { user } = await validateRequest();

        if ( !user ) return Response.json({ error: " Unauthorized! " }, { status: 401 });


        const posts = await prisma.post.findMany({
            where: { userId },
            include: getPostDataInclude(user.id),
            orderBy: { createdAt: "desc" },
            take: pageSize + 1,
            cursor: cursor ? { id: cursor } : undefined,
        });


        const nextCursor = posts.length > pageSize ? posts[pageSize].id : null; 


        const data: PostPage = {
            posts: posts.slice(0, pageSize),
            cursor: nextCursor
        }


        return Response.json(data);

        
    } catch (error) {
        console.log(error);
        return Response.json({ error: " Internal Server Error! " }, { status: 500 });
        
    }
}