import { API_BASE_URL } from './apiConfig';
import { getTokenFromCookies } from './getTokenFromCookies';

export async function authorizedFetch(path, options = {}) {
  const token = getTokenFromCookies();

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Detect JSON vs text
  let data = null;
  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  // IMPORTANT: Handle errors
  if (!res.ok) {
    throw new Error(data?.message || data || 'Request failed');
  }

  // IMPORTANT: Return value (your current code does NOT return anything)
  return data;
}
