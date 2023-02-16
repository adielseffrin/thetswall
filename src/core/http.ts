export class Http {

  static baseUrl: string = '';

  static async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const urlParams = new URL(url, this.baseUrl);

    if (params) {
      Object.keys(params).forEach(key => {
        urlParams.searchParams.append(key, params[key]);
      });
    }

    const response = await fetch(urlParams.toString(), {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`Error http-status: ${response.status}`);
    }

    return await response.json() as T;
  }
}