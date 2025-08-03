import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import {  getPostDataInclude, PostPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET ( req: NextRequest ) {


    try {

        
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    //  await new Promise( r => setTimeout(r, 2000) )

    const pageSize = 8;

        const { user } = await validateRequest();

        if ( !user ) return Response.json({ error: " Unauthorized! " }, { status: 401 });


       const bookmarks = await prisma.bookmark.findMany({
          where: {
             userId: user.id
          },
          include: {
             post: {
                include: getPostDataInclude(user.id)
             }
          },
          orderBy: {
            createdAt: "desc"
          },
          take: pageSize + 1,
          cursor: cursor ? { id: cursor } : undefined
       })


        const nextCursor = bookmarks.length > pageSize ? bookmarks[pageSize].id : null; 


        const data: PostPage = {
            posts: bookmarks.slice(0, pageSize).map(b => b.post), 
            cursor: nextCursor
        }


        return Response.json(data);

        
    } catch (error) {
        console.log(error);
        return Response.json({ error: " Internal Server Error! " }, { status: 500 });
        
    }
}