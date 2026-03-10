import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { auth } from '@/config/firebase';

const baseQuery = fetchBaseQuery({ 
  baseUrl: '',
  prepareHeaders: async (headers) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});
