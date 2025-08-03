"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { getUserDataSelect } from "@/lib/types";
import { updateUserProfileSchma, updateUserProfileValues } from "@/lib/validation";


export async function UpdateUserProfile( values: updateUserProfileValues ) {

    const validateValues = updateUserProfileSchma.parse(values);

    const { user } = await validateRequest();

    if ( !user ) throw new Error("Unauthorized!");


    const  updatedUser = await prisma.$transaction(async ( tx ) => {

         const updateUser = await tx.user.update({
        where: {
            id: user.id
        },
        data: validateValues,
        select: getUserDataSelect(user.id)
    })

     await streamServerClient.partialUpdateUser({
        id: user.id,
        set: {
            name: validateValues.displayName
        }
     })
     
      return updateUser;

    })


   return updatedUser;

}