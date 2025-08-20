"use client";

import { useUser } from "@/contexts/UserContext";
import WorkerProfileComponent from "@/components/profile/WorkerProfile";
import HirerProfileComponent from "@/components/profile/HirerProfile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const { role, currentUser, workerProfile, hirerProfile, updateWorkerProfile, updateHirerProfile } = useUser();

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md text-center shadow-xl p-8">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <CardTitle className="text-2xl font-bold mb-2">Access Denied</CardTitle>
          <CardDescription className="mb-6">
            You need to be logged in to view your profile.
          </CardDescription>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/login">Login</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {role === "worker" && workerProfile && currentUser && (
        <WorkerProfileComponent 
          user={currentUser} 
          profile={workerProfile} 
          updateProfile={updateWorkerProfile} 
        />
      )}
      {role === "hirer" && hirerProfile && currentUser && (
        <HirerProfileComponent 
          user={currentUser} 
          profile={hirerProfile} 
          updateProfile={updateHirerProfile}
        />
      )}
    </div>
  );
}
