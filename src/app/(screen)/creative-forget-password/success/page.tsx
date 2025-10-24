"use client";

import { useRouter } from "next/navigation";

export default function PasswordChangedSuccessPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg text-center">
        <div className="flex justify-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-[#0A1754] rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-18 h-18 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Password changed
          </h1>
        </div>
        <div className="space-y-4">
          <button
            className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
            onClick={() => router.push("/sign-in")}
          >
            Go back to login
          </button>
        </div>
      </div>
    </div>
  );
}
