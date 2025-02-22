import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"
import Link from "next/link"
import { Check } from "lucide-react"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header - Responsive navigation */}
      <header className="flex items-center justify-between p-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="#" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-blue-600" />
            <span className="font-medium">To do List</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm">
              Feature
            </Link>
            <Link href="#pricing" className="text-sm">
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="hidden md:inline-flex">
            Login
          </Button>
          <Button size="sm">Get Started</Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - Responsive layout */}
        <section className="px-4 py-8 md:py-12 lg:py-16 md:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto lg:mx-0">
            <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
              Get More Done, Less Stress. Simplify and Stay Organized!
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              A To-Do List that organizes tasks, prioritizes effectively, and helps you stay on track to focus on what
              matters.
            </p>
            <Button className="mt-6" size="lg">
              Get Started
            </Button>
          </div>
        </section>

        {/* Feature Cards - Grid layout changes per breakpoint */}
        <section className="px-4 py-8 md:py-12 lg:py-16 md:px-6 lg:px-8" id="features">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">How This To-Do List Helps You</h2>
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border p-6">
                <div className="flex flex-col items-center text-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mobile-jk30zJI0c5qdtu7Gp1JsgipQH5shKU.png"
                    alt="Smart Integrations"
                    width={200}
                    height={200}
                    className="mb-4"
                  />
                  <h4 className="font-medium">Smart Integrations</h4>
                  <p className="text-sm text-muted-foreground">Connect easily with Google Calendar</p>
                </div>
              </div>

              <div className="rounded-lg border p-6">
                <div className="flex flex-col items-center text-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mobile-jk30zJI0c5qdtu7Gp1JsgipQH5shKU.png"
                    alt="Automated Reminders"
                    width={200}
                    height={200}
                    className="mb-4"
                  />
                  <h4 className="font-medium">Automated Reminders</h4>
                  <p className="text-sm text-muted-foreground">Get alerts so you never forget a task</p>
                </div>
              </div>

              <div className="rounded-lg border p-6">
                <div className="flex flex-col items-center text-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mobile-jk30zJI0c5qdtu7Gp1JsgipQH5shKU.png"
                    alt="Smart Integrations"
                    width={200}
                    height={200}
                    className="mb-4"
                  />
                  <h4 className="font-medium">Smart Integrations</h4>
                  <p className="text-sm text-muted-foreground">Break big tasks into simple steps</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - Side by side on larger screens */}
        <section className="px-4 py-8 md:py-12 lg:py-16 md:px-6 lg:px-8" id="faq">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:gap-12">
              <div className="lg:w-1/3">
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                <p className="text-sm text-muted-foreground mb-6 lg:mb-0">
                  Everything You Need to Know About Our To-Do List, Its Features, and How It Can Improve Your
                  Productivity
                </p>
              </div>
              <div className="lg:w-2/3">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do the Free and Premium plans compare?</AccordionTrigger>
                    <AccordionContent>
                      The Premium plan includes advanced features like custom task categories and unlimited
                      integrations.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Can I cancel my Premium Plan anytime?</AccordionTrigger>
                    <AccordionContent>Yes, you can cancel your Premium subscription at any time.</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Does this work on mobile devices?</AccordionTrigger>
                    <AccordionContent>
                      Yes, our app is fully responsive and works on all mobile devices.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>How do smart integrations work?</AccordionTrigger>
                    <AccordionContent>
                      Smart integrations allow you to connect with your favorite apps and services seamlessly.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>Is there a trial for the Premium Plan?</AccordionTrigger>
                    <AccordionContent>Yes, you can try all Premium features free for 14 days.</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section - Responsive grid */}
        <section className="px-4 py-8 md:py-12 lg:py-16 md:px-6 lg:px-8" id="pricing">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">
              All Features, One Price – Simple & Transparent Pricing
            </h2>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="rounded-lg border p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold">FREE</h3>
                <ul className="mt-6 space-y-3">
                  {[
                    "Basic task management",
                    "Smart reminders",
                    "Limited integrations",
                    "Recurring tasks",
                    "Custom task categories",
                    "Dark mode option",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full">Get Started</Button>
              </div>

              <div className="rounded-lg bg-blue-600 p-6 text-white hover:shadow-lg transition-shadow">
                <div className="flex items-baseline gap-1">
                  <h3 className="text-2xl font-bold">$5</h3>
                  <span className="text-sm opacity-90">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {[
                    "Everything in Free Plan",
                    "Advanced task prioritization",
                    "Unlimited integrations",
                    "Custom task categories",
                    "Task notes option",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full bg-white text-blue-600 hover:bg-gray-100">Get Pro</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Responsive layout */}
      <footer className="bg-gray-900 text-white px-4 py-8 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-full lg:col-span-2">
              <h3 className="text-lg font-semibold">Stay organized and accomplish more with less effort.</h3>
              <p className="mt-2 text-gray-400">📧 support@example.com</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Quick Links</h4>
              <nav className="flex flex-col space-y-2 text-sm text-gray-400">
                <Link href="#features">Feature</Link>
                <Link href="#pricing">Pricing</Link>
              </nav>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-400">
            <p>© Copyright 2024, All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

