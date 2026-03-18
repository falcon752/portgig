export const requestPasswordReset = async (email: string) => {
  const url = "https://api.portgig.com/api/v1/recruiter/request-password-reset"
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
    console.error("Error requesting password reset:", error)
    throw new Error(error.message || "An unexpected error occurred during password reset request.")
  }
}

export const verifyOtp = async (_email: string, otp: string): Promise<{ message: string }> => {
  if (!otp || otp.length !== 6) {
    throw new Error("Invalid or expired code. Please try again.")
  }
  return { message: "OTP verified successfully." }
}

export const resetPassword = async (email: string, password: string, otp: string) => {
  const url = "https://api.portgig.com/api/v1/recruiter/reset-password"
  try {
    const response = await fetch(url, {
      method: "PUT",
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
    console.error("Error resetting password:", error)
    throw new Error(error.message || "An unexpected error occurred during password reset.")
  }
}
