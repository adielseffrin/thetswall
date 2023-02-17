export class Http {

  constructor(baseUrl: string|null){
    if(baseUrl != null){
      this.baseUrl = baseUrl;
    }
  }
    
  baseUrl: string = '';

  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const urlParams = new URL(url, this.baseUrl);

    if (params) {
      Object.keys(params).forEach(key => {
        urlParams.searchParams.append(key, params[key]);
      });
    }

    //TODO pass option through service
    const response = await fetch(urlParams.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        "X-Api-Key": 'Dh00pFBEFC3Htdst6KxndfsKi3eSQ5lyBgbK0c7T',
      },
    });

    if (!response.ok) {
      throw new Error(`Error http-status: ${response.status}`);
    }

    return await response.json() as T;
  }
}