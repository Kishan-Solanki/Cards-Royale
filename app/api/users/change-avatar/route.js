import { NextResponse } from 'next/server';
import { connect } from '@/lib/dbconfig';
import User from '@/model/userModel';
import cloudinary from 'cloudinary';
import { Readable } from 'stream';

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Parse form-data file from Next.js Request
export async function POST(req) {
  try {
    await connect();

    const formData = await req.formData();
    const file = formData.get('file'); // expecting field name: 'file'
    const userId = formData.get('userId');

    if (!userId || !file) {
      return NextResponse.json(
        { success: false, message: 'Missing userId or image file' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploaded = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        { folder: 'users' },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );

      const readable = Readable.from(buffer);
      readable.pipe(uploadStream);
    });

    // If same as existing
    if (user.profileImageURL === uploaded.secure_url) {
      return NextResponse.json(
        { success: false, message: 'Avatar already exists' },
        { status: 409 }
      );
    }

    // Save to user model
    user.profileImageURL = uploaded.secure_url;
    await user.save();

    return NextResponse.json(
      { success: true, message: 'Avatar updated successfully', user },
      { status: 200 }
    );
  } catch (error) {
    console.error('[CHANGE-AVATAR-ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
