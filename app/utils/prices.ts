import type { ProductVariant } from '@medusajs/medusa';
import type { NewCart } from '~/models/medusa.server';

function getTaxRate(cart: NewCart) {
  if (cart.region) {
    return cart.region && cart.region.tax_rate / 100;
  }
  return 0;
}

type MoneyAmountType = {
  currencyCode: string;
  amount: number | undefined;
};
export function formatMoneyAmount(
  moneyAmount: MoneyAmountType,
  digits: number,
  taxRate = 0,
) {
  let locale = 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: moneyAmount.currencyCode,
    minimumFractionDigits: digits,
  }).format((moneyAmount.amount ?? 0) * (1 + taxRate / 100));
}

export function getVariantPrice(cart: NewCart, variant: ProductVariant) {
  let taxRate = getTaxRate(cart);

  let moneyAmount = variant.prices.find(
    (p) =>
      p.currency_code.toLowerCase() === cart.region.currency_code.toLowerCase(),
  );

  if (moneyAmount && moneyAmount.amount) {
    return (moneyAmount.amount * (1 + taxRate)) / 100;
  }

  return undefined;
}

export function formatPrices(
  cart: NewCart,
  variant: ProductVariant,
  digits = 2,
) {
  if (!cart || !cart.region || !variant) return;
  if (!variant.prices) return '15.00 EUR';
  return formatMoneyAmount(
    {
      currencyCode: cart.region.currency_code,
      amount: getVariantPrice(cart, variant),
    },
    digits,
  );
}
