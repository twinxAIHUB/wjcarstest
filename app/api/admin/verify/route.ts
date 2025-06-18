import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import type { Auth } from 'firebase-admin/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idToken = searchParams.get('idToken');

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      );
    }

    try {
      const decodedToken = await (adminAuth as Auth).verifyIdToken(idToken);
      return NextResponse.json({ uid: decodedToken.uid });
    } catch (error) {
      console.error('Error verifying token:', error);
      return NextResponse.json(
        { error: 'Invalid ID token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error in verify route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 