import { ShoppingCartIcon } from '@heroicons/react/outline';
import type { LineItem } from '@medusajs/medusa';
import { Link } from '@remix-run/react';
import { useCart } from '~/utils';

const quantity = (item: LineItem) => {
  return item.quantity;
};

const sum = (prev: number, next: number) => {
  return prev + next;
};

export default function NavBar() {
  const cart = useCart();

  return (
    <div className="fixed flex w-screen flex-row justify-between p-6">
      <Link to="/">Medusa Store</Link>

      <button className="flex flex-row space-x-2">
        <ShoppingCartIcon width={20} height={24} />
        <span>
          {cart.items.length > 0 ? cart.items.map(quantity).reduce(sum) : 0}
        </span>
      </button>
    </div>
  );
}
