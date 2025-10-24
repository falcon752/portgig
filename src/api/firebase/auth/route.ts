import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

if (!getApps().length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
      throw new Error('Missing required Firebase environment variables');
    }

    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/firebase/auth - Request received');
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { userId, userType, name } = body;

    if (!userId) {
      console.error('User ID is missing from request');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate userType
    const validUserTypes = ['creative', 'recruiter'];
    if (!validUserTypes.includes(userType)) {
      console.error('Invalid user type:', userType);
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      );
    }

    const customClaims = {
      userId,
      userType,
      name: name || 'User',
    };

    console.log('Creating custom token for user:', userId, 'with claims:', customClaims);
    
    const auth = getAuth();
    const customToken = await auth.createCustomToken(userId, customClaims);
    console.log('Custom token created successfully');

    return NextResponse.json({ 
      customToken,
      success: true 
    });

  } catch (error: any) {
    console.error('Error creating custom token:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate custom token', 
        details: error.message,
        success: false 
      },
      { status: 500 }
    );
  }
}