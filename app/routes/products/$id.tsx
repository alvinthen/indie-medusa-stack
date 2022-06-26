import { ShoppingBagIcon } from '@heroicons/react/outline';
import type { Product } from '@medusajs/medusa';
import { useCatch, useLoaderData } from '@remix-run/react';
import type { LoaderFunction, MetaFunction } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import classNames from 'classnames';
import { useState, useEffect } from 'react';
import invariant from 'tiny-invariant';
import { createClient } from '~/models/medusa.server';
import { useCart } from '~/utils';
import { formatPrices } from '~/utils/prices';

type LoaderData = {
  product?: Product;
};

export const meta: MetaFunction = ({ data }) => {
  if (data) {
    const { product } = data as LoaderData;
    invariant(product);
    return {
      title: `${product.title} | Medusa + Remix`,
    };
  }
  return {
    title: `404 | Medusa + Remix`,
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const medusa = createClient();

  const { product } = await medusa.products.retrieve(params.id as string);
  if (product) {
    return json<LoaderData>({ product });
  }

  throw new Response('Product Not Found', {
    status: 404,
  });
};

const resetOptions = (product: Product) => {
  const variantId = product.variants.slice(0).reverse()[0].id;
  const size = product.variants.slice(0).reverse()[0].title;
  return {
    variantId: variantId,
    quantity: 1,
    size: size,
  };
};

// Size and quantity components copied from https://github.com/medusajs/nextjs-starter-medusa
// Could be improved to support non-js
export default function ProductPage() {
  const { product } = useLoaderData<LoaderData>();
  invariant(product);

  const cart = useCart();
  const [options, setOptions] = useState({
    variantId: '',
    quantity: 0,
    size: '',
  });

  useEffect(() => {
    if (product) {
      setOptions(resetOptions(product));
    }
  }, [product]);

  const handleQtyChange = (action: string) => {
    if (action === 'inc') {
      if (
        options.quantity <
        (product.variants.find(({ id }) => id === options.variantId)
          ?.inventory_quantity ?? 0)
      )
        setOptions({
          variantId: options.variantId,
          quantity: options.quantity + 1,
          size: options.size,
        });
    }
    if (action === 'dec') {
      if (options.quantity > 1)
        setOptions({
          variantId: options.variantId,
          quantity: options.quantity - 1,
          size: options.size,
        });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="h-[50vh] w-full lg:h-screen lg:w-1/2 lg:flex-1">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-6 p-4 lg:flex-1">
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <h6>{formatPrices(cart, product.variants[0])}</h6>
        </div>

        <div className="space-y-4">
          <h6>Select Size</h6>
          <div className="flex flex-row flex-wrap gap-4">
            {product.variants
              .slice(0)
              .reverse()
              .map((v) => {
                return (
                  <button
                    key={v.id}
                    className={classNames(
                      'rounded-md p-3',
                      v.title == options.size
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-300 text-black hover:bg-gray-400',
                    )}
                    onClick={() =>
                      setOptions({
                        variantId: v.id,
                        quantity: options.quantity,
                        size: v.title,
                      })
                    }
                  >
                    {v.title}
                  </button>
                );
              })}
          </div>
        </div>

        <div className="space-y-4">
          <h6>Select Quantity</h6>
          <div>
            <button
              className="h-12 w-12 hover:bg-gray-300"
              onClick={() => handleQtyChange('dec')}
            >
              -
            </button>
            <span className="mx-6">{options.quantity}</span>
            <button
              className="h-12 w-12 hover:bg-gray-300"
              onClick={() => handleQtyChange('inc')}
            >
              +
            </button>
          </div>
        </div>

        <form action="">
          <button type="submit">
            <div className="flex flex-row rounded-md bg-gray-700 p-3 text-white hover:bg-gray-600">
              Add to bag <ShoppingBagIcon className="ml-3 h-5 w-5" />
            </div>
          </button>
        </form>

        <h6>Product Description</h6>
        <p>{product.description}</p>
      </div>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Product not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
