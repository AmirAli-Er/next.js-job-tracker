import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
    <div className="flex min-h-screen bg-white">
      <div className="flex-1">
        <div className="container mx-auto py-25 px-3 text-center">
          <h1 className="text-4xl font-bold py-0.5">find your dream job</h1>
          <p className="text-muted-foreground italic py-4">you can apply for a new job</p>
          <div className="flex flex-col gap-3 items-center">
            <Link href="sign-up/">
              <Button size="lg" className="p-5 font-medium">
              Signup Now <ArrowRight className="mx-1"/>
            </Button>
            </Link>
            <p className="text-muted-foreground">you can start for free and find your job</p>
          </div>
        </div>
      </div>
      
    </div>
       
    </>
  );
}
