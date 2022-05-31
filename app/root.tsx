import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import type { NewCart } from './models/medusa.server';
import { CART_SESSION_KEY, getCart } from './models/medusa.server';
import { getSession, getUser, sessionStorage } from './session.server';
import tailwindStylesheetUrl from './styles/tailwind.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix Notes',
  viewport: 'width=device-width,initial-scale=1',
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  cart: NewCart;
};

export const loader: LoaderFunction = async ({ request }) => {
  const cart = await getCart(request);
  const session = await getSession(request);
  session.set(CART_SESSION_KEY, cart.id);

  return json<LoaderData>(
    {
      user: await getUser(request),
      cart,
    },
    {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session, {
          maxAge: 60 * 60 * 24 * 7, // 7 days
        }),
      },
    },
  );
};

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
