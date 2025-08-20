// Resume parsing utility for extracting skills and experience
// In a real app, this would integrate with AI services like OpenAI or specialized resume parsing APIs

export interface ParsedResume {
  skills: string[];
  experience: string;
  certifications: string[];
  education: string[];
  contactInfo: {
    email?: string;
    phone?: string;
    location?: string;
  };
  summary: string;
}

export class ResumeParser {
  // Mock implementation - in production, this would use AI/ML services
  static async parseResume(file: File): Promise<ParsedResume> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock parsing results based on file name
    const fileName = file.name.toLowerCase();
    
    if (fileName.includes('electrical') || fileName.includes('electrician')) {
      return {
        skills: ['Electrical', 'Plumbing', 'HVAC', 'Troubleshooting', 'Installation'],
        experience: '5 years',
        certifications: ['Licensed Electrician', 'OSHA Safety Certified'],
        education: ['Technical Institute - Electrical Engineering'],
        contactInfo: {
          email: 'worker@example.com',
          phone: '(555) 123-4567',
          location: 'Brooklyn, NY'
        },
        summary: 'Experienced electrician with 5 years of residential and commercial electrical work.'
      };
    } else if (fileName.includes('carpenter') || fileName.includes('woodwork')) {
      return {
        skills: ['Carpentry', 'Woodworking', 'Framing', 'Finish Work', 'Custom Furniture'],
        experience: '3 years',
        certifications: ['Carpenter License', 'Safety Training'],
        education: ['Apprenticeship Program'],
        contactInfo: {
          email: 'sarah@example.com',
          phone: '(555) 987-6543',
          location: 'Queens, NY'
        },
        summary: 'Skilled carpenter specializing in custom woodwork and residential construction.'
      };
    } else if (fileName.includes('painter') || fileName.includes('painting')) {
      return {
        skills: ['Interior Painting', 'Exterior Painting', 'Color Matching', 'Surface Prep', 'Spray Painting'],
        experience: '4 years',
        certifications: ['Painter Certification'],
        education: ['Trade School - Painting'],
        contactInfo: {
          email: 'painter@example.com',
          phone: '(555) 456-7890',
          location: 'Manhattan, NY'
        },
        summary: 'Professional painter with expertise in residential and commercial painting projects.'
      };
    } else {
      // Default parsing for unknown resume types
      return {
        skills: ['General Construction', 'Problem Solving', 'Customer Service'],
        experience: '2 years',
        certifications: ['General Contractor License'],
        education: ['High School Diploma'],
        contactInfo: {
          email: 'worker@example.com',
          phone: '(555) 000-0000',
          location: 'New York, NY'
        },
        summary: 'Reliable worker with experience in various construction and maintenance tasks.'
      };
    }
  }

  // Extract skills from text content
  static extractSkills(text: string): string[] {
    const commonSkills = [
      'Electrical', 'Plumbing', 'HVAC', 'Carpentry', 'Painting', 'Roofing',
      'Masonry', 'Welding', 'Landscaping', 'Cleaning', 'Moving', 'Assembly',
      'Installation', 'Repair', 'Maintenance', 'Troubleshooting', 'Customer Service',
      'Problem Solving', 'Time Management', 'Team Work', 'Communication'
    ];

    const foundSkills = commonSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );

    return foundSkills.length > 0 ? foundSkills : ['General Construction'];
  }

  // Extract experience duration
  static extractExperience(text: string): string {
    const experiencePatterns = [
      /(\d+)\s*years?/i,
      /(\d+)\s*years?\s*of\s*experience/i,
      /experience:\s*(\d+)\s*years?/i
    ];

    for (const pattern of experiencePatterns) {
      const match = text.match(pattern);
      if (match) {
        return `${match[1]} years`;
      }
    }

    return '1 year'; // Default
  }

  // Extract certifications
  static extractCertifications(text: string): string[] {
    const certificationKeywords = [
      'certified', 'licensed', 'certification', 'license', 'diploma', 'degree',
      'osha', 'safety', 'training', 'apprenticeship'
    ];

    const lines = text.split('\n');
    const certifications = lines.filter(line => 
      certificationKeywords.some(keyword => 
        line.toLowerCase().includes(keyword)
      )
    );

    return certifications.length > 0 ? certifications : ['Safety Training'];
  }

  // Validate resume format
  static validateResume(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Please upload a PDF, DOC, or DOCX file.'
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size must be less than 5MB.'
      };
    }

    return { isValid: true };
  }
} 