class GoogleAuthService {
  static initiateAuthWithForm(role: "Creator" | "Recruiter") {
    const baseUrl =
      process.env.NODE_ENV === "production" ? "https://api.portgig.com/api/v1" : "https://api.portgig.com/api/v1"

    const form = document.createElement("form")
    form.method = "POST"
    form.action = `${baseUrl}/user/auth/google`
    form.style.display = "none"

    const roleInput = document.createElement("input")
    roleInput.type = "hidden"
    roleInput.name = "role"
    roleInput.value = role

    form.appendChild(roleInput)
    document.body.appendChild(form)
    form.submit()

    document.body.removeChild(form)
  }

  static async getUser(token: string) {
    try {
      const baseUrl =
        process.env.NODE_ENV === "production" ? "https://api.portgig.com/api/v1" : "https://api.portgig.com/api/v1"

      const response = await fetch(`${baseUrl}/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ token }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to get user: ${response.status} - ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Get user failed:", error)
      throw new Error(`Get user failed: ${(error as Error).message}`)
    }
  }

  static async getUserFromCookie(): Promise<any | null> {
    try {
      const response = await fetch("/api/user/me", {
        method: "GET",
        credentials: "include",
      })

      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      console.error("Failed to get user from cookie:", error)
      return null
  }
  }
}

const handleGoogleAuth = (role: "Creator" | "Recruiter") => {
  GoogleAuthService.initiateAuthWithForm(role)
}

export { GoogleAuthService, handleGoogleAuth }