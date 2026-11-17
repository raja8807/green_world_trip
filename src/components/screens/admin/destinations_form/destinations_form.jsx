import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import { uploadFileToR2, deleteFileFromR2 } from '@/utils/r2Upload';
import { getImageUrl } from '@/utils/image';
import { Trash } from 'react-bootstrap-icons';

const DestinationsForm = ({ initialData }) => {
  const router = useRouter();
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      tours_text: '',
      image: '',
      href: '',
      is_large: false,
      sort_order: 0,
    }
  );
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    try {
      setUploadingImage(true);
      setError('');
      const file = e.target.files[0];
      if (!file) return;

      // Delete old image if replacing
      if (formData.image) {
        await deleteFileFromR2(formData.image);
      }

      const { key } = await uploadFileToR2(file, 'destinations');
      setFormData((prev) => ({ ...prev, image: key }));
    } catch (err) {
      setError(err.message || 'Error uploading image to Cloudflare R2.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!formData.image) return;
    if (confirm('Are you sure you want to delete this destination image from storage?')) {
      try {
        setDeletingImage(true);
        await deleteFileFromR2(formData.image);
        setFormData((prev) => ({ ...prev, image: '' }));
      } catch (err) {
        setError(err.message || 'Error deleting image from Cloudflare R2.');
      } finally {
        setDeletingImage(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (initialData?.id) {
        // Update
        const { error: updateError } = await supabase
          .from('top_destinations')
          .update({
            title: formData.title,
            tours_text: formData.tours_text,
            image: formData.image,
            href: formData.href,
            is_large: formData.is_large,
            sort_order: parseInt(formData.sort_order),
          })
          .eq('id', initialData.id);

        if (updateError) throw updateError;
      } else {
        // Create
        const { error: insertError } = await supabase
          .from('top_destinations')
          .insert([
            {
              title: formData.title,
              tours_text: formData.tours_text,
              image: formData.image,
              href: formData.href,
              is_large: formData.is_large,
              sort_order: parseInt(formData.sort_order),
            },
          ]);

        if (insertError) throw insertError;
      }

      router.push('/admin/top-destinations');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm border">
      <h3 className="mb-4">{initialData ? 'Edit Destination' : 'Add New Destination'}</h3>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Kerala"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tours Text</Form.Label>
          <Form.Control
            type="text"
            name="tours_text"
            value={formData.tours_text}
            onChange={handleChange}
            required
            placeholder="e.g. 15 tours"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Destination Image</Form.Label>
          {formData.image ? (
            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded border">
              <img
                src={getImageUrl(formData.image)}
                alt="Preview"
                style={{
                  height: "90px",
                  width: "140px",
                  borderRadius: "4px",
                  objectFit: "cover",
                  border: "1px solid #dee2e6"
                }}
              />
              <div>
                <div className="text-muted small mb-2 text-break">
                  <strong>Current Image:</strong> {formData.image}
                </div>
                <Button
                  type="button"
                  variant="outline-danger"
                  size="sm"
                  onClick={handleRemoveImage}
                  disabled={deletingImage}
                  className="d-flex align-items-center gap-1"
                >
                  <Trash size={14} />
                  {deletingImage ? "Deleting from storage..." : "Delete Image to Replace"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="d-flex gap-2 mb-2">
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <span className="align-self-center text-muted text-nowrap">
                    Uploading...
                  </span>
                )}
              </div>
              <Form.Control
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                placeholder="Or paste an image URL / path..."
              />
            </>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Destination Link (href)</Form.Label>
          <Form.Control
            type="text"
            name="href"
            value={formData.href}
            onChange={handleChange}
            required
            placeholder="e.g. /domestic/Kerala"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Sort Order</Form.Label>
          <Form.Control
            type="number"
            name="sort_order"
            value={formData.sort_order}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Check
            type="checkbox"
            name="is_large"
            label="Is Large (Spans 2 columns)"
            checked={formData.is_large}
            onChange={handleChange}
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Destination'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default DestinationsForm;
