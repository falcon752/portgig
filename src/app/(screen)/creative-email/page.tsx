"use client";

import AuthStorage, { CreatorAuth } from "@/src/lib/requests/auth.new";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { FaCheck, FaTimes } from "react-icons/fa";
import Cookies from "universal-cookie";

const cookiestore = new Cookies();

export default function VerificationCode(): React.ReactElement {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {" "}
      {/* Wrap with Suspense */}
      <VerificationCodeContent />
    </Suspense>
  );
}

function VerificationCodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [email] = useState<string>(() => {
  let emailFromParams = searchParams.get("email");
  if (!emailFromParams) {
    // Fallback for malformed URL like ?=<email>
    const url = new URL(window.location.href);
    const malformedEmail = url.searchParams.get("");
    if (malformedEmail) {
      emailFromParams = malformedEmail;
    }
  }
  if (emailFromParams) {
    return decodeURIComponent(emailFromParams);
  }

  const storedEmail = cookiestore.get("userEmail") || localStorage.getItem("userEmail");
  if (storedEmail) {
    return storedEmail;
  }

  return "";
});

  useEffect(() => {
    if (!email && typeof window !== "undefined") {
      console.warn("No email found. User should be redirected to signup.");
    }
  }, [email]);

  const handleVerifyOTPCode = useCallback(
    async () => {
      const enteredCode = code.join("");

      if (enteredCode.length !== 6 || code.includes("")) {
        setIsError(true);
        return;
      }

      const userEmail = cookiestore.get("userEmail");
      if (!userEmail) {
        toast.error("No email found. Please try again.");
        return;
      }

      setIsLoading(true);

      try {
        const response = await CreatorAuth.validateRegistration({
          token: enteredCode,
          email: userEmail,
        });

        if (response.status === 200) {
          toast.success(response.message);
          setIsVerified(true);
          setIsError(false);
          cookiestore.remove("userEmail");
          AuthStorage.clearAuth();
          setTimeout(() => {
            router.push("/welcome-onboarding?type=creator");
          }, 5000);
        }
      } catch (error) {
        console.error("Error validating OTP:", error);
        setIsError(true);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";

        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [code, router] 
  );

  const handleChange = (index: number, value: string): void => {
    if (value && !/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setCode(digits);
      inputRefs.current[5]?.focus();
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "") && code.length === 6) {
      handleVerifyOTPCode();
    }
  }, [code, handleVerifyOTPCode]);

  const handleResendOTP = async (): Promise<void> => {
    setIsVerified(false);
    setIsError(false);
    setCode(Array(6).fill(""));
    setIsLoading(true);
    try {
      const response = await CreatorAuth.resendOTP(email);
      console.log("Resend Response:", response);

      if (response.status === 200) {
        toast.success(
          response.message || "Verification code sent successfully!"
        );
        inputRefs.current[0]?.focus();
      }

      if (response.status >= 400) {
        setIsError(true);
        setErrorMessage(response.message || "Failed to resend code");
        toast.error(
          response.message || "Failed to resend code. Please try again."
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to resend verification code";
      setIsError(true);
      console.error("Error resending OTP:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className='min-h-screen flex flex-col items-center bg-gray-50 p-4 sm:p-8 md:p-10 font-sans md:bg-gray-50 max-md:bg-[url("/assets/auth-man-2.png")] max-md:bg-cover max-md:bg-no-repeat max-md:bg-center relative'>
      {/* Content wrapper with relative positioning */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="self-start mb-6">
          <Link href="/">
            <Image
              src="/assets/white-logo.png"
              alt="Portgig Logo"
              width={120}
              height={120}
              className="max-md:w-[80px] max-md:h-[80px] cursor-pointer"
            />
          </Link>
        </div>

        <div className="bg-white p-5 sm:p-8 rounded-lg shadow-lg flex flex-col gap-6 items-center text-gray-800 max-w-md w-full">
          <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl text-center">
            Verification Code
          </h2>

          <p className="text-sm sm:text-base text-center font-medium">
            {email ? (
              <>
                We have sent a 6-digit verification code to{" "}
                <strong>{email}</strong>.
              </>
            ) : (
              <>
                We have sent a 6-digit verification code to your email address.
              </>
            )}{" "}
            Please enter the code below to verify your account.
          </p>

          <div
            className="flex justify-center items-center gap-2 sm:gap-3 w-full my-2"
            onPaste={handlePaste}
          >
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-md border-2 ${
                    isError
                      ? "border-red-500 bg-red-50"
                      : isVerified
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  }`}
                  value={code[index]}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange(index, e.target.value)
                  }
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                    handleKeyDown(index, e)
                  }
                  ref={(el: HTMLInputElement | null) => {
                    inputRefs.current[index] = el;
                  }}
                  disabled={isVerified}
                  aria-label={`Digit ${index + 1} of verification code`}
                />
              ))}
          </div>

          {isVerified && (
            <div className="flex items-center gap-2 text-green-600">
              <FaCheck />
              <span className="font-medium">Verification successful!</span>
            </div>
          )}

          {isError && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <FaTimes />
              <span className="font-medium">
                {errorMessage || "Invalid code. Please try again."}
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full mt-2">
            <button
              onClick={handleVerifyOTPCode}
              disabled={isLoading || code.includes("") || isVerified}
              className={`px-6 py-3 rounded-lg w-full text-white font-semibold ${
                isLoading || code.includes("") || isVerified
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>

            <button
              onClick={handleResendOTP}
              disabled={isLoading}
              className="px-6 py-3 rounded-lg w-full border border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              {isLoading ? "Loading" : "Resend Code"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
