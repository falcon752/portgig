import { CreatorAuth } from "@/src/lib/requests/auth.new" 

export const requestPasswordReset = async (email: string) => {
  const url = "https://api.portgig.com/api/v1/creator/request-password-reset"
  try {
    const response = await fetch(url, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "EMAIL",
        email: email,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
     
      throw new Error(data.message || data.error || "Failed to request password reset")
    }

    return data
  } catch (error: any) {
    console.error("Error requesting password reset (direct fetch):", error)
    throw new Error(error.message || "An unexpected error occurred during password reset request.")
  }
}

export const verifyOtp = async (email: string, otp: string) => {
  console.log("Attempting OTP verification via CreatorAuth.validateRegistration:", otp, "for email:", email)
  try {
   
    const response = await CreatorAuth.validateRegistration({ token: otp, email: email })
    if (response.status === 200) {
      return { message: response.message || "OTP verified successfully." }
    } else {
      throw new Error(response.message || "Invalid or expired code. Please try again.")
    }
  } catch (error: any) {
    console.error("Error during OTP verification:", error)
    throw new Error(error.message || "Invalid or expired code. Please try again.")
  }
}

export const resetPassword = async (email: string, password: string, otp: string) => {
  const url = "https://api.portgig.com/api/v1/creator/reset-password"
  try {
   
    const response = await fetch(url, {
      method: "PUT", // As per your curl command
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        token: otp,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || data.error || "Failed to reset password")
    }

    return data
  } catch (error: any) {
    console.error("Error resetting password (direct fetch):", error)
    throw new Error(error.message || "An unexpected error occurred during password reset.")
  }
}
