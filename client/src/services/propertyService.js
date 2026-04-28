import api from './api';

export const getProperties = (params) =>
  api.get('/properties', { params }).then(r => r.data);

export const searchProperties = (params) =>
  api.get('/properties/search', { params }).then(r => r.data);

export const getPropertyById = (id) =>
  api.get(`/properties/${id}`).then(r => r.data);

export const getMyListings = () =>
  api.get('/properties/my-listings').then(r => r.data);

export const createProperty = (formData) =>
  api.post('/properties', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);

export const updateProperty = (id, formData) =>
  api.put(`/properties/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);

export const deleteProperty = (id) =>
  api.delete(`/properties/${id}`).then(r => r.data);

export const toggleAvailability = (id) =>
  api.patch(`/properties/${id}/availability`).then(r => r.data);

export const toggleWishlist = (id) =>
  api.post(`/properties/${id}/wishlist`).then(r => r.data);
