import { NextResponse } from 'next/server';
import { readData, writeData, type WalletItem } from '@/lib/data';
import { verifyAuth, unauthorized } from '@/lib/middleware';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAuth(request))) return unauthorized();

  try {
    const { id } = await params;
    let wallets = readData<WalletItem>('wallets.json');
    wallets = wallets.filter((w) => w.id !== id);
    writeData('wallets.json', wallets);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
