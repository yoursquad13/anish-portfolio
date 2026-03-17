import { NextResponse } from 'next/server';
import { readData, writeData, type BlogItem } from '@/lib/data';
import { verifyAuth, unauthorized } from '@/lib/middleware';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const blogs = readData<BlogItem>('blogs.json');
  return NextResponse.json(blogs);
}

export async function POST(request: Request) {
  if (!(await verifyAuth(request))) return unauthorized();

  try {
    const body = await request.json();
    const blogs = readData<BlogItem>('blogs.json');
    const newBlog: BlogItem = {
      id: uuidv4(),
      title: body.title,
      category: body.category,
      excerpt: body.excerpt,
      date: body.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      image: body.image || '',
      link: body.link,
    };
    blogs.unshift(newBlog);
    writeData('blogs.json', blogs);
    return NextResponse.json(newBlog, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
