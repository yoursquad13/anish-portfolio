import { NextResponse } from 'next/server';
import { readData, writeData, type PhotoItem } from '@/lib/data';
import { verifyAuth, unauthorized } from '@/lib/middleware';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const photos = readData<PhotoItem>('photos.json');
  return NextResponse.json(photos);
}

export async function POST(request: Request) {
  if (!(await verifyAuth(request))) return unauthorized();

  try {
    const body = await request.json();
    const photos = readData<PhotoItem>('photos.json');
    const newPhoto: PhotoItem = {
      id: uuidv4(),
      src: body.src,
      alt: body.alt || 'Photo',
      createdAt: new Date().toISOString(),
    };
    photos.push(newPhoto);
    writeData('photos.json', photos);
    return NextResponse.json(newPhoto, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
