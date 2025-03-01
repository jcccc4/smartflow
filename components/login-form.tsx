"use client"

import { useState } from "react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { login } from "@/utils/actions/actions"
import GoogleSignIn from "./google-signin-button"

export default function LoginForm() {
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#000000]">Sign in</h1>
          <div className="text-sm">
            <span className="text-[#7d8692]">No Account?</span>{" "}
            <Link href="/signup" className="text-[#0d6cf2] hover:underline">
              Sign up
            </Link>
          </div>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-[#000000]">
              Enter your username or email address
            </label>
            <Input
              id="email"
              name="email"
              type="text"
              placeholder="Username or email address"
              className="w-full border border-[#ebebeb] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0d6cf2]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-[#000000]">
              Enter your Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className="w-full border border-[#ebebeb] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0d6cf2]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-[#7d8692] data-[state=checked]:bg-[#0d6cf2] data-[state=checked]:border-[#0d6cf2]"
              />
              <label htmlFor="remember" className="text-sm text-[#000000]">
                Remember me
              </label>
            </div>
            <Link href="#" className="text-sm text-[#000000] hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            formAction={login}
            className="w-full bg-[#0d6cf2] hover:bg-[#0d6cf2]/90 text-white py-3 rounded-md transition-colors"
          >
            Sign in
          </Button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#ebebeb]"></div>
            </div>
            <div className="relative px-4 text-sm bg-white text-[#7d8692]">OR</div>
          </div>

          <GoogleSignIn />
        </form>
      </div>
    </div>
  )
}

