"use server";

import prisma from "@/lib/prisma";
import { signInSchema, SignInValues } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { verify } from "@node-rs/argon2"; // Assuming argon2 is used for password hashing
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";




export async function Login ( credentials: SignInValues ): Promise<{ error: string }> {

    try {

        const { username, password } = signInSchema.parse(credentials);

        const existingUser = await prisma.user.findFirst({
            where: { 
                username: {
                    equals: username,
                    mode: "insensitive" // Case-insensitive match
                }
            }
        })


        if ( !existingUser || !existingUser?.passwordHash ) {
            return { error: "Invalid username or password." };
        }

        const validPassword = await verify( existingUser.passwordHash, password, {
            memoryCost: 14596,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1,
        } )


         if ( !validPassword ) {
            return { error: "Invalid username or password." };

        }


          const session = await lucia.createSession(existingUser.id, {});
          const sessionCookie = lucia.createSessionCookie(session.id);
          cookies().set(
            sessionCookie.name,
            sessionCookie.value,      
            sessionCookie.attributes
          )


           return redirect('/');


        
    } catch (error) {

         if ( isRedirectError(error) ) throw error;

        console.log(error);
        return { error: "An unexpected error occurred. Please try again later." };
        
    }

}