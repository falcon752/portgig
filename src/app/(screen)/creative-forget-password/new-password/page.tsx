"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { resetPassword } from "@/src/lib/requests/creator-reset-password" 

export default function CreateNewPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [otp, setOtp] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail")
    const storedOtp = localStorage.getItem("verifiedOtp")
    if (storedEmail && storedOtp) {
      setEmail(storedEmail)
      setOtp(storedOtp)
    } else {
      // Redirect if email or OTP is missing (user might have directly navigated here)
      setMessage({
        type: "error",
        text: "Please complete the previous steps to reset your password.",
      })
      router.push("/forget-password")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null) // Clear previous messages

    if (password.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters.",
      })
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Passwords do not match.",
      })
      setLoading(false)
      return
    }

    if (!email || !otp) {
      setMessage({
        type: "error",
        text: "Missing email or OTP. Please restart the process.",
      })
      setLoading(false)
      router.push("/forget-password")
      return
    }

    try {
      await resetPassword(email, password, otp)
      setMessage({
        type: "success",
        text: "Your password has been reset successfully.",
      })
      localStorage.removeItem("resetEmail") // Clear stored data
      localStorage.removeItem("verifiedOtp")
      router.push("/forget-password/success")
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to reset password. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!email || !otp) {
    return null // Or a loading spinner
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-foreground">Create new password</h1>
          <p className="text-muted-foreground">Your new password must be different from previous used passwords.</p>
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            <p className="text-sm text-muted-foreground">Must be at least 8 characters.</p>
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  )
}
