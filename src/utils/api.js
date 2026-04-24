const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function apiFetch(endpoint, options = {}) {
  // Prefix automatically with BASE_URL, ensure leading slash on endpoint
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${formattedEndpoint}`;
  
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Inject admin token if it exists in sessionStorage
  const adminToken = sessionStorage.getItem('adminToken');
  if (adminToken) {
    headers.set('Authorization', `Bearer ${adminToken}`);
  }

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, { ...options, headers });
  
  if (!res.ok) {
    let errorMessage = `HTTP Error ${res.status}: ${res.statusText}`;
    try {
      const errorText = await res.text();
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch (e) {
      if (res.status === 404) {
        errorMessage = "404 Not Found: Ensure your API proxy exists or you are running the backend correctly.";
      }
    }
    throw new Error(errorMessage);
  }

  // Handle empty responses
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
