
"use client";

import type { User, HirerProfileInfo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserCircle, Mail, Building, Phone, Edit3 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ReviewCard } from "@/components/reviews/ReviewCard"; 
import { MOCK_REVIEWS } from "@/lib/constants"; 

interface HirerProfileProps {
  user: User;
  profile: HirerProfileInfo;
  updateProfile: (data: Partial<HirerProfileInfo>) => void;
}

export default function HirerProfileComponent({ user, profile: initialProfile, updateProfile }: HirerProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<HirerProfileInfo>(initialProfile);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    updateProfile(profile);
    setIsEditing(false);
    toast({ title: "Profile Updated", description: "Your contractor profile has been successfully updated." });
  };

  const contractorReviews = MOCK_REVIEWS.filter(r => r.revieweeId === user.id && r.reviewerRole === 'worker');

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1 space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="items-center text-center">
            <Image 
              src={user.profileImageUrl || "https://placehold.co/150x150.png"} 
              alt={user.name} // User name can be company name for contractors
              width={120} 
              height={120} 
              className="rounded-full border-4 border-primary mb-4"
              data-ai-hint="company logo"
            />
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardDescription className="flex items-center justify-center text-primary">
              <Building size={16} className="mr-1.5" /> {isEditing ? profile.companyName : initialProfile.companyName} (Contractor)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center"><Mail size={14} className="mr-2 text-muted-foreground" /> {user.email}</div>
            <div className="flex items-center"><Phone size={14} className="mr-2 text-muted-foreground" /> {isEditing ? profile.contactNumber : initialProfile.contactNumber || "Not specified"}</div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "destructive" : "default"} className="w-full">
              <Edit3 size={16} className="mr-2" /> {isEditing ? "Cancel Editing" : "Edit Profile"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="md:col-span-2 space-y-6">
        {isEditing ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Edit Your Contractor Profile</CardTitle>
              <CardDescription>Provide clear information about your company to attract the best tradespeople for your projects.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" name="companyName" value={profile.companyName} onChange={handleInputChange} placeholder="Your Company LLC" />
              </div>
              <div>
                <Label htmlFor="contactNumber">Contact Phone Number</Label>
                <Input id="contactNumber" name="contactNumber" value={profile.contactNumber || ""} onChange={handleInputChange} placeholder="e.g., 555-123-4567" />
              </div>
              <div>
                <Label htmlFor="companyInfo">About Your Company</Label>
                <Textarea id="companyInfo" name="companyInfo" value={profile.companyInfo || ""} onChange={handleInputChange} placeholder="Briefly describe your company, types of projects, and what you look for in tradespeople..." className="min-h-[100px]" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} className="bg-accent hover:bg-accent/90 text-accent-foreground">Save Changes</Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="shadow-lg">
            <CardHeader><CardTitle className="text-xl">About {profile.companyName}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-foreground/90 whitespace-pre-wrap">{profile.companyInfo || "No company information provided."}</p>
            </CardContent>
          </Card>
        )}
        
        <Card className="shadow-lg">
          <CardHeader><CardTitle className="text-xl">Reviews Received as Contractor ({contractorReviews.length})</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {contractorReviews.length > 0 ? (
              contractorReviews.map(review => <ReviewCard key={review.id} review={review} />)
            ) : (
              <p className="text-muted-foreground">Your company has not received any reviews yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
