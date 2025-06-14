"use client"

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Check if the email ends with @admin.com
    if (!email.endsWith('@admin.com')) {
      return NextResponse.json(
        { error: 'Only @admin.com emails can be registered as admin' },
        { status: 403 }
      );
    }

    // Just validate the email domain and return success
    return NextResponse.json({ 
      success: true, 
      message: 'Email domain validated'
    });

  } catch (error) {
    console.error('Admin validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate email domain' },
      { status: 500 }
    );
  }
} 