"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { requestPasswordReset } from "@/src/lib/requests/recruiter-reset-password";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      await requestPasswordReset(email)
      setMessage({
        type: "success",
        text: "OTP sent to your email. Please check your inbox.",
      })
      localStorage.setItem("resetEmail", email)
      router.push("/recruiter-forget-password/otp")
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to send reset instructions. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex p-4 sm:flex sm:items-center sm:justify-center sm:min-h-screen sm:bg-gray-100">
      {" "}
      <div className="w-full max-w-md space-y-6 p-2 font-raleway sm:rounded-lg sm:bg-white sm:p-8 sm:shadow-lg">
        {" "}
        <div className="space-y-2">
          <h1 className="text-[#0A1754] text-2xl font-bold">Reset password</h1>
          <p className="text-[#0A1754] text-base">
            Enter the email associated with your account and we&apos;ll send an email with instructions to reset your
            password.
          </p>
        </div>
        {message && (
          <div
            className={`p-3 rounded-md text-sm ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-xl font-medium text-[#0A1754]">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-xl border border-[#0A1754] px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-4 py-4 text-white font-semibold text-base hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send instructions"}
          </button>
        </form>
      </div>
    </div>
  )
}
