import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');

  if (!role || !['creator', 'recruiter'].includes(role)) {
    return NextResponse.redirect(`${request.nextUrl.origin}/login?error=invalid_role`);
  }

  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.portgig.com/api/v1' 
      : 'https://api.portgig.com/api/v1';
    
    const response = await fetch(`${baseUrl}/user/auth/google`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ role }), 
    });

    if (!response.ok) {
      throw new Error(`Failed to initiate Google auth: ${response.status}`);
    }

    const data = await response.json();
    const authUrl = data.authUrl || data.auth_url || data.url;
    
    if (!authUrl) {
      throw new Error('No auth URL received from server');
    }

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Google auth initiation failed:', error);
    return NextResponse.redirect(`${request.nextUrl.origin}/login?error=auth_initiation_failed`);
  }
}