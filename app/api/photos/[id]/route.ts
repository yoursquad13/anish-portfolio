import { NextResponse } from 'next/server';
import { readData, writeData, type PhotoItem } from '@/lib/data';
import { verifyAuth, unauthorized } from '@/lib/middleware';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAuth(request))) return unauthorized();

  try {
    const { id } = await params;
    let photos = readData<PhotoItem>('photos.json');
    const initialLength = photos.length;
    photos = photos.filter((p) => p.id !== id);

    if (photos.length === initialLength) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    writeData('photos.json', photos);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
