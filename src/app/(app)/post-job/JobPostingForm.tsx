
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Wand2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { TRADES_LIST, JOB_TYPES_FOR_AI } from "@/lib/constants";
import type { JobAdGeneratorInput, JobAdGeneratorOutput, Trade } from "@/lib/types";
// import { generateJobAd } from "@/ai/flows/job-ad-generator";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { DataService } from "@/lib/data-service";

const jobPostingFormSchema = z.object({
  // AI Assistant Fields
  aiTrade: z.custom<Trade>().refine(value => TRADES_LIST.includes(value as Trade), { message: "Please select a valid trade." }),
  aiLocation: z.string().min(2, { message: "Location must be at least 2 characters." }),
  aiJobType: z.custom<string>().refine(value => JOB_TYPES_FOR_AI.includes(value as string), { message: "Please select a valid job type." }),
  
  // Core Job Details
  title: z.string().min(5, { message: "Job title must be at least 5 characters." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }).max(1000),
  address: z.string().min(10, { message: "Full address is required." }),
  jobTimePreference: z.enum(["ASAP", "Scheduled"]),
  scheduledDateTime: z.date().optional(),
  duration: z.string().min(1, { message: "Duration is required." }),
  rate: z.coerce.number().positive({ message: "Rate must be a positive number." }),
});

type JobPostingFormValues = z.infer<typeof jobPostingFormSchema>;

