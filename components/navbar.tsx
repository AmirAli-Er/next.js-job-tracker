"use client"

import Link from "next/link"
import { Briefcase } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { useSession } from "@/lib/auth/auth-client"

export default function Navbar() {
  const { data } = useSession()

  return (
    <nav className="flex w-full items-center justify-between p-3">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center font-semibold text-primary"
      >
        <Briefcase className="mr-3 h-5 w-5" />
        <h1>Job Tracker</h1>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-6">
        {data?.user ? (
          <>
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={<Link href="/dashboard">Dashboard</Link>}
                  />
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink>
                    Sign out
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <p className="text-sm font-medium">
              Welcome, {data.user.name}
            </p>
          </>
        ) : (
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
            
              <NavigationMenuItem>
                <NavigationMenuLink
                  render={<Link href="/sign-up">Sign up & Login</Link>}
                />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}
      </div>
    </nav>
  )
}