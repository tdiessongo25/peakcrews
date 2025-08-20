"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Download, 
  Plus, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Calendar
} from 'lucide-react';

interface ResumeSection {
  id: string;
  title: string;
  content: string;
}

interface ResumeTemplateData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  summary: string;
  skills: string[];
  experience: ResumeSection[];
  education: ResumeSection[];
  certifications: string[];
}

export function ResumeTemplate() {
  const [resumeData, setResumeData] = useState<ResumeTemplateData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
    },
    summary: '',
    skills: [''],
    experience: [{
      id: '1',
      title: 'Job Title',
      content: 'Company Name • Duration\n• Key responsibilities and achievements'
    }],
    education: [{
      id: '1',
      title: 'Degree/Certification',
      content: 'Institution • Year\n• Relevant coursework or achievements'
    }],
    certifications: [''],
  });

  const { toast } = useToast();

  const handlePersonalInfoChange = (field: keyof typeof resumeData.personalInfo, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleSkillsChange = (index: number, value: string) => {
    const newSkills = [...resumeData.skills];
    newSkills[index] = value;
    setResumeData(prev => ({ ...prev, skills: newSkills }));
  };

  const addSkill = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const removeSkill = (index: number) => {
    const newSkills = resumeData.skills.filter((_, i) => i !== index);
    setResumeData(prev => ({ ...prev, skills: newSkills }));
  };

  const handleSectionChange = (type: 'experience' | 'education', index: number, field: 'title' | 'content', value: string) => {
    const newSections = [...resumeData[type]];
    newSections[index] = {
      ...newSections[index],
      [field]: value
    };
    setResumeData(prev => ({ ...prev, [type]: newSections }));
  };

  const addSection = (type: 'experience' | 'education') => {
    const newSection = {
      id: Date.now().toString(),
      title: type === 'experience' ? 'Job Title' : 'Degree/Certification',
      content: type === 'experience' 
        ? 'Company Name • Duration\n• Key responsibilities and achievements'
        : 'Institution • Year\n• Relevant coursework or achievements'
    };
    setResumeData(prev => ({
      ...prev,
      [type]: [...prev[type], newSection]
    }));
  };

  const removeSection = (type: 'experience' | 'education', index: number) => {
    const newSections = resumeData[type].filter((_, i) => i !== index);
    setResumeData(prev => ({ ...prev, [type]: newSections }));
  };

  const handleCertificationsChange = (index: number, value: string) => {
    const newCertifications = [...resumeData.certifications];
    newCertifications[index] = value;
    setResumeData(prev => ({ ...prev, certifications: newCertifications }));
  };

  const addCertification = () => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, '']
    }));
  };

  const removeCertification = (index: number) => {
    const newCertifications = resumeData.certifications.filter((_, i) => i !== index);
    setResumeData(prev => ({ ...prev, certifications: newCertifications }));
  };

  const generateResume = () => {
    const resumeContent = `
# ${resumeData.personalInfo.name}

${resumeData.personalInfo.email} • ${resumeData.personalInfo.phone} • ${resumeData.personalInfo.location}

## Summary
${resumeData.summary}

## Skills
${resumeData.skills.filter(skill => skill.trim()).join(', ')}

## Experience
${resumeData.experience.map(exp => `
### ${exp.title}
${exp.content}
`).join('\n')}

## Education
${resumeData.education.map(edu => `
### ${edu.title}
${edu.content}
`).join('\n')}

## Certifications
${resumeData.certifications.filter(cert => cert.trim()).join('\n')}
    `.trim();

    // Create and download the resume file
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_resume.txt`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Resume Generated',
      description: 'Your resume has been downloaded successfully.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Resume Builder</h1>
        <p className="text-muted-foreground">
          Create a professional resume to showcase your skills and experience
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={resumeData.personalInfo.name}
                    onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={resumeData.personalInfo.location}
                    onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Professional Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={resumeData.summary}
                onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Brief overview of your professional background and key strengths..."
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resumeData.skills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={skill}
                    onChange={(e) => handleSkillsChange(index, e.target.value)}
                    placeholder="e.g., Electrical, Plumbing, Customer Service"
                  />
                  {resumeData.skills.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSkill(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addSkill}>
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Experience #{index + 1}</h4>
                    {resumeData.experience.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSection('experience', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Input
                    value={exp.title}
                    onChange={(e) => handleSectionChange('experience', index, 'title', e.target.value)}
                    placeholder="Job Title"
                  />
                  <Textarea
                    value={exp.content}
                    onChange={(e) => handleSectionChange('experience', index, 'content', e.target.value)}
                    placeholder="Company Name • Duration\n• Key responsibilities and achievements"
                    className="min-h-[80px]"
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addSection('experience')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div key={edu.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Education #{index + 1}</h4>
                    {resumeData.education.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSection('education', index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Input
                    value={edu.title}
                    onChange={(e) => handleSectionChange('education', index, 'title', e.target.value)}
                    placeholder="Degree/Certification"
                  />
                  <Textarea
                    value={edu.content}
                    onChange={(e) => handleSectionChange('education', index, 'content', e.target.value)}
                    placeholder="Institution • Year\n• Relevant coursework or achievements"
                    className="min-h-[80px]"
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addSection('education')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={cert}
                    onChange={(e) => handleCertificationsChange(index, e.target.value)}
                    placeholder="e.g., Licensed Electrician, OSHA Safety Certified"
                  />
                  {resumeData.certifications.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCertification(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addCertification}>
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </CardContent>
          </Card>

          <Button onClick={generateResume} className="w-full" size="lg">
            <Download className="h-4 w-4 mr-2" />
            Generate Resume
          </Button>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resume Preview</CardTitle>
              <CardDescription>
                Live preview of your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-white space-y-4 text-sm">
                <div className="text-center border-b pb-4">
                  <h1 className="text-2xl font-bold">{resumeData.personalInfo.name || 'Your Name'}</h1>
                  <div className="flex items-center justify-center gap-4 text-muted-foreground mt-2">
                    {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                    {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                    {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
                  </div>
                </div>

                {resumeData.summary && (
                  <div>
                    <h2 className="font-semibold text-lg mb-2">Summary</h2>
                    <p className="text-muted-foreground">{resumeData.summary}</p>
                  </div>
                )}

                {resumeData.skills.filter(skill => skill.trim()).length > 0 && (
                  <div>
                    <h2 className="font-semibold text-lg mb-2">Skills</h2>
                    <div className="flex flex-wrap gap-1">
                      {resumeData.skills.filter(skill => skill.trim()).map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {resumeData.experience.length > 0 && (
                  <div>
                    <h2 className="font-semibold text-lg mb-2">Experience</h2>
                    <div className="space-y-3">
                      {resumeData.experience.map((exp, index) => (
                        <div key={index}>
                          <h3 className="font-medium">{exp.title}</h3>
                          <p className="text-muted-foreground whitespace-pre-line">{exp.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {resumeData.education.length > 0 && (
                  <div>
                    <h2 className="font-semibold text-lg mb-2">Education</h2>
                    <div className="space-y-3">
                      {resumeData.education.map((edu, index) => (
                        <div key={index}>
                          <h3 className="font-medium">{edu.title}</h3>
                          <p className="text-muted-foreground whitespace-pre-line">{edu.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {resumeData.certifications.filter(cert => cert.trim()).length > 0 && (
                  <div>
                    <h2 className="font-semibold text-lg mb-2">Certifications</h2>
                    <ul className="list-disc list-inside space-y-1">
                      {resumeData.certifications.filter(cert => cert.trim()).map((cert, index) => (
                        <li key={index} className="text-muted-foreground">{cert}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 