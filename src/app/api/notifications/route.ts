import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { notificationsInclude, NotificationsPage } from "@/lib/types";
import { NextRequest } from "next/server";


export async function GET ( req: NextRequest ) {


    try {

        
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    //  await new Promise( r => setTimeout(r, 2000) )

    const pageSize = 8;

        const { user } = await validateRequest();

        if ( !user ) return Response.json({ error: " Unauthorized! " }, { status: 401 });


        const notifications = await prisma.notifications.findMany({
            where: {
                recipientId: user.id
            },
            include: notificationsInclude,
            orderBy: { createdAt: "desc" },
            take: pageSize + 1,
            cursor: cursor ? { id: cursor } : undefined,
        })

        const nextCursor = notifications.length > pageSize ? notifications[pageSize].id : null; 


        const data: NotificationsPage = {

            notifications: notifications.slice(0, pageSize),
            nextCursor

        }


        return Response.json(data);


      } catch (error) {
        console.log(error);
        return Response.json({ error: " Internal Server Error! " }, { status: 500 });
        
    }
}