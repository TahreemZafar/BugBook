import { Metadata } from "next";
import LoginForm from "./LoginForm";
import Image from "next/image";
import loginImage from "@/assets/6.jpg";
import Link from "next/link";
import GoogleSigninButton from "./GoogleSigninButton";


export const metadata: Metadata = {
    title: "Login"
}


export default function Page () {

    return (
        <main className=" flex h-screen items-center justify-center p-3 sm:p-7 " >
            <div className="flex w-full h-full max-w-[60rem] max-h-[36rem] border border-gray-300 shadow-2xl rounded-2xl overflow-hidden bg-card ">
                <div className=" md:w-1/2 w-full sm:space-y-7 space-y-6 overflow-y-auto lg:p-10 md:p-7 sm:p-10 p-5 " >

                  <div className="text-center space-y-1 ">

                     <h1 className="font-bold text-[22px]  sm:text-[25px] lg:text-[28px] ">
                        Login to BugBook
                     </h1>
                     
                  </div>

                      <div className="space-y-4">

                        <GoogleSigninButton />

                        <div className=" flex items-center gap-3 ">

                          <div className=" h-px flex-1 bg-violet-500 " />

                          <span className="  " >OR</span>
                           
                          <div className=" h-px flex-1 bg-violet-500 " />

                        </div>

                        <LoginForm />

                        <Link
              href={"/signup"} 
              className="block text-center hover:text-purple-700 hover:underline"
            >
              Don't have an Account? Register here
            </Link>

                      </div>

                
                </div>

                 <Image
          src={loginImage}
          alt=" SignUp page Image. "
        
          className="hidden w-1/2 object-cover md:block"
        />

            </div>

        </main>
    )
}