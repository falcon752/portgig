"use client";

import { RecruiterAuth } from "@/src/lib/requests/auth.new";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import * as Yup from "yup";
import AppButton from "../ui/Button";
import LabelInput from "../ui/LabelInput";
import Link from "next/link";
import Image from "next/image";
import { handleGoogleAuth } from "@/service/googleAuth";
import VerificationModal from "@/src/components/VerificationModal"; 

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const ADMIN_EMAILS = ["portgigacademy@gmail.com"];

export default function RecruiterLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [recruiterName, setRecruiterName] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setError("");
        const response = await RecruiterAuth.login(values);
        toast.success(response.message || "Login successful");

        const userEmail = response.profile?.auth?.email;
        const isAdmin =
          userEmail && ADMIN_EMAILS.includes(userEmail.toLowerCase());

        setTimeout(() => {
          if (isAdmin) {
            router.push("/dashboard");
          } else {
            router.push("/recruiter-homepage");
          }
        }, 2000);
      } catch (error: any) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Login failed. Please try again.";

        // Check if the error is related to account verification
        if (errorMessage.toLowerCase().includes("your account is not active") || 
            errorMessage.toLowerCase().includes("account not active") ||
            errorMessage.toLowerCase().includes("please contact support")) {
          
          // Extract recruiter name from response if available, or use email as fallback
          const name = error?.response?.data?.profile?.name || 
                      error?.response?.data?.recruiterName || 
                      values.email.split('@')[0];
          
          setRecruiterName(name);
          setShowVerificationModal(true);
        } else {
          setError(errorMessage);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const labelStyles = "block lg:text-[16px] text-xs font-light font-raleway";

  return (
    <main className="w-full px-5 lg:px-0 lg:w-4/5 m-auto h-screen flex flex-col justify-center items-start gap-4 lg:pt-20">
      <div className="w-full text-center mb-1 lg:hidden">
        <Link href="/">
          <Image
            src="/assets/portgig-2.svg"
            alt="Portgig Logo"
            width={100}
            height={100}
            className="w-[100px] h-[100px] mx-auto"
          />
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-inter font-normal">Sign In </h1>
        <p className="text-xl font-raleway">Welcome recruiter, sign-in</p>
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="w-full flex flex-col gap-5"
      >
        <div className="flex flex-col gap-1">
          <LabelInput
            type="email"
            id="email"
            name="email"
            label="Email"
            placeholder="Enter your email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            error={formik.touched.email ? formik.errors.email : undefined}
          />
        </div>

        <div className="flex flex-col gap-1">
          <LabelInput
            type="password"
            id="password"
            name="password"
            label="Password"
            placeholder="Enter your password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            error={formik.touched.password ? formik.errors.password : undefined}
          />
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}
        <div className="flex items-center space-x-2 text-white mt-4">
          <input
            type="checkbox"
            id="keepLoggedIn"
            name="keepLoggedIn"
            className="w-4 h-4 text-secondary focus:ring-secondary rounded"
          />
          <label htmlFor="keepLoggedIn" className={`${labelStyles}`}>
            Keep me logged in
          </label>
        </div>
        <div className="flex flex-col gap-4 lg:gap-5">
          <AppButton
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full"
          >
            {formik.isSubmitting ? "Signing in..." : "Sign in"}
          </AppButton>
          <div className="flex items-center my-3 lg:my-6">
            <div className="grow h-px bg-gray-300"></div>
            <span className="mx-2 text-gray-500 text-sm">or</span>
            <div className="grow h-px bg-gray-300"></div>
          </div>
          <AppButton
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => handleGoogleAuth("Recruiter")}
            disabled={formik.isSubmitting}
          >
            {"Sign in with Google"}
            <FcGoogle size={24} />
          </AppButton>

          <Link
            href="/recruiter-forget-password"
            className="text-xs text-white text-center font-raleway mt-0 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </form>

      <p className="text-sm text-white text-center mx-auto flex justify-center items-center gap-1 lg:gap-3">
        Don&apos;t have an account?{" "}
        <a
          href="/recruiter-sign-up"
          className="text-white font-semibold hover:underline"
        >
          Sign up
        </a>
      </p>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        recruiterName={recruiterName}
      />
    </main>
  );
}