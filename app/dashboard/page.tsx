import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard(){
    const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session) {
    redirect("/sign-up");
  }
    
    return(
        <div>dashboard</div>
    )
}