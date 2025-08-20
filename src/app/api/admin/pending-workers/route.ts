import { NextRequest, NextResponse } from 'next/server';
import { cursorClient } from '@/lib/cursor-client';

export async function GET(request: NextRequest) {
  try {
    // In a real app, verify admin permissions here
    // For now, we'll return mock pending workers
    
    const pendingWorkers = [
      {
        user: {
          id: 'user1',
          name: 'John Worker',
          email: 'worker@example.com',
          role: 'worker' as const,
          profileImageUrl: 'https://placehold.co/100x100.png',
        },
        profile: {
          userId: 'user1',
          skills: ['Electrical', 'Plumbing'],
          experience: '5 years',
          certifications: ['Licensed Electrician'],
          availability: 'Weekdays',
          hourlyRate: 50,
          resumeUrl: 'https://example.com/uploads/resume_user1.pdf',
          profileStatus: 'pending',
          location: 'Brooklyn, NY',
        },
      },
      {
        user: {
          id: 'user2',
          name: 'Sarah Carpenter',
          email: 'sarah@example.com',
          role: 'worker' as const,
          profileImageUrl: 'https://placehold.co/100x100.png',
        },
        profile: {
          userId: 'user2',
          skills: ['Carpentry', 'Woodworking'],
          experience: '3 years',
          certifications: ['Carpenter License'],
          availability: 'Weekends',
          hourlyRate: 45,
          resumeUrl: 'https://example.com/uploads/resume_user2.pdf',
          profileStatus: 'pending',
          location: 'Queens, NY',
        },
      },
    ];

    return NextResponse.json({
      success: true,
      workers: pendingWorkers,
    });
  } catch (error: any) {
    console.error('Failed to fetch pending workers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending workers' },
      { status: 500 }
    );
  }
} 