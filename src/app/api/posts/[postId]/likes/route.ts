import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { LikeInfo } from "@/lib/types";


export async function GET (
    req: Request,
    { params: { postId } }: { params: { postId: string }  }
) {

    try {
            const { user: loggedInUser } = await validateRequest();
    
    
            if ( !loggedInUser ) return Response.json({ error: " Unauthorized! " }, { status: 401 })
    

            const post = await prisma.post.findMany({
                where: { id: postId },
                select: {
                    likes: {
                        where: {
                            userId: loggedInUser.id 
                        }
                    },
                    _count: {
                        select: {
                            likes: true,
                        }
                    }
                }
                          
            })

      
     if ( !post ) {         
         return Response.json({ error: " Post not Found! " }, { status: 404 })
     }  
     
     

     const data: LikeInfo = {
        likes: post[0]._count.likes,
        isLikedByUser: !!post[0].likes.length,
     }

        return Response.json(data);
    
        
    } catch (error) {

        console.log(error);
        return Response.json({ error: " Internal Server Error! " }, { status: 500 })
   
        
    }
}





export async function POST (
    req: Request,
    { params: { postId } }: { params: { postId: string }  }
) {
    try {

        const { user: loggedInUser } = await validateRequest();

        if ( !loggedInUser ) return Response.json({ error: " Unauthorized! " }, { status: 401 })


            const post = await prisma.post.findUnique({
                where: { id: postId },
                select: {
                    userId: true
                }
            })

        if ( !post ) return Response.json({ error: " Post not Found. " }, { status: 404 })




        await prisma.$transaction([

             prisma.like.upsert({
            where: {
                userId_postId: {
                    userId: loggedInUser.id,
                    postId
                }
            },
            create: {
                userId: loggedInUser.id,
                postId
            },
            update: {}
        }),

        ...( loggedInUser.id !== post.userId ? [

           prisma.notifications.create({
            data: {
                issuerId: loggedInUser.id,
                recipientId: post.userId,
                postId,
                type: "LIKE"
            }
        })  

        ] : [] )

        

        ])

        


        return new Response();


        
    } catch (error) {
        
         console.log(error);
        return Response.json({ error: " Internal Server Error! " }, { status: 500 })
        
    }
}





export async function DELETE (
    req: Request,
    { params: { postId } }: { params: { postId: string }  }
) {
    try {

        const { user: loggedInUser } = await validateRequest();

        if ( !loggedInUser ) return Response.json({ error: " Unauthorized! " }, { status: 401 })


            

            const post = await prisma.post.findUnique({
                where: { id: postId },
                select: {
                    userId: true
                }
            })

        if ( !post ) return Response.json({ error: " Post not Found. " }, { status: 404 })


          await prisma.$transaction([

             prisma.like.deleteMany({
                where: {
                    userId: loggedInUser.id,
                    postId
                }
            }),

             prisma.notifications.deleteMany({
                where: {
                    issuerId: loggedInUser.id,
                    recipientId: post.userId,
                    postId,
                    type: "LIKE"
                }
             })

          ])


            


        return new Response();
      

        
    } catch (error) {
          
         console.log(error);
        return Response.json({ error: " Internal Server Error! " }, { status: 500 })
        
    }
}