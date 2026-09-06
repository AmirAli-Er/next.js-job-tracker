"use client"

import Link from "next/link"
import { Briefcase } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { signOut, useSession } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data, isPending } = useSession()
    const route = useRouter()
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
        {
          isPending ? <p>loading...</p> :data?.user ? (
          <>
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={<Link href="/dashboard">Dashboard</Link>}
                  />
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink onClick={async()=>{
                    const result = await signOut()
                    if (result.data){
                        route.push('/sign-up')
                    }else{
                        alert("somthing went wrong")
                    }
                    }}>
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
        )
        }
      </div>
    </nav>
  )
}