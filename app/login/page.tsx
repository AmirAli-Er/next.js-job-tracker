"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast";
import { signIn } from "@/lib/auth/auth-client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Login(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    
    async function handleSubmit(e:React.FormEvent){
        e.preventDefault()
        setError("")
        setLoading(true)
        try{
           const result = await signIn.email({
                email,
                password
            })
            if(result.error){
                setError(result.error.message ?? "Failed to login")
            }else{
                router.push('/dashboard')
            }
        }catch(err){
            setError("There's a problem ... Try again later")
            
        }finally{
            
            setLoading(false)
        }
        if (error!==""){
          toast.add({
            type: "warning",
            description: error,
          })
        }
    }
    
    
      return (
    <div className="flex justify-center">
        <Card className="w-full max-w-lg max-h-lg" >
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your information to login
        </CardDescription>
        <CardAction>
          <Link href="/sign-up"><Button size={"lg"}>Sign up <ArrowRight/></Button></Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email" >Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="johndoe@example.com"
                required
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input value={password}
                onChange={(e)=>setPassword(e.target.value)} id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <p className="text-muted-foreground">you don&apost have account? <Link className="underline mx-2"  href={"/sign-in"}>Sign in</Link></p>
        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          Login
        </Button>
        
      </CardFooter>
    </Card>
    </div>
    )
        
}