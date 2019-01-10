export const baseUrlProd = "http://localhost:8003/api";

/**
 * Handles backend communication.
 */
export default {
  async request(path: string, method: 'get' | 'post' | 'put' | 'delete' = 'get', body?: object): Promise<object> {
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    const result = await fetch(
      `${baseUrlProd}${path}`,
      {
        body: method != 'get' ? JSON.stringify(body) : undefined,
        headers: {
          "Content-Type": "application/json"
        },
        method: method.toUpperCase()
      }
    );
    return await result.json();
  }
}