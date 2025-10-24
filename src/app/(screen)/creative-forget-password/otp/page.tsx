"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { verifyOtp } from "@/src/lib/requests/creator-reset-password";

export default function OtpInputPage() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""))
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail")
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      router.push("/creative-forget-password")
    }
  }, [router])

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return

    const newOtp = [...otp]
    newOtp[index] = element.value[element.value.length - 1] || "" 
    setOtp(newOtp)

    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData("text").slice(0, 6)
    const newOtp = pasteData.split("").filter((char) => !isNaN(Number(char)))
    setOtp(newOtp.concat(new Array(6 - newOtp.length).fill(""))) 
    newOtp.forEach((char, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = char
      }
    })
    if (newOtp.length < 6) {
      inputRefs.current[newOtp.length]?.focus()
    } else {
      inputRefs.current[5]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null) 
    const fullOtp = otp.join("")

    if (fullOtp.length !== 6) {
      setMessage({
        type: "error",
        text: "Please enter the complete 6-digit code.",
      })
      setLoading(false)
      return
    }

    if (!email) {
      setMessage({
        type: "error",
        text: "Email not found. Please restart the password reset process.",
      })
      setLoading(false)
      router.push("/forget-password")
      return
    }

    try {
      await verifyOtp(email, fullOtp)
      setMessage({
        type: "success",
        text: "OTP verified successfully.",
      })
      localStorage.setItem("verifiedOtp", fullOtp) 
      router.push("/forget-password/new-password")
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Invalid or expired code. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!email) {
    return null 
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <img
            src="/assets/mail.png"
            alt="Check your mail"
            className="mx-auto h-34 w-34 object-contain"
          />
          <h1 className="text-3xl font-bold text-foreground">Check your mail</h1>
          <p className="text-muted-foreground">We have sent a password recover instructions to your email</p>
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                ref={(el) => {
                  inputRefs.current[index] = el 
                }}
                className="h-12 w-12 rounded-md border border-gray-300 text-center text-2xl font-bold shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Did not receive the email? Check your spam folder or{" "}
            <button
              type="button"
              className="underline"
              onClick={() => {
                setMessage({ type: "error", text: "Resend code functionality not implemented in this demo." })
              }}
            >
              try another email address
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
