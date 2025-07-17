export interface FetchOptions extends RequestInit {
  auth?: boolean; // If true, adds Authorization header
}

export const fetchWithToken = async (url: string, options: FetchOptions = {}) => {
  const token = localStorage.getItem('instabuild_token');

  const headers = new Headers(options.headers || {});

  // Inject Authorization header if needed
  if (options.auth && token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};
