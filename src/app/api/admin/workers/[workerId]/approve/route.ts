import { NextRequest, NextResponse } from 'next/server';
import { cursorClient } from '@/lib/cursor-client';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ workerId: string }> }
) {
  try {
    const { workerId } = await params;
    const body = await request.json();
    const { status } = body;

    // In a real app, verify admin permissions here
    // Update worker profile status
    const updatedProfile = await cursorClient.updateWorkerProfile(workerId, {
      profileStatus: status,
    });

    // Send notification to worker (in real app)
    console.log(`Worker ${workerId} profile approved`);

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: 'Worker profile approved successfully',
    });
  } catch (error: any) {
    console.error('Failed to approve worker:', error);
    return NextResponse.json(
      { error: 'Failed to approve worker' },
      { status: 500 }
    );
  }
} 