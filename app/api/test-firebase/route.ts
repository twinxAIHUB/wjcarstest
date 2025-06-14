import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc } from 'firebase/firestore';

export async function GET() {
  const result = {
    adminConnection: 'not tested',
    clientConnection: 'not tested',
    errors: [] as string[]
  };

  try {
    // Test Admin SDK Connection
    try {
      const adminTestDoc = adminDb.collection('_test_connection').doc('test');
      await adminTestDoc.set({ test: 'data' });
      result.adminConnection = 'working';
    } catch (adminError) {
      result.adminConnection = 'failed';
      result.errors.push(`Admin SDK Error: ${adminError instanceof Error ? adminError.message : 'Unknown error'}`);
    }

    // Test Client SDK Connection
    try {
      const testCollection = collection(db, '_test_connection');
      const testDocRef = doc(testCollection, 'test');
      const testDocSnap = await getDoc(testDocRef);
      result.clientConnection = 'working';
    } catch (clientError) {
      result.clientConnection = 'failed';
      result.errors.push(`Client SDK Error: ${clientError instanceof Error ? clientError.message : 'Unknown error'}`);
    }

    // Return results
    if (result.errors.length > 0) {
      return NextResponse.json({
        status: 'error',
        ...result
      }, { status: 500 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Firebase connection test successful',
      ...result
    });

  } catch (error) {
    console.error('Firebase test failed:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Firebase test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      ...result
    }, { status: 500 });
  }
} 