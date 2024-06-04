export const login = async (username: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data.token;
};

export const register = async (username: string, password: string) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data.token;
};

export const getToken = () => {
  return localStorage.getItem('token');
};
