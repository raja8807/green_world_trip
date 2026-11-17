import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import { uploadFileToR2, deleteFileFromR2 } from '@/utils/r2Upload';
import { getImageUrl } from '@/utils/image';
import { Trash } from 'react-bootstrap-icons';

const TestimonialsForm = ({ initialData }) => {
  const router = useRouter();
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      image: '',
      review: '',
    }
  );
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    try {
      setUploadingImage(true);
      setError('');
      const file = e.target.files[0];
      if (!file) return;

      // Delete old avatar if replacing
      if (formData.image) {
        await deleteFileFromR2(formData.image);
      }

      const { key } = await uploadFileToR2(file, 'testimonials');
      setFormData((prev) => ({ ...prev, image: key }));
    } catch (err) {
      setError(err.message || 'Error uploading image to Cloudflare R2.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!formData.image) return;
    if (confirm('Are you sure you want to delete this photo from storage?')) {
      try {
        setDeletingImage(true);
        await deleteFileFromR2(formData.image);
        setFormData((prev) => ({ ...prev, image: '' }));
      } catch (err) {
        setError(err.message || 'Error deleting photo from Cloudflare R2.');
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
          .from('testimonials')
          .update({
            name: formData.name,
            image: formData.image,
            review: formData.review,
          })
          .eq('id', initialData.id);

        if (updateError) throw updateError;
      } else {
        // Create
        const { error: insertError } = await supabase
          .from('testimonials')
          .insert([
            {
              name: formData.name,
              image: formData.image,
              review: formData.review,
            },
          ]);

        if (insertError) throw insertError;
      }

      router.push('/admin/testimonials');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm border">
      <h3 className="mb-4">{initialData ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Client Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. John Doe"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Client Photo (Optional)</Form.Label>
          {formData.image ? (
            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded border">
              <img
                src={getImageUrl(formData.image)}
                alt="Avatar Preview"
                style={{
                  height: "70px",
                  width: "70px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid #dee2e6"
                }}
              />
              <div>
                <div className="text-muted small mb-2 text-break">
                  <strong>Current Photo:</strong> {formData.image}
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
                  {deletingImage ? "Deleting from storage..." : "Delete Photo to Replace"}
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
                value={formData.image || ''}
                onChange={handleChange}
                placeholder="Leave empty for default avatar, or paste a URL / path"
              />
            </>
          )}
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Review Text</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="review"
            value={formData.review}
            onChange={handleChange}
            required
            placeholder="Type the review here..."
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Testimonial'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default TestimonialsForm;
