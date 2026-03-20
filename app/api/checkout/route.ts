import { NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured');
  return new Stripe(key);
}

export async function POST(request: Request) {
  try {
    const { name, email, amount, currency } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }



    const origin = request.headers.get('origin') || 'https://anish.vip';
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: (currency || 'usd').toLowerCase(),
            product_data: {
              name: `Payment from ${name}`,
              description: `Payment to Anish Khatri`,
            },
            unit_amount: Math.round(amount * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}?payment=success`,
      cancel_url: `${origin}?payment=cancelled`,
      metadata: {
        customerName: name,
        customerEmail: email,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
