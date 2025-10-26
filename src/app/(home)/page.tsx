"use client";

import { ProjectFrom } from "@/modules/home/ui/components/project-from";
import { AuthButton } from "@/components/auth/auth-button";
import { UserProjectsList } from "@/modules/home/ui/components/user-projects-list";
import { SignInButton, SignedIn, SignedOut, useUser } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Image from "next/image";

const Page = () => {
  const { isLoaded } = useUser();
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center py-4 px-4">
        <div className="flex items-center space-x-3">
          <Image
            src="/logo.svg"
            alt="Vibe"
            width={40}
            height={40}
          />
          <h2 className="text-2xl font-bold text-gray-900">Vibe</h2>
        </div>
        <SignedIn>
          <AuthButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="default">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>
      </div>

      {/* Hero Section */}
      <section className="space-y-6 py-[10vh] 2xl:py-32">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.svg"
            alt="Vibe"
            width={50}
            height={50}
            className="hidden md:block"
          />
        </div>
        <h1 className="text-2xl md:text-5xl font-bold text-center">
          Build something with Vibe
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground text-center">
          Create apps and websites by chatting with AI
        </p>
        
        {/* Always show the project form */}
        <div className="max-w-3xl mx-auto w-full">
          <ProjectFrom />
        </div>
      </section>

      {/* User Projects Section - Only show for authenticated users */}
      <SignedIn>
        <section className="py-8">
          <UserProjectsList />
        </section>
      </SignedIn>
    </div>
  );
};

export default Page;