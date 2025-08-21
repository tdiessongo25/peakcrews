"use client";

import type { User, WorkerProfileInfo, Trade } from "@/lib/types";
import { TRADES_LIST } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Mail, Briefcase, Star, MapPin, Edit3, CheckSquare, XSquare, UploadCloud, ShieldCheck, ShieldAlert, Info } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ReviewCard } from "@/components/reviews/ReviewCard"; // Assuming this exists
import { MOCK_REVIEWS } from "@/lib/constants"; // For demo
import { ResumeUpload } from "@/components/resume/ResumeUpload";
import { ResumeParser, type ParsedResume } from "@/lib/resume-parser";

interface WorkerProfileProps {
  user: User;
  profile: WorkerProfileInfo;
  updateProfile: (data: Partial<WorkerProfileInfo>) => void;
}

export default function WorkerProfileComponent({ user, profile: initialProfile, updateProfile }: WorkerProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<WorkerProfileInfo>(initialProfile);
  const { toast } = useToast();

  const handleResumeUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'resume');

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload resume');
    }

    const data = await response.json();
    return data.url;
  };

  const handleResumeRemove = () => {
    setProfile(prev => ({ ...prev, resumeUrl: undefined }));
  };

  const handleResumeParsed = (parsedData: ParsedResume) => {
    // Auto-populate profile fields with parsed data
    setProfile(prev => ({
      ...prev,
      skills: parsedData.skills,
      experience: parsedData.experience,
      certifications: parsedData.certifications,
    }));
    
    toast({
      title: 'Profile Auto-Populated',
      description: 'Your profile has been updated with information from your resume.',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof WorkerProfileInfo, value: string) => {
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: keyof WorkerProfileInfo, checked: boolean) => {
    setProfile(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleAddCertification = () => {
    setProfile(prev => ({
      ...prev,
      certifications: [...prev.certifications, ""]
    }));
  };

  const handleCertificationChange = (index: number, value: string) => {
    const newCerts = [...profile.certifications];
    newCerts[index] = value;
    setProfile(prev => ({ ...prev, certifications: newCerts }));
  };
  
  const handleRemoveCertification = (index: number) => {
    const newCerts = profile.certifications.filter((_, i) => i !== index);
    setProfile(prev => ({ ...prev, certifications: newCerts }));
  };


  const handleSubmit = () => {
    updateProfile(profile);
    setIsEditing(false);
    toast({ title: "Profile Updated", description: "Your worker profile has been successfully updated." });
  };

  const workerReviews = MOCK_REVIEWS.filter(r => r.revieweeId === user.id && r.reviewerRole === 'hirer');

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1 space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="items-center text-center">
            <Image 
              src={user.profileImageUrl || "https://placehold.co/150x150.png"} 
              alt={user.name} 
              width={120} 
              height={120} 
              className="rounded-full border-4 border-primary mb-4"
              data-ai-hint="profile picture"
            />
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardDescription className="flex items-center justify-center text-primary">
              <Briefcase size={16} className="mr-1.5" /> {isEditing ? profile.trade : initialProfile.trade}
            </CardDescription>
             <Badge variant={profile.availability ? "default" : "outline"} className={profile.availability ? "bg-accent text-accent-foreground" : ""}>
              {profile.availability ? "Available for work" : "Not Available"}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center"><Mail size={14} className="mr-2 text-muted-foreground" /> {user.email}</div>
            <div className="flex items-center"><MapPin size={14} className="mr-2 text-muted-foreground" /> {isEditing ? profile.location : initialProfile.location || "Not specified"}</div>
            <div className="flex items-center"><Star size={14} className="mr-2 text-muted-foreground" /> Experience: {isEditing ? profile.experience : initialProfile.experience}</div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "destructive" : "default"} className="w-full">
              <Edit3 size={16} className="mr-2" /> {isEditing ? "Cancel Editing" : "Edit Profile"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl flex items-center">
                    <Info size={20} className="mr-2 text-primary" /> Profile Status
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <span className="text-sm font-medium">Overall Profile Completion</span>
                    <Badge variant="secondary">75%</Badge> {/* Placeholder */}
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <span className="text-sm font-medium">Certificates Listed</span>
                    <Badge variant="outline">
                        {profile.certifications.length} certificates
                    </Badge>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2 space-y-6">
        {isEditing ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Edit Your Profile</CardTitle>
              <CardDescription>Keep your information up-to-date to attract more job offers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="trade">Primary Trade</Label>
                <Select name="trade" value={profile.trade} onValueChange={(value) => handleSelectChange("trade", value)}>
                  <SelectTrigger><SelectValue placeholder="Select your trade" /></SelectTrigger>
                  <SelectContent>
                    {TRADES_LIST.map(trade => <SelectItem key={trade} value={trade}>{trade}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input id="experience" name="experience" value={profile.experience} onChange={handleInputChange} placeholder="e.g., 5+ years" />
              </div>
              <div>
                <Label htmlFor="location">Your Location (City, State)</Label>
                <Input id="location" name="location" value={profile.location || ""} onChange={handleInputChange} placeholder="e.g., New York, NY" />
              </div>
              <div>
                <Label htmlFor="bio">Short Bio</Label>
                <Textarea id="bio" name="bio" value={profile.bio || ""} onChange={handleInputChange} placeholder="Tell hirers about your skills and work ethic..." className="min-h-[100px]" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="availability" name="availability" checked={profile.availability} onCheckedChange={(checked) => handleSwitchChange("availability", checked)} />
                <Label htmlFor="availability">Available for new job offers</Label>
              </div>

              <div>
                <Label>Certifications / Licenses</Label>
                {profile.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2 p-2 border rounded-md bg-muted/20">
                    <Input 
                      value={cert} 
                      onChange={(e) => handleCertificationChange(index, e.target.value)} 
                      placeholder="e.g., Master Electrician License"
                      className="flex-grow"
                    />
                     <Badge variant="outline" className="whitespace-nowrap">
                        <ShieldAlert size={14} className="mr-1"/>
                        Pending
                    </Badge>
                    {/* <Button variant="outline" size="icon" className="h-8 w-8" type="button"><UploadCloud size={16} /></Button> */}
                    <Button variant="ghost" size="icon" type="button" onClick={() => handleRemoveCertification(index)} className="text-destructive hover:text-destructive/80 h-8 w-8">
                      <XSquare size={18} />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={handleAddCertification} className="mt-1">
                  <CheckSquare size={16} className="mr-2" /> Add Certification
                </Button>
                 <p className="text-xs text-muted-foreground mt-2">Certificate verification is handled by admins. Uploaded documents will be reviewed.</p>
              </div>

              <div>
                <ResumeUpload
                  currentResumeUrl={profile.resumeUrl}
                  onUpload={handleResumeUpload}
                  onRemove={handleResumeRemove}
                  required={profile.profileStatus === 'pending'}
                  className="mt-4"
                  onParsed={handleResumeParsed}
                  showParsing={true}
                />
                {profile.profileStatus === 'pending' && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Resume is required for profile approval. Please upload your resume to complete your profile.
                  </p>
                )}
              </div>

            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} className="bg-accent hover:bg-accent/90 text-accent-foreground">Save Changes</Button>
            </CardFooter>
          </Card>
        ) : (
          <>
            <Card className="shadow-lg">
              <CardHeader><CardTitle className="text-xl">About Me</CardTitle></CardHeader>
              <CardContent>
                <p className="text-foreground/90 whitespace-pre-wrap">{profile.bio || "No bio provided."}</p>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardHeader><CardTitle className="text-xl">Certifications & Licenses</CardTitle></CardHeader>
              <CardContent>
                {profile.certifications.length > 0 ? (
                  <ul className="space-y-2">
                    {profile.certifications.map((cert, index) => (
                      <li key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                        <span>{cert}</span>
                        <Badge variant="outline">
                          <ShieldAlert size={14} className="mr-1"/>
                          Pending Admin Review
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No certifications listed.</p>
                )}
              </CardContent>
            </Card>
          </>
        )}
        
        <Card className="shadow-lg">
          <CardHeader><CardTitle className="text-xl">My Reviews ({workerReviews.length})</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {workerReviews.length > 0 ? (
              workerReviews.map(review => <ReviewCard key={review.id} review={review} />)
            ) : (
              <p className="text-muted-foreground">You have not received any reviews yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
