import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthFormType } from "@/types/auth";

interface AuthFormHeaderProps {
  type: AuthFormType;
}

const AuthFormHeader = ({ type }: AuthFormHeaderProps) => {
  const isSignIn = type === "sign-in";
  const isSignUp = type === "sign-up";
  const isRecruiterSignIn = type === "recruiter-sign-in";
  const isRecruiterSignUp = type === "recruiter-sign-up";

  return (
    <>
      <div className="max-lg:block lg:hidden self-center w-fit cursor-pointer">
        <Link href="/">
          <Image
            src="/assets/portgig-2.svg"
            alt="Portgig Logo"
            width={150}
            height={150}
          />
        </Link>
      </div>
      
      <div className="space-y-4">
        {(isSignIn || isRecruiterSignIn) && (
          <p className="max-lg:text-xl text-3xl font-inter">Sign in</p>
        )}
        {(isSignUp || isRecruiterSignUp) && (
          <p className="max-lg:text-xl text-3xl font-inter">Sign up</p>
        )}

        {isSignIn && (
          <p className="text-lg font-raleway">Welcome Creative, sign in</p>
        )}
        {isSignUp && (
          <p className="text-lg font-raleway">Welcome creative, sign up</p>
        )}
        {isRecruiterSignIn && (
          <p className="text-lg">Welcome Recruiter, sign in</p>
        )}
        {isRecruiterSignUp && (
          <p className="text-lg">Welcome Recruiter, sign up</p>
        )}
      </div>
    </>
  );
};

export default AuthFormHeader;