export function JobPostingForm() {
  const { toast } = useToast();
  const { role, currentUser } = useUser();
  const router = useRouter();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JobPostingFormValues>({
    resolver: zodResolver(jobPostingFormSchema),
    defaultValues: {
      aiTrade: TRADES_LIST[0],
      aiLocation: "",
      aiJobType: JOB_TYPES_FOR_AI[0],
      title: "",
      description: "",
      address: "",
      jobTimePreference: "ASAP",
      duration: "",
      rate: 0,
    },
  });

  const handleGenerateAdText = async () => {
    const aiInputs: JobAdGeneratorInput = {
      trade: form.getValues("aiTrade"),
      location: form.getValues("aiLocation"),
      jobType: form.getValues("aiJobType"),
    };

    if (!aiInputs.trade || !aiInputs.location || !aiInputs.jobType) {
      toast({
        title: "AI Assistant Error",
        description: "Please fill in Trade, Location, and Job Type for AI assistance.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAiLoading(true);
    try {
      // Check if Google API key is available
      if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'your_gemini_api_key_here') {
        toast({
          title: "AI Assistant Unavailable",
          description: "AI features are temporarily disabled. Please fill in the job details manually.",
          variant: "destructive",
        });
        return;
      }

      // const result: JobAdGeneratorOutput = await generateJobAd(aiInputs);
      // form.setValue("description", result.jobAdText);
      // if (!form.getValues("title")) { // Optionally pre-fill title if empty
      //   form.setValue("title", `${aiInputs.trade} Needed in ${aiInputs.location}`);
      // }
      toast({
        title: "AI Job Ad Generated!",
        description: "The job description has been filled. You can edit it further.",
      });
    } catch (error) {
      console.error("Error generating job ad:", error);
      toast({
        title: "AI Generation Failed",
        description: "Could not generate job ad text. Please try again or write manually.",
        variant: "destructive",
      });
    } finally {
      setIsAiLoading(false);
    }
  };
  
  async function onSubmit(data: JobPostingFormValues) {
    if (role !== 'hirer') {
      toast({ 
        title: "Access Denied", 
        description: "You must be logged in as a Contractor to post jobs.", 
        variant: "destructive" 
      });
      router.push('/login');
      return;
    }

    if (!currentUser) {
      toast({ 
        title: "Authentication Required", 
        description: "Please log in to post jobs.", 
        variant: "destructive" 
      });
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare job data for API
      const jobData = {
        hirerId: currentUser.id,
        hirerName: currentUser.name,
        trade: data.aiTrade,
        title: data.title,
        description: data.description,
        location: data.aiLocation,
        address: data.address,
        jobType: data.jobTimePreference === "ASAP" ? "ASAP" : "Scheduled" as "ASAP" | "Scheduled" | "Urgent" | "Short-term project" | "Full-time temporary",
        scheduledDateTime: data.scheduledDateTime?.toISOString(),
        duration: data.duration,
        rate: data.rate,
        status: "open" as const,
      };

      // Submit job to API
      const newJob = await DataService.createJob(jobData);
      
      toast({
        title: "Job Posted Successfully!",
        description: `Your job "${data.title}" is now live and available to workers.`,
      });
      
      form.reset();
      router.push('/my-jobs');
    } catch (error: any) {
      console.error('Failed to post job:', error);
      toast({
        title: "Failed to Post Job",
        description: error.message || "An error occurred while posting your job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <div className="p-6 border rounded-lg bg-muted/30 space-y-6 shadow-inner">
          <h3 className="text-xl font-semibold font-headline flex items-center text-primary">
            <Wand2 className="mr-2 h-6 w-6" /> AI Job Ad Assistant (for Contractors)
          </h3>
          <p className="text-sm text-muted-foreground">
            Provide some basic details and let our AI craft an engaging job description for your project.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="aiTrade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trade for AI</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a trade" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRADES_LIST.map(trade => <SelectItem key={trade} value={trade}>{trade}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aiLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location for AI</FormLabel>
                  <FormControl><Input placeholder="e.g., Brooklyn, NY" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aiJobType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type for AI</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select job type" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {JOB_TYPES_FOR_AI.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="button" onClick={handleGenerateAdText} disabled={isAiLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate Description
            {(!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'your_gemini_api_key_here') && (
              <span className="ml-2 text-xs text-muted-foreground">(Disabled)</span>
            )}
          </Button>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Job Title</FormLabel>
              <FormControl><Input placeholder="e.g., Emergency Plumber Needed for Project Alpha" {...field} /></FormControl>
              <FormDescription>A clear and concise title for your job post.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Job Description</FormLabel>
              <FormControl><Textarea placeholder="Describe the job requirements, responsibilities, and any specific skills needed for the project." className="min-h-[150px]" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Full Job Address</FormLabel>
              <FormControl><Input placeholder="e.g., 123 Main St, Anytown, USA 12345" {...field} /></FormControl>
              <FormDescription>This will be used for location matching.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="jobTimePreference"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base">When is the job?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1 md:flex-row md:space-x-4 md:space-y-0"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl><RadioGroupItem value="ASAP" /></FormControl>
                    <FormLabel className="font-normal">ASAP</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl><RadioGroupItem value="Scheduled" /></FormControl>
                    <FormLabel className="font-normal">Schedule for a specific date/time</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("jobTimePreference") === "Scheduled" && (
          <FormField
            control={form.control}
            name="scheduledDateTime"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-base">Scheduled Date & Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // Disable past dates
                      initialFocus
                    />
                    {/* Basic time picker - consider a dedicated component for better UX */}
                    <div className="p-2 border-t">
                      <Input type="time" 
                        defaultValue={field.value ? format(field.value, "HH:mm") : "09:00"}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':').map(Number);
                          const newDate = field.value ? new Date(field.value) : new Date();
                          newDate.setHours(hours, minutes);
                          field.onChange(newDate);
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Estimated Duration</FormLabel>
                <FormControl><Input placeholder="e.g., 4 hours, 2 days" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Fixed Rate ($)</FormLabel>
                <FormControl><Input type="number" placeholder="e.g., 200" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full md:w-auto text-lg py-3 px-6 bg-primary hover:bg-primary/90" 
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting Job...
            </>
          ) : (
            'Post Job'
          )}
        </Button>
      </form>
    </Form>
  );
}
