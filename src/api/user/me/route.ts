import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  console.log('request', request)
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    console.log('token', token)
    if (!token) {
      return NextResponse.json({ error: 'No auth token found' }, { status: 401 });
    }

    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.portgig.com/api/v1' 
      : 'https://api.portgig.com/api/v1';
    
    const response = await fetch(`${baseUrl}/user/me?token=${token}`, {
      method: 'GET', 
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        const clearResponse = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        clearResponse.cookies.delete('access_token');
        return clearResponse;
      }
      throw new Error(`Failed to get user: ${response.status}`);
    }
    
    const user = await response.json();
     const userInfo = await response.json();
    console.log('userInfo')
    localStorage.setItem('user', userInfo)
    return NextResponse.json(user);
  } catch (error) {
    console.error('User me API error:', error);
    return NextResponse.json(
      { error: 'Failed to get user information' }, 
      { status: 500 }
    );
  }
}