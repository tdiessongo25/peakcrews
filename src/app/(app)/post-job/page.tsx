
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JobPostingForm } from "./JobPostingForm";
import { Wand2 } from "lucide-react";
import { HirerGuard } from '@/components/auth/CursorAuthGuard';

export default function PostJobPage() {
  return (
    <HirerGuard>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Wand2 size={32} className="text-primary mr-2" />
              <CardTitle className="text-3xl font-bold">Post a New Job for Your Project</CardTitle>
            </div>
            <CardDescription>
              Contractors (General/Subcontractors): Fill in the details below. Use our AI Assistant to help craft the perfect job description!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JobPostingForm />
          </CardContent>
        </Card>
      </div>
    </HirerGuard>
  );
}
