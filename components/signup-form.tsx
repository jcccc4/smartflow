"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { signup } from "@/utils/actions/actions";
import Link from "next/link";
import GoogleSignIn from "./google-signin-button";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[#1a1f27] text-lg font-normal">Welcome to</p>
              <p className="text-[#0d6cf2] text-xl font-semibold">SMARTFLOW</p>
            </div>
            <div className="text-right">
              <p className="text-[#7d8692] text-sm">Have an Account?</p>
              <Link
                href="/login"
                className="text-[#0d6cf2] text-sm font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <h1 className="text-4xl font-bold mb-8 text-[#000000]">Sign up</h1>

          <form className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-[#1a1f27] font-medium"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border border-[#ebebeb] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d6cf2]"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-[#1a1f27] font-medium"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Username"
                className="w-full px-3 py-2 border border-[#ebebeb] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d6cf2]"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-[#1a1f27] font-medium"
              >
                Enter your Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 border border-[#ebebeb] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d6cf2]"
              />
            </div>

            <Button
              type="submit"
              formAction={signup}
              className="w-full py-3 bg-[#0d6cf2] text-white font-medium rounded-md hover:bg-[#0d6cf2]/90 transition-colors"
            >
              Sign in
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[#ebebeb]"></div>
              <span className="flex-shrink mx-4 text-[#7d8692]">OR</span>
              <div className="flex-grow border-t border-[#ebebeb]"></div>
            </div>

            <GoogleSignIn />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
