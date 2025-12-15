// Mock auth service
export const authService = {
  async signIn(email: string, password: string) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (!email || !password) {
      throw new Error("Email and password are required")
    }

    return {
      id: "1",
      name: "Learner",
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    }
  },

  async signUp(name: string, email: string, password: string) {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (!name || !email || !password) {
      throw new Error("All fields are required")
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters")
    }

    return {
      id: Date.now().toString(),
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    }
  },

  async logout() {
    await new Promise((resolve) => setTimeout(resolve, 300))
  },

  async getCurrentUser() {
    // Check localStorage for persisted user
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user")
      if (stored) {
        return JSON.parse(stored)
      }
    }
    return null
  },
}

// Persist user to localStorage
export const persistUser = (user: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user))
  }
}

export const clearUser = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
  }
}
