import { NextResponse } from 'next/server';
import { readData, writeData, type WalletItem } from '@/lib/data';
import { verifyAuth, unauthorized } from '@/lib/middleware';
import { v4 as uuid } from 'uuid';

export async function GET() {
  const wallets = readData<WalletItem>('wallets.json');
  return NextResponse.json(wallets);
}

export async function POST(request: Request) {
  if (!(await verifyAuth(request))) return unauthorized();

  try {
    const body = await request.json();
    const wallet: WalletItem = {
      id: uuid(),
      name: body.name,
      symbol: body.symbol?.toUpperCase() || '',
      address: body.address,
      network: body.network || '',
    };
    const wallets = readData<WalletItem>('wallets.json');
    wallets.push(wallet);
    writeData('wallets.json', wallets);
    return NextResponse.json(wallet, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
