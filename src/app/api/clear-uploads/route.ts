// import prisma from "@/lib/prisma";
// import { NextRequest } from "next/server";
// import { UTApi } from "uploadthing/server";


// export async function GET( req: NextRequest ) {
//     try {

//         const authHeaders = req.headers.get("Authorization");
//         if (!authHeaders || authHeaders !== `Bearer ${process.env.CRON_SECRET}`) {
//             return Response.json({ error: " Invalid Authorization header " }, { status: 401 });
//         }

//         const unusedMedia = await prisma.media.findMany({
//             where: {
//                 postId: null,
//                  ...( process.env.NODE_ENV === "production" ? {
//                     createdAt: {
//                         lt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
//                     }
//                  } : {} )
//             },
//             select: {
//                 id: true,
//                 url: true,
//             }
//         });


//         new UTApi().deleteFiles(unusedMedia.map( m => 
//             m.id.split(`/a/${process.env.UPLOADTHING_TOKEN}/`)[1],
//         ));


//         await prisma.media.deleteMany({
//             where: {
//                 id: {
//                     in: unusedMedia.map(m => m.id)
//                 }
//             }
//         })


//         return new Response();

        
//     } catch (error) {
//          console.log(error);
//         return Response.json({ error: " Internal Server Error! " }, { status: 500 });
        
//     }
// }


import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { UTApi } from "uploadthing/server";

export async function GET(req: NextRequest) {
  try {
    const authHeaders = req.headers.get("Authorization");
    if (!authHeaders || authHeaders !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json({ error: "Invalid Authorization header" }, { status: 401 });
    }

    const unusedMedia = await prisma.media.findMany({
      where: {
        postId: null,
        ...(process.env.NODE_ENV === "production"
          ? {
              createdAt: {
                lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
              },
            }
          : {}),
      },
      select: {
        id: true,
        url: true,
      },
    });

    const keysToDelete = unusedMedia
      .map((m) => m.url?.split("/f/")[1])
      .filter(Boolean); // filter out undefined/null

    if (keysToDelete.length > 0) {
      const utapi = new UTApi();
      await utapi.deleteFiles(keysToDelete);
    }

    await prisma.media.deleteMany({
      where: {
        id: {
          in: unusedMedia.map((m) => m.id),
        },
      },
    });

    return new Response();
  } catch (error) {
    console.error("File deletion error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
