import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Upload, X } from 'lucide-react';
import { createProperty, updateProperty, getPropertyById } from '../services/propertyService';
import { PROPERTY_TYPES, AMENITIES_LIST } from '../utils/helpers';
import { PageSpinner } from '../components/common/Spinner';
import toast from 'react-hot-toast';

export default function ListingForm() {
  const { id } = useParams(); // if editing
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const { data, isLoading: fetchLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getPropertyById(id),
    enabled: !!id,
    onSuccess: ({ property }) => {
      setSelectedAmenities(property.amenities || []);
    },
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: id && data?.property ? {
      ...data.property,
      ...data.property.location,
      lat: data.property.location?.coordinates?.coordinates?.[1],
      lng: data.property.location?.coordinates?.coordinates?.[0],
    } : {},
  });

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const toggleAmenity = (a) => {
    setSelectedAmenities(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    );
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();

    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) formData.append(k, v);
    });
    formData.append('amenities', JSON.stringify(selectedAmenities));
    images.forEach(img => formData.append('images', img));

    try {
      if (id) {
        await updateProperty(id, formData);
        toast.success('Listing updated!');
      } else {
        await createProperty(formData);
        toast.success('Listing created!');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save listing');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <PageSpinner />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{id ? 'Edit listing' : 'Add new listing'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input {...register('title', { required: 'Title required' })} className="input-field" placeholder="Cozy beachfront villa..." />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea {...register('description', { required: 'Description required' })} rows={5} className="input-field resize-none" placeholder="Describe your property..." />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select {...register('type', { required: true })} className="input-field">
                <option value="">Select type</option>
                {PROPERTY_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per night ($) *</label>
              <input type="number" {...register('pricePerNight', { required: true, min: 1 })} className="input-field" placeholder="100" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
              <input type="number" {...register('maxGuests', { required: true, min: 1 })} className="input-field" defaultValue={2} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <input type="number" {...register('bedrooms')} className="input-field" defaultValue={1} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
              <input type="number" {...register('bathrooms')} className="input-field" defaultValue={1} />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Location</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <input {...register('address', { required: true })} className="input-field" placeholder="123 Ocean Drive" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input {...register('city', { required: true })} className="input-field" placeholder="Bali" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
              <input {...register('country', { required: true })} className="input-field" placeholder="Indonesia" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input type="number" step="any" {...register('lat')} className="input-field" placeholder="-8.4095" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input type="number" step="any" {...register('lng')} className="input-field" placeholder="115.1889" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Photos</h2>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-brand transition">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 font-medium">Click to upload photos</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB each (max 10)</p>
            <input type="file" multiple accept="image/*" onChange={handleImages} className="sr-only" />
          </label>
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {previews.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => {
                    setPreviews(p => p.filter((_, j) => j !== i));
                    setImages(imgs => imgs.filter((_, j) => j !== i));
                  }} className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5">
                    <X className="w-3.5 h-3.5 text-gray-700" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Amenities */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AMENITIES_LIST.map(a => (
              <button key={a} type="button" onClick={() => toggleAmenity(a)}
                className={`text-sm px-3 py-2 rounded-xl border capitalize transition ${selectedAmenities.includes(a) ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">House Rules</h2>
          <div className="grid grid-cols-3 gap-4">
            {[{ name: 'smokingAllowed', label: 'Smoking allowed' },
              { name: 'petsAllowed', label: 'Pets allowed' },
              { name: 'eventsAllowed', label: 'Events allowed' }].map(r => (
              <label key={r.name} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register(r.name)} className="w-4 h-4 accent-brand" />
                <span className="text-sm text-gray-700">{r.label}</span>
              </label>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min stay (nights)</label>
              <input type="number" {...register('minStay')} className="input-field" defaultValue={1} min={1} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max stay (nights)</label>
              <input type="number" {...register('maxStay')} className="input-field" defaultValue={90} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional rules</label>
            <textarea {...register('houseRules')} rows={3} className="input-field resize-none" placeholder="Check-in after 3pm, no parties..." />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate('/dashboard')} className="btn-outline">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : id ? 'Update listing' : 'Create listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
