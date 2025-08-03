import { Metadata } from "next";
import Image from "next/image";
import signUpImage from "@/assets/4.jpg";
import Link from "next/link"; 
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-3 sm:p-7">
      <div className="flex h-full max-h-[36rem] w-full max-w-[60rem] overflow-hidden rounded-2xl border border-gray-300 bg-card shadow-2xl">
        <div className="w-full space-y-6 overflow-y-auto p-5 sm:space-y-9 sm:p-10 md:w-1/2 md:p-7 lg:p-10">
          <div className="space-y-1 text-center">
            <h1 className="text-[22px] font-bold sm:text-[25px] lg:text-[28px]">
              Sign Up to Bugbook
            </h1>
            <p className="text-muted-foreground">
              A Place where even <span className="italic">you</span> can find a
              friend.
            </p>
          </div>

          <div className="space-y-5">
            <SignUpForm />
            <Link
              href={"/login"}
              className="block text-center hover:text-purple-700 hover:underline"
            >
              Already have an Account? Login here
            </Link>
          </div>
        </div>

        <Image
          src={signUpImage}
          alt=" SignUp page Image. "
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
