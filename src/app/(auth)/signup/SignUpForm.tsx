"use client";

import { signUpSchema, SignUpValues } from '@/lib/validation';
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SignUp } from './actions';
import LoadingButton from '@/components/other/loadingButton';
import { PasswordInput } from '@/components/other/PasswordInput';


export default function SignUpForm() {

    const [ error, setError ] = useState<string>();

     const [ isPending, startTransition ] = useTransition()


    const form = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            username: "",
            password: ""
        }
    });


    async function onSubmit ( values: SignUpValues ) {

         setError(undefined);

         startTransition( async () => {

             const {error} = await SignUp(values);

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
            name="email"
            render={
                ({ field }) => (
                     <FormItem>

                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder='Email' { ...field }  />
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

        


         <LoadingButton loading={isPending} type='submit' className=' w-full text-md ' >Create Account</LoadingButton>

     </form>

  </Form>

}
