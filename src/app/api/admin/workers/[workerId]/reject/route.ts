import { NextRequest, NextResponse } from 'next/server';
import { cursorClient } from '@/lib/cursor-client';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ workerId: string }> }
) {
  try {
    const { workerId } = await params;
    const body = await request.json();
    const { status, reason } = body;

    // In a real app, verify admin permissions here
    // Update worker profile status
    const updatedProfile = await cursorClient.updateWorkerProfile(workerId, {
      profileStatus: status,
      rejectionReason: reason, // Add this field to WorkerProfileInfo if needed
    });

    // Send notification to worker (in real app)
    console.log(`Worker ${workerId} profile rejected: ${reason}`);

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: 'Worker profile rejected',
    });
  } catch (error: any) {
    console.error('Failed to reject worker:', error);
    return NextResponse.json(
      { error: 'Failed to reject worker' },
      { status: 500 }
    );
  }
} 