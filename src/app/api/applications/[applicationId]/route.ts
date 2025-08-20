import { NextRequest, NextResponse } from 'next/server';
import { cursorClient } from '@/lib/cursor-client';
import { NotificationService } from '@/lib/notification-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const { applicationId } = await params;
    const application = await cursorClient.getApplication(applicationId);
    
    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error: any) {
    console.error('Failed to fetch application:', error);
    return NextResponse.json(
      { error: 'Application not found' },
      { status: 404 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const { applicationId } = await params;
    const body = await request.json();
    const { status, message } = body;

    // Validate status
    const validStatuses = ['applied', 'selected', 'confirmed', 'rejected', 'cancelled_by_worker', 'cancelled_by_hirer'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Get current application to check if status is changing
    const currentApplication = await cursorClient.getApplication(applicationId);
    const statusChanged = currentApplication.status !== status;

    // Update the application
    const application = await cursorClient.updateApplication(applicationId, {
      status,
      message,
    });

    // Send notification if status changed
    if (statusChanged && status) {
      try {
        const job = await cursorClient.getJob(application.jobId);
        await NotificationService.notifyApplicationStatusChanged(
          applicationId,
          application.workerId,
          job.hirerId,
          job.title,
          status,
          message
        );

        // If status is confirmed, also send job assignment notification
        if (status === 'confirmed') {
          await NotificationService.notifyJobAssigned(
            application.jobId,
            application.workerId,
            job.hirerId,
            job.title
          );
        }
      } catch (notificationError) {
        console.error('Failed to send notification:', notificationError);
        // Don't fail the update if notification fails
      }
    }

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error: any) {
    console.error('Failed to update application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const { applicationId } = await params;
    await cursorClient.deleteApplication(applicationId);
    
    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error: any) {
    console.error('Failed to delete application:', error);
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    );
  }
} 