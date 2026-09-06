import { NextRequest, NextResponse } from "next/server";
import {getSession} from "./lib/auth/auth";
// proxy.ts ===> kind of a security checkpoint. before that user request reach to any page or API , specific works can be done by proxies
export default async function proxy(request:NextRequest){
    const session = await getSession() 
    const tabUrl = request.nextUrl.pathname
    
    const loginPage = tabUrl.startsWith('/login') || tabUrl.startsWith('/sign-up') || tabUrl == "/"
    
    if (loginPage && session?.user){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
}