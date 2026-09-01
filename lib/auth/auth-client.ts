// this file handles settings and authentication in client side

import { createAuthClient } from "better-auth/react";


export const authClient = createAuthClient({
    baseURL:process.env.NEXT_PUBLIC_BETTER_AUTH_URL!,

})

export const {signIn, signUp, signOut, useSession} = authClient