import { NextResponse } from 'next/server';
import { validateCredentials, createToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!validateCredentials(username, password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await createToken();
    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
