import { NextResponse } from 'next/server';
import { readData, writeData, type ClientItem } from '@/lib/data';
import { verifyAuth, unauthorized } from '@/lib/middleware';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const clients = readData<ClientItem>('clients.json');
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  if (!(await verifyAuth(request))) return unauthorized();

  try {
    const body = await request.json();
    const clients = readData<ClientItem>('clients.json');
    const newClient: ClientItem = {
      id: uuidv4(),
      name: body.name,
      logo: body.logo,
      website: body.website,
    };
    clients.push(newClient);
    writeData('clients.json', clients);
    return NextResponse.json(newClient, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
