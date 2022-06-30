import type { Product } from '@medusajs/medusa';
import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import NavBar from '~/components/NavBar';
import { createClient } from '~/models/medusa.server';
import { useCart } from '~/utils';
import { formatPrices } from '~/utils/prices';

export const meta: MetaFunction = () => {
  return {
    title: 'Medusa + Remix',
  };
};

export const loader: LoaderFunction = async () => {
  const medusa = createClient();

  const { products } = await medusa.products.list();

  return json<{ products: Product[] }>({ products });
};

export default function Index() {
  const { products } = useLoaderData<{ products: Product[] }>();
  const cart = useCart();

  return (
    <>
      <NavBar />
      <div className="mx-auto flex min-h-screen max-w-screen-lg flex-col items-center justify-center p-4">
        <main className="flex flex-col items-center justify-center">
          <div className="max-w-screen-md space-y-6 text-left">
            <h1 className="m-0 text-3xl font-bold md:text-6xl">
              Medusa + Remix Starter{' '}
              <span role="img" aria-label="Rocket emoji">
                🚀
              </span>
            </h1>
            <p className="md:text-2xl">
              Build blazing-fast client applications on top of a modular
              headless commerce engine. Integrate seamlessly with any 3rd party
              tools for a best-in-breed commerce stack.
            </p>
            <div className="mb-12 flex flex-nowrap items-center">
              <a
                href="https://www.medusa-commerce.com/"
                target="_blank"
                rel="noreferrer"
                role="button"
              >
                <div className="mr-4 rounded-md bg-gray-700 p-3 text-white hover:bg-gray-600">
                  Medusa
                </div>
              </a>
              <a
                href="https://remix.run"
                target="_blank"
                rel="noreferrer"
                role="button"
              >
                <div className="mr-4 rounded-md bg-blue-400 p-3 text-white hover:bg-blue-300">
                  Remix
                </div>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://docs.medusa-commerce.com/"
                target="_blank"
                rel="noreferrer"
                role="button"
                className="inline-flex min-h-[3rem] min-w-[3rem] items-center self-center rounded-lg bg-gray-700 py-2 px-5 text-lg font-medium text-white hover:bg-gray-600"
              >
                Read the docs
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path>
                </svg>
              </a>
              <a
                href="https://github.com/medusajs/nextjs-starter-medusa"
                target="_blank"
                rel="noreferrer"
                role="button"
                className="inline-flex min-h-[3rem] min-w-[3rem] items-center self-center rounded-lg py-2 px-5 text-lg font-medium hover:bg-gray-300"
              >
                View on GitHub
              </a>
            </div>
          </div>
          <div className="mt-12 flex w-full flex-col items-start">
            <h2 className="mb-4 font-semibold">Demo Products</h2>
            <div className="flex w-full flex-col flex-wrap items-center justify-center gap-4 md:flex-row">
              {products &&
                products.map((p) => {
                  return (
                    <div
                      key={p.id}
                      className="w-full rounded-lg border border-gray-100 p-6 text-left transition-colors hover:border-gray-900 hover:text-gray-900 md:w-auto"
                    >
                      <Link to={`/products/${p.id}`}>
                        <div>
                          <h2 className="mb-2 text-xl font-medium">
                            {p.title}
                          </h2>
                          <p>{formatPrices(cart, p.variants[0])}</p>
                        </div>
                      </Link>
                    </div>
                  );
                })}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
