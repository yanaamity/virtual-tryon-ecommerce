import { NextRequest, NextResponse } from 'next/server';
import { SavedLook } from '@/types';

// Mock storage - in production use database
let mockLooks: SavedLook[] = [];

/**
 * GET /api/looks - Get all saved looks
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // In production, fetch from database
    let looks = mockLooks;

    if (userId) {
      looks = looks.filter((look) => look.userId === userId);
    }

    return NextResponse.json(
      {
        success: true,
        data: looks.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching looks:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch looks',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/looks - Save a new look
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      userPhotoId,
      productId,
      productName,
      visualizationMode,
      positioning,
      compositeImageBase64,
    } = body;

    if (!userPhotoId || !productId || !compositeImageBase64) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    const lookId = `look-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Convert base64 to image file
    // TODO: Upload to Vercel Blob Storage
    // const buffer = Buffer.from(compositeImageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    // const blob = await put(`looks/${lookId}.png`, buffer, {
    //   access: 'public',
    //   token: process.env.BLOB_READ_WRITE_TOKEN,
    // });

    const lookUrl = `/looks/${lookId}.png`;

    const newLook: SavedLook = {
      id: lookId,
      userId: userPhotoId,
      timestamp: new Date().toISOString(),
      userPhotoUrl: `/users/${userPhotoId}.jpg`,
      productId,
      productName: productName || 'Unnamed Product',
      visualizationMode,
      positioning,
      compositeImageUrl: lookUrl,
    };

    // In production, save to database
    mockLooks.push(newLook);

    return NextResponse.json(
      {
        success: true,
        data: {
          lookId,
          lookUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving look:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save look',
      },
      { status: 500 }
    );
  }
}
