import { NextRequest, NextResponse } from 'next/server';
import { cursorClient } from '@/lib/cursor-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      trade: searchParams.get('trade') || undefined,
      location: searchParams.get('location') || undefined,
      status: searchParams.get('status') || undefined,
      hirerId: searchParams.get('hirerId') || undefined,
    };

    const jobs = await cursorClient.getJobs(filters);
    return NextResponse.json(jobs);
  } catch (error: any) {
    console.error('Failed to fetch jobs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const jobData = await request.json();
    
    // Validate required fields
    const requiredFields = ['hirerId', 'hirerName', 'trade', 'title', 'description', 'location', 'address', 'jobType', 'duration', 'rate'];
    for (const field of requiredFields) {
      if (!jobData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const newJob = await cursorClient.createJob(jobData);
    return NextResponse.json(newJob, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create job:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create job' },
      { status: 500 }
    );
  }
} 