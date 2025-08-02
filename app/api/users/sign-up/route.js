import { connect } from '@/lib/dbconfig';
import User from '@/model/userModel';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import { sendVerificationEmail } from '@/helpers/mailer';
import crypto from 'crypto';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

connect();

export async function POST(req) {
  try {
    const formData = await req.formData();

    const username = formData.get('username')?.toString();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const file = formData.get('profileImage');

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let profileImageURL = 'https://res.cloudinary.com/divwkpavu/image/upload/v1749458831/default_qtcr88.jpg';

    if (file && typeof file.arrayBuffer === 'function') {
      const buffer = Buffer.from(await file.arrayBuffer());

      const uploaded = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'users' },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
        stream.end(buffer);
      });

      profileImageURL = uploaded.secure_url;
    }

    // Generate a verification code (6-digit OTP)
    const verifyCode = crypto.randomInt(100000, 999999).toString();
    const codeExpiry = Date.now() + 1000 * 60 * 30; 
    // Save user with verification code
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profileImageURL,
      verifyCode : verifyCode,
      verifyCodeExpiry : codeExpiry,
      isVerified: false,
    });

    const savedUser = await newUser.save();

    // Send verification email
    const mailResult = await sendVerificationEmail(email, username, verifyCode);

if (!mailResult.success) {
  console.error('Verification mail failed:', mailResult.message);

  return NextResponse.json(
    {
      success: true,
      warning: 'User registered but failed to send verification email. Please request a new code.',
      user: savedUser,
    },
    { status: 207 } // Multi-status or you can still use 200
  );
}


    return NextResponse.json({
      message: 'User registered successfully! Verification email sent.',
      success: true,
      user: savedUser,
    });
  } catch (error) {
    console.error('Sign-up error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
