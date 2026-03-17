import { NextResponse } from 'next/server';
import { readData, writeData, type BlogItem } from '@/lib/data';
import { verifyAuth, unauthorized } from '@/lib/middleware';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAuth(request))) return unauthorized();

  try {
    const { id } = await params;
    let blogs = readData<BlogItem>('blogs.json');
    blogs = blogs.filter((b) => b.id !== id);
    writeData('blogs.json', blogs);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
