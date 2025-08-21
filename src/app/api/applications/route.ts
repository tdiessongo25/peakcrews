import { NextRequest, NextResponse } from 'next/server';
import { cursorClient } from '@/lib/cursor-client';
import { NotificationService } from '@/lib/notification-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const workerId = searchParams.get('workerId');
    const status = searchParams.get('status');

    // Get applications with filters
    const applications = await cursorClient.getApplications({
      jobId: jobId || undefined,
      workerId: workerId || undefined,
      status: status || undefined,
    });

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error: any) {
    console.error('Failed to fetch applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, workerId, coverLetter, proposedRate, resumeUrl } = body;

    // Validate required fields
    if (!jobId || !workerId) {
      return NextResponse.json(
        { error: 'Job ID and Worker ID are required' },
        { status: 400 }
      );
    }

    // Get job and worker details for notifications
    const job = await cursorClient.getJob(jobId);
    // const worker = await cursorClient.getUser(workerId);

    // Create the application
    const application = await cursorClient.createApplication({
      jobId,
      workerId,
      jobTitle: job?.title || 'Unknown Job',
      workerName: 'Worker', // This should come from worker data
      coverLetter: coverLetter || '',
      proposedRate: proposedRate || null,
      resumeUrl: resumeUrl || null,
      status: 'applied',
    });

    // Send notification to hirer
    try {
      await NotificationService.notifyApplicationReceived(
        jobId,
        workerId,
        job.hirerId,
        job.title,
        'Worker' // worker.name
      );
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError);
      // Don't fail the application creation if notification fails
    }

    return NextResponse.json({
      success: true,
      application,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create application:', error);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
} 