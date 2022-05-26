const unAuthenticatedAdminEndpoints: Record<string, string> = {
  '/admin/auth': 'POST',
  '/admin/users/password-token': 'POST',
  '/admin/users/reset-password': 'POST',
  '/admin/invites/accept': 'POST',
};
export interface Config {
  baseUrl: string;
  maxRetries: number;
  apiKey?: string;
}
export interface RequestOptions {
  timeout?: number;
  numberOfRetries?: number;
}

export type RequestMethod = 'DELETE' | 'POST' | 'GET' | 'HEAD';

const defaultConfig = {
  maxRetries: 0,
  baseUrl: 'http://localhost:9000',
};

class Client {
  private config: Config;

  constructor(config: Config) {
    /** @private @constant {Config} */
    this.config = { ...defaultConfig, ...config };
  }

  requiresAuthentication(path: string, method: string): boolean {
    return (
      path.startsWith('/admin') &&
      unAuthenticatedAdminEndpoints[path] !== method
    );
  }

  /**
   * Fetch request
   * @param {Types.RequestMethod} method request method
   * @param {string} path request path
   * @param {object} payload request payload
   * @param {RequestOptions} options axios configuration, not in used
   * @param {object} customHeaders custom request headers
   * @return {object}
   */
  async request(
    method: RequestMethod,
    path: string,
    payload: Record<string, any> | null = null,
    options: RequestOptions = {},
    customHeaders: Record<string, any> = {},
  ): Promise<any> {
    if (method === 'POST' && !payload) {
      payload = {};
    }

    let authHeaders: Record<string, string> = {};
    if (this.config.apiKey && this.requiresAuthentication(path, method)) {
      authHeaders = {
        Authorization: `Bearer ${this.config.apiKey}`,
      };
    }

    let requestInit: RequestInit = {
      method,
      headers: {
        ...authHeaders,
        ...customHeaders,
      },
    };

    if (method !== 'HEAD' && method !== 'GET') {
      requestInit.body = JSON.stringify(payload);
    }

    const response = await fetch(`${this.config.baseUrl}${path}`, requestInit);

    let data: Record<string, string> = {};
    try {
      data = await response.json();
    } catch (e) {
      console.log(e);
    }

    // e.g. data = { cart: { ... } }, response = { status, headers, ... }
    // e.g. would return an object like of this shape { cart, response }
    return { ...data, response };
  }
}

export default Client;
