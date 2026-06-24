const BASE_URL = 'http://localhost:3001';

async function request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>), 
    };

    if(token){
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if(!res.ok){
        const error = await res.json().catch(() => ({ message: 'Something went wrong'})) 
        throw new Error(error.message || 'Request failed');
    } 

    if (res.status === 204) return null as T;

    const text = await res.text();
    return text ? JSON.parse(text) : (null as T);
}

export const authApi = {
    register: (email: string, password: string) =>
        request<{ access_token: string }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    login: (email: string, password: string) => 
        request<{ access_token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),
};


export const booksApi = {
    getAll: (params?: {page?: number, limit?: number, author?: string}, token?: string) => {
        const query = new URLSearchParams();
        if(params?.page) query.set('page', params.page.toString());
        if(params?.limit) query.set('limit', params.limit.toString());
        if(params?.author) query.set('author', params.author);
        return request<{ data: Book[], meta: Meta}>(`/books?${query}`, {}, token);

    },

    getOne: (id: number, token?: string) =>
        request<Book>(`/books/${id}`, {}, token),

    create: (body: CreateBookInput, token: string) =>
        request<Book>('/books', {
            method: 'POST', 
            body: JSON.stringify(body),
        }, token),
        
    update: (id: number, body: Partial<CreateBookInput>, token: string) =>
        request<Book>(`/books/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(body),
        }, token),

    delete: (id: number, token: string) =>
        request<null>(`/books/${id}`, {
            method: 'DELETE',
        }, token),
};

export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  published: boolean;
  createdAt: string;
  owner: { id: number; email: string };
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateBookInput {
  title: string;
  author: string;
  description?: string;
  published?: boolean;
}