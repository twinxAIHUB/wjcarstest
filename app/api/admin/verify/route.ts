import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import type { Auth } from 'firebase-admin/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idToken = searchParams.get('idToken');

    if (!idToken) {
      console.error('No ID token provided');
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      );
    }

    try {
      console.log('Verifying ID token...');
      const decodedToken = await (adminAuth as Auth).verifyIdToken(idToken);
      console.log('Token verified successfully for user:', decodedToken.uid);
      return NextResponse.json({ uid: decodedToken.uid });
    } catch (error) {
      console.error('Error verifying token:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      return NextResponse.json(
        { error: 'Invalid ID token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error in verify route:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 