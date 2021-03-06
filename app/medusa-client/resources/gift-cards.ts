import type { StoreGiftCardsRes } from '@medusajs/medusa';
import type { ResponsePromise } from '../typings';
import BaseResource from './base';

class GiftCardsResource extends BaseResource {
  /**
   * @description Retrieves a single GiftCard
   * @param {string} code code of the gift card
   * @param customHeaders
   * @return {ResponsePromise<StoreGiftCardsRes>}
   */
  retrieve(
    code: string,
    customHeaders: Record<string, any> = {},
  ): ResponsePromise<StoreGiftCardsRes> {
    const path = `/store/gift-cards/${code}`;
    return this.client.request('GET', path, {}, {}, customHeaders);
  }
}

export default GiftCardsResource;
