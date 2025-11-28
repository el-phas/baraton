import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { config } from '@/config/environment';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface ConferenceRoomImage {
  id?: string;
  image_url: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
}

interface ConferenceRoom {
  id: string;
  name: string;
  price: number;
  size: number;
  max_users: number;
  amenities: string[];
  image_urls: string[];
  description: string;
  created_at: string;
  updated_at: string;
}

interface ConferenceRoomEditDialogProps {
  room: ConferenceRoom | null;
  onClose: () => void;
  onSave: (room: Partial<ConferenceRoom>, images: ConferenceRoomImage[]) => void;
}

const ConferenceRoomEditDialog: React.FC<ConferenceRoomEditDialogProps> = ({ room, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<ConferenceRoom>>({
    id: '',
    name: '',
    price: 0,
    size: 0,
    max_users: 1,
    amenities: [],
    image_urls: [],
    description: '',
    created_at: '',
    updated_at: ''
  });

  const [images, setImages] = useState<ConferenceRoomImage[]>([]);
  const [amenityInput, setAmenityInput] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (room) {
      setFormData({
        ...room,
        price: room.price || 0,
        size: room.size || 0,
        max_users: room.max_users || 1,
        amenities: room.amenities || [],
        image_urls: room.image_urls || [],
        description: room.description || '',
        created_at: room.created_at || '',
        updated_at: room.updated_at || ''
      });
    } else {
      setFormData({
        id: '',
        name: '',
        price: 0,
        size: 0,
        max_users: 1,
        amenities: [],
        image_urls: [],
        description: '',
        created_at: '',
        updated_at: ''
      });
    }
    setImages([]);
  }, [room]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Merge images into image_urls
    const imageUrls = images.map(img => img.image_url).filter(Boolean);
    const now = new Date().toISOString();
    // Only send fields expected by backend
    const dataToSave: Partial<ConferenceRoom> = {
      id: formData.id,
      name: formData.name,
      price: typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price,
      size: typeof formData.size === 'string' ? parseFloat(formData.size) : formData.size,
      max_users: typeof formData.max_users === 'string' ? parseInt(formData.max_users) : formData.max_users,
      amenities: formData.amenities || [],
      image_urls: imageUrls,
      description: formData.description || '',
      created_at: formData.created_at || now,
      updated_at: now
    };
    onSave(dataToSave, images);
  };

  const addAmenity = () => {
    if (amenityInput.trim() && !formData.amenities?.includes(amenityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...(prev.amenities || []), amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities?.filter(a => a !== amenity) || []
    }));
  };

  const addImage = () => {
    const newImage: ConferenceRoomImage = {
      image_url: '', // This line remains unchanged
      alt_text: '',
      display_order: images.length,
      is_primary: images.length === 0
    };
    setImages([...images, newImage]);
  };

  const updateImage = (index: number, field: keyof ConferenceRoomImage, value: string | boolean | number) => {
    const updatedImages = [...images];
    updatedImages[index] = { ...updatedImages[index], [field]: value };
    setImages(updatedImages);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    updatedImages.forEach((img, i) => {
      img.display_order = i;
    });
    setImages(updatedImages);
  };

  const setPrimaryImage = (index: number) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index
    }));
    setImages(updatedImages);
  };

  const handleMultipleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
          return null;
        }

        if (!file.type.startsWith('image/')) {
          toast.error(`File ${file.name} is not an image.`);
          return null;
        }

        // Upload image to backend /upload endpoint
        const formData = new FormData();
        formData.append('image', file);
        const uploadRes = await api.post(`${config.backend.url}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return {
          image_url: uploadRes.data.url,
          alt_text: file.name.split('.')[0],
          display_order: images.length + index,
          is_primary: images.length === 0 && index === 0
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      const validImages = uploadedImages.filter(img => img !== null) as ConferenceRoomImage[];
      
      if (validImages.length > 0) {
        setImages(prev => [...prev, ...validImages]);
        toast.success(`Successfully uploaded ${validImages.length} image(s)`);
      }
    } catch (error) {
      // removed log
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {room ? 'Edit Conference Room' : 'Add New Conference Room'}
          </h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Conference Room Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="max_users">Max Users</Label>
              <Input
                id="max_users"
                type="number"
                value={formData.max_users || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, max_users: parseInt(e.target.value) || 1 }))}
                required
                min={1}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="size">Room Size (sqm)</Label>
              <Input
                id="size"
                type="number"
                value={formData.size || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, size: parseFloat(e.target.value) || 0 }))}
                required
                min={0}
              />
            </div>
            <div>
              <Label htmlFor="price">Price per Hour (Ksh)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                required
                min={0}
              />
            </div>
          </div>

          {/* Removed size_sqm and capacity, now using occupancy only */}

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label>Conference Room Images</Label>
            <div className="space-y-4">
              {/* File Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload multiple images
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG, WEBP up to 5MB each
                      </span>
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMultipleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    disabled={uploading}
                    className="mt-2"
                  >
                    {uploading ? 'Uploading...' : 'Choose Files'}
                  </Button>
                </div>
              </div>

              {/* Display uploaded images */}
              {images.map((image, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Image {index + 1}</span>
                    <div className="flex gap-2">
                      {!image.is_primary && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setPrimaryImage(index)}
                        >
                          Set as Primary
                        </Button>
                      )}
                      {image.is_primary && (
                        <span className="text-sm text-green-600 font-medium">Primary Image</span>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Image preview */}
                  {image.image_url && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={image.image_url} 
                        alt={image.alt_text || `Conference room image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor={`image_url_${index}`}>Image URL</Label>
                    <Input
                      id={`image_url_${index}`}
                      value={image.image_url}
                      onChange={(e) => updateImage(index, 'image_url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`alt_text_${index}`}>Alt Text (Optional)</Label>
                    <Input
                      id={`alt_text_${index}`}
                      value={image.alt_text || ''}
                      onChange={(e) => updateImage(index, 'alt_text', e.target.value)}
                      placeholder="Descriptive text for the image"
                    />
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addImage}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Image URL Manually
              </Button>
            </div>
          </div>

          <div>
            <Label>Amenities</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="Add amenity"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
              />
              <Button type="button" onClick={addAmenity}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities?.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm"
                >
                  {amenity}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeAmenity(amenity)}
                  />
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading} aria-disabled={uploading}>
              {room ? 'Update Conference Room' : 'Create Conference Room'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConferenceRoomEditDialog;