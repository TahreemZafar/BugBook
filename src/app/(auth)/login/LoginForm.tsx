"use client";

import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Login } from './actions';
import { signInSchema, SignInValues } from '@/lib/validation';
import { PasswordInput } from '@/components/other/PasswordInput';
import LoadingButton from '@/components/other/loadingButton';


export default function SignUpForm() {

    const [ error, setError ] = useState<string>();

     const [ isPending, startTransition ] = useTransition()


    const form = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    });


    async function onSubmit ( values: SignInValues ) {

         setError(undefined);

         startTransition( async () => {

             const {error} = await Login(values);

              if ( error ) setError(error);

         } )

    }


  return  <Form { ...form } >

     <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-3 ">

      { error && <p className=' text-center text-destructive ' >{error}</p> }


        <FormField 
            control={form.control}
            name="username"
            render={
                ({ field }) => (
                     <FormItem>

                        <FormLabel>UserName</FormLabel>
                        <FormControl>
                            <Input placeholder='Username' { ...field }  />
                        </FormControl>

                         <FormMessage />

                     </FormItem>
                )
            }
         
        />


        <FormField 
            control={form.control}
            name="password"
            render={
                ({ field }) => (
                     <FormItem>

                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <PasswordInput
                             placeholder='Password' type='password' { ...field }  />
                        </FormControl>

                         <FormMessage />

                     </FormItem>
                )
            }
         
        />

        


         <LoadingButton loading={isPending} type='submit' className=' w-full text-md ' >Log In</LoadingButton>

     </form>

  </Form>

}
