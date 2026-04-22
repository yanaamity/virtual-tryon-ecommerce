import { NextRequest, NextResponse } from 'next/server';
import { SavedLook } from '@/types';

// Mock storage - in production use database
let mockLooks: SavedLook[] = [];

/**
 * GET /api/looks/[id] - Get specific look
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lookId = params.id;

    // In production, fetch from database
    const look = mockLooks.find((l) => l.id === lookId);

    if (!look) {
      return NextResponse.json(
        {
          success: false,
          error: 'Look not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: look,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching look:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch look',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/looks/[id] - Delete specific look
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lookId = params.id;

    // In production, delete from database
    const initialLength = mockLooks.length;
    mockLooks = mockLooks.filter((l) => l.id !== lookId);

    if (mockLooks.length === initialLength) {
      return NextResponse.json(
        {
          success: false,
          error: 'Look not found',
        },
        { status: 404 }
      );
    }

    // TODO: Delete from Vercel Blob Storage
    // await del(`looks/${lookId}.png`, {
    //   token: process.env.BLOB_READ_WRITE_TOKEN,
    // });

    return NextResponse.json(
      {
        success: true,
        message: 'Look deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting look:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete look',
      },
      { status: 500 }
    );
  }
}
