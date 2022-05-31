import Medusa from '~/medusa-client';
import { getSession } from '~/session.server';

const BACKEND_URL = process.env.MEDUSA_URL || 'http://localhost:9000';
export const CART_SESSION_KEY = 'cart';

export const createClient = () => new Medusa({ baseUrl: BACKEND_URL });

export async function getCart(request: Request) {
  const client = createClient();
  const session = await getSession(request);

  const cartId = session.get(CART_SESSION_KEY);

  if (cartId) {
    const { cart } = await client.carts.retrieve(cartId);
    return cart;
  }

  const { cart } = await client.carts.create({});
  return cart;
}

export type NewCart = Awaited<ReturnType<typeof getCart>>;
