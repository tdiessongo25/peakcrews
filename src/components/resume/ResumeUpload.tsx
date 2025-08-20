"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, X, Download, Eye, Loader2, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ResumeParser, type ParsedResume } from '@/lib/resume-parser';

interface ResumeUploadProps {
  currentResumeUrl?: string;
  onUpload: (file: File) => Promise<string>;
  onRemove?: () => void;
  required?: boolean;
  className?: string;
  onParsed?: (parsedData: ParsedResume) => void;
  showParsing?: boolean;
}

export function ResumeUpload({ 
  currentResumeUrl, 
  onUpload, 
  onRemove, 
  required = false,
  className = "",
  onParsed,
  showParsing = false
}: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentResumeUrl || null);
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF, DOC, or DOCX file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      const url = await onUpload(file);
      setUploadedFile(file);
      setUploadedUrl(url);
      
      // Parse resume if enabled
      if (showParsing) {
        setIsParsing(true);
        try {
          const parsed = await ResumeParser.parseResume(file);
          setParsedData(parsed);
          onParsed?.(parsed);
          toast({
            title: 'Resume parsed successfully',
            description: 'Skills and experience extracted from your resume.',
          });
        } catch (parseError) {
          console.error('Failed to parse resume:', parseError);
          toast({
            title: 'Parsing failed',
            description: 'Resume uploaded but parsing failed. You can still proceed.',
            variant: 'destructive',
          });
        } finally {
          setIsParsing(false);
        }
      } else {
        toast({
          title: 'Resume uploaded successfully',
          description: 'Your resume has been uploaded.',
        });
      }
    } catch (error) {
      console.error('Failed to upload resume:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    setUploadedUrl(null);
    onRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-8 w-8 text-blue-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Resume Upload
          {required && <Badge variant="destructive" className="text-xs">Required</Badge>}
        </CardTitle>
        <CardDescription>
          Upload your resume in PDF, DOC, or DOCX format (max 5MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!uploadedUrl ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Drag and drop your resume here, or click to browse
            </p>
          </div>
        ) : (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon(uploadedFile?.name || 'resume.pdf')}
                <div>
                  <p className="font-medium">{uploadedFile?.name || 'Resume'}</p>
                  {uploadedFile && (
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(uploadedFile.size)}
                    </p>
                  )}
                  {isParsing && (
                    <div className="flex items-center gap-1 text-sm text-blue-600">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Parsing resume...
                    </div>
                  )}
                  {parsedData && !isParsing && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      Parsed successfully
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(uploadedUrl!, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = uploadedUrl!;
                    link.download = uploadedFile?.name || 'resume.pdf';
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Show parsed data if available */}
            {parsedData && !isParsing && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-sm mb-2">Extracted Information:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="font-medium">Skills:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {parsedData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Experience:</p>
                    <p className="text-muted-foreground">{parsedData.experience}</p>
                  </div>
                  {parsedData.certifications.length > 0 && (
                    <div>
                      <p className="font-medium">Certifications:</p>
                      <p className="text-muted-foreground">{parsedData.certifications.join(', ')}</p>
                    </div>
                  )}
                  {parsedData.summary && (
                    <div className="md:col-span-2">
                      <p className="font-medium">Summary:</p>
                      <p className="text-muted-foreground text-xs">{parsedData.summary}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 