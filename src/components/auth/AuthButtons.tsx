"use client";
import React from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { AuthFormType } from "@/types/auth";
import AuthButton from "@/src/app/(auth)/AuthButton";

interface AuthButtonsProps {
  isLoading: boolean;
  type: AuthFormType;
}

const AuthButtons = ({ isLoading, type }: AuthButtonsProps) => {
  const isSignIn = type === "sign-in";

  return (
    <>
      <AuthButton
        type="submit"
        className="bg-white w-full text-primary mt-2 py-3 rounded-lg flex justify-center items-center cursor-pointer transition duration-300 hover:bg-gray-200"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="loader border-2 border-primary border-t-transparent rounded-full w-6 h-6 animate-spin"></span>
        ) : (
          <p className="max-md:text-lg text-2xl font-bold ">Sign In</p>
        )}
      </AuthButton>

      <div className="flex items-center gap-5 w-full my-4">
        <hr className="border-t border-t-white grow" />
        <p className="text-white">or</p>
        <hr className="border-t border-t-white grow" />
      </div>

      <AuthButton
        onClick={() => {}}
        className="border-2 border-white w-full text-white mt-2 py-3 px-10 rounded-lg cursor-pointer transition duration-300 hover:bg-white hover:text-primary"
      >
        <div className="flex justify-center items-center gap-3">
          <p className="max-md:text-sm text-2xl">Continue with Google</p>
          <FcGoogle size={24}/>
        </div>
      </AuthButton>

      <p className="text-center font-light mt-4">
        Don&apos;t have an account wit Portgig?{" "}
        <Link href={isSignIn ? "/sign-up" : "/recruiter-sign-up"}>
          <span className="font-black underline">Sign Up</span>
        </Link>
      </p>
    </>
  );
};

export default AuthButtons;
