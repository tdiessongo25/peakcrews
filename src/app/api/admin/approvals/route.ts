import { NextRequest, NextResponse } from 'next/server';
import { AdminService } from '@/lib/admin-service';

export async function GET(request: NextRequest) {
  try {
    const approvals = await AdminService.getPendingApprovals();

    return NextResponse.json({
      success: true,
      approvals,
    });
  } catch (error: any) {
    console.error('Failed to get pending approvals:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get pending approvals' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { approvalId, action, notes } = body;

    if (!approvalId || !action) {
      return NextResponse.json(
        { error: 'Approval ID and action are required' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "approve" or "reject"' },
        { status: 400 }
      );
    }

    await AdminService.updateApproval(approvalId, action, notes);

    return NextResponse.json({
      success: true,
      message: `Approval ${action}d successfully`,
    });
  } catch (error: any) {
    console.error('Failed to update approval:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update approval' },
      { status: 500 }
    );
  }
}
