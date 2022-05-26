import BaseResource from './base';
import type { ResponsePromise } from '../typings';
import type { StoreReturnsRes, StorePostReturnsReq } from '@medusajs/medusa';

class ReturnsResource extends BaseResource {
  /**
   * Creates a return request
   * @param {StorePostReturnsReq} payload details needed to create a return
   * @param customHeaders
   * @return {ResponsePromise<StoreReturnsRes>}
   */
  create(
    payload: StorePostReturnsReq,
    customHeaders: Record<string, any> = {},
  ): ResponsePromise<StoreReturnsRes> {
    const path = `/store/returns`;
    return this.client.request('POST', path, payload, {}, customHeaders);
  }
}

export default ReturnsResource;
