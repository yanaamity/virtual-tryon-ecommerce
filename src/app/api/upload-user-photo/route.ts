import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /api/upload-user-photo
 * Upload user photo for try-on
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file provided',
        },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type. Please upload JPEG, PNG, or WebP.',
        },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: 'File too large. Maximum size is 10MB.',
        },
        { status: 400 }
      );
    }

    const photoId = `photo-${uuidv4()}`;

    // In production, upload to Vercel Blob Storage
    // For MVP, return a path that will be handled by the frontend
    const imageUrl = `/users/${photoId}.${file.type.split('/')[1]}`;

    // TODO: Upload to Vercel Blob Storage
    // const blob = await put(`${imageUrl}`, file, {
    //   access: 'public',
    //   token: process.env.BLOB_READ_WRITE_TOKEN,
    // });

    return NextResponse.json(
      {
        success: true,
        data: {
          imageUrl,
          imageId: photoId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload photo',
      },
      { status: 500 }
    );
  }
}
