import { NextResponse } from 'next/server';
import { readData, writeData, type ClientItem } from '@/lib/data';
import { verifyAuth, unauthorized } from '@/lib/middleware';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAuth(request))) return unauthorized();

  try {
    const { id } = await params;
    let clients = readData<ClientItem>('clients.json');
    clients = clients.filter((c) => c.id !== id);
    writeData('clients.json', clients);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
