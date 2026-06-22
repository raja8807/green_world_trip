import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import { Country, State } from 'country-state-city';
import styles from './tour_form.module.scss';
import CustomContainer from '@/components/ui/custom_container/custom_container';

const CONTINENTS = ['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania', 'Antarctica'];

const DOMESTIC_REGIONS = {
  "North India": [
    "Agra", "Amritsar", "Ayodhya", "Chandigarh", "Delhi", "Gulmarg", "Haridwar & Rishikesh", "Himachal Pradesh", "Jaipur", "Jaisalmer", "Jammu and Kashmir", "Ladakh", "Lucknow", "Manali", "Mussoorie", "Nainital", "Pahalgam", "Shimla", "Srinagar", "Uttarakhand", "Varanasi", "Vrindavan"
  ],
  "South India": [
    "Alleppey", "Araku Valley", "Bangalore", "Chennai", "Chettinad", "Coorg", "Hyderabad", "Kanyakumari", "Karnataka", "Kerala", "Kochi", "Madurai", "Munnar", "Mysore", "Ooty", "Rameswaram", "Tamil Nadu", "Thekkady", "Tirupati", "Vizag", "Wayanad"
  ],
  "East India": [
    "Bihar", "Darjeeling", "Jharkhand", "Kolkata", "Odisha", "Puri", "West Bengal"
  ],
  "West India": [
    "Ahmedabad", "Goa", "Gujarat", "Jodhpur", "Mahabaleshwar", "Maharashtra", "Mumbai", "Nashik", "Pune", "Rajasthan", "Shirdi", "Udaipur"
  ],
  "North East": [
    "Arunachal Pradesh", "Assam", "Gangtok", "Guwahati", "Manipur", "Meghalaya", "Pelling", "Shillong", "Sikkim", "Tawang"
  ],
  "Central India": [
    "Bhopal", "Chhattisgarh", "Gwalior", "Indore", "Madhya Pradesh", "Pachmarhi", "Ujjain"
  ],
  "Spiritual": [
    "Ayodhya", "Kasi"
  ]
};

const TourForm = ({ initialData }) => {
  const router = useRouter();
  const isEdit = !!initialData;
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingItineraryImageMap, setUploadingItineraryImageMap] = useState({});
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    category_type: initialData?.category_type || 'domestic',
    tour_type: initialData?.tour_type || '',
    group_size: initialData?.group_size || '',
    duration_days: initialData?.duration_days || '',
    duration_nights: initialData?.duration_nights || '',
    main_image: initialData?.main_image || '',
    images: initialData?.images || [],
    overview: initialData?.overview || '',
    region_continent: initialData?.region_continent || '',
    location: initialData?.location || '',
    // Arrays
    destinations: initialData?.destinations || [],
    highlights: initialData?.highlights || [],
    included: initialData?.included || [],
    excluded: initialData?.excluded || [],
    // Relational
    itineraries: initialData?.tour_itineraries || [],
    // JSON
    flags: initialData?.flags || { is_featured: false, is_trending: false },
  });

  // Location handling variables
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [selectedStateCode, setSelectedStateCode] = useState('');
  
  // country-state-city data
  const allCountries = Country.getAllCountries();
  
  // Filter countries based on continent using timezone heuristic
  const filteredCountries = React.useMemo(() => {
    if (formData.category_type === 'domestic' || !formData.region_continent) return allCountries;
    
    let prefix = '';
    if (formData.region_continent === 'Asia') prefix = 'Asia/';
    else if (formData.region_continent === 'Europe') prefix = 'Europe/';
    else if (formData.region_continent === 'Africa') prefix = 'Africa/';
    else if (formData.region_continent === 'North America' || formData.region_continent === 'South America') prefix = 'America/';
    else if (formData.region_continent === 'Oceania') prefix = 'Australia/';
    else if (formData.region_continent === 'Antarctica') prefix = 'Antarctica/';

    if (!prefix) return allCountries;
    return allCountries.filter(c => c.timezones?.some(tz => tz.zoneName.startsWith(prefix)));
  }, [formData.region_continent, formData.category_type]);

  const states = selectedCountryCode ? State.getStatesOfCountry(selectedCountryCode) : [];

  // Domestic specific data
  const domesticDestinations = formData.category_type === 'domestic' && formData.region_continent 
    ? DOMESTIC_REGIONS[formData.region_continent] || [] 
    : [];

  // Initialize selected codes if in edit mode and a state_country exists
  useEffect(() => {
    if (initialData?.category_type === 'international' && initialData?.state_country) {
      const country = allCountries.find(c => c.name === initialData.state_country);
      if (country) setSelectedCountryCode(country.isoCode);
    }
  }, [initialData, allCountries]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'name') {
      // Auto-generate URL friendly slug from name
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
        
      setFormData(prev => ({ ...prev, name: value, slug: generatedSlug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e) => {
    try {
      setUploadingImage(true);
      setError('');
      
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('tours')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('tours').getPublicUrl(filePath);
      
      setFormData(prev => ({ ...prev, main_image: data.publicUrl }));
    } catch (err) {
      setError(err.message || 'Error uploading image. Make sure the bucket exists and is public.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    try {
      setUploadingGallery(true);
      setError('');
      
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('tours')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('tours').getPublicUrl(filePath);
        return data.publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...uploadedUrls] 
      }));
    } catch (err) {
      setError(err.message || 'Error uploading gallery images.');
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleFlagChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      flags: { ...prev.flags, [name]: checked }
    }));
  };

  // --- Itinerary Handlers ---
  const handleItineraryChange = (index, field, value) => {
    const newItineraries = [...formData.itineraries];
    newItineraries[index] = { ...newItineraries[index], [field]: value };
    setFormData(prev => ({ ...prev, itineraries: newItineraries }));
  };

  const addItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itineraries: [...prev.itineraries, { day_number: prev.itineraries.length + 1, head: '', text: '', images: [] }]
    }));
  };

  const removeItineraryDay = (index) => {
    const newItineraries = [...formData.itineraries];
    newItineraries.splice(index, 1);
    // Re-index days automatically
    const reindexed = newItineraries.map((it, idx) => ({ ...it, day_number: idx + 1 }));
    setFormData(prev => ({ ...prev, itineraries: reindexed }));
  };

  const handleItineraryImageUpload = async (e, index) => {
    try {
      setUploadingItineraryImageMap(prev => ({ ...prev, [index]: true }));
      setError('');
      
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `itinerary/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('tours').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('tours').getPublicUrl(filePath);
        return data.publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      const newItineraries = [...formData.itineraries];
      newItineraries[index].images = [...(newItineraries[index].images || []), ...uploadedUrls];
      
      setFormData(prev => ({ ...prev, itineraries: newItineraries }));
    } catch (err) {
      setError(err.message || 'Error uploading itinerary images.');
    } finally {
      setUploadingItineraryImageMap(prev => ({ ...prev, [index]: false }));
    }
  };

  const removeItineraryImage = (dayIndex, imgIndex) => {
    const newItineraries = [...formData.itineraries];
    newItineraries[dayIndex].images.splice(imgIndex, 1);
    setFormData(prev => ({ ...prev, itineraries: newItineraries }));
  };
  // --------------------------

  // Array handlers
  const handleArrayChange = (field, index, value) => {
    const newArr = [...formData[field]];
    newArr[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArr }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    const newArr = [...formData[field]];
    newArr.splice(index, 1);
    setFormData(prev => ({ ...prev, [field]: newArr }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare final data
      let finalStateCountry = formData.location; // Default if not selected
      
      if (formData.category_type === 'international') {
        if (selectedCountryCode) {
          const country = Country.getCountryByCode(selectedCountryCode);
          finalStateCountry = country?.name;
        }
      } else {
        // For domestic, the state_country is effectively the destination they choose
        if (formData.location) {
          finalStateCountry = formData.location;
        }
      }

      const { itineraries, ...restData } = formData;
      const payload = {
        ...restData,
        state_country: finalStateCountry,
        group_size: restData.group_size ? parseInt(restData.group_size) : null,
        duration_days: parseInt(restData.duration_days),
        duration_nights: parseInt(restData.duration_nights),
      };

      let currentTourId = initialData?.id;

      if (isEdit) {
        const { error } = await supabase.from('tours').update(payload).eq('id', currentTourId);
        if (error) throw error;
      } else {
        const { data: newTour, error } = await supabase.from('tours').insert(payload).select().single();
        if (error) throw error;
        currentTourId = newTour.id;
      }

      // Sync Relational Itineraries
      if (currentTourId) {
        // Wipe existing itineraries
        await supabase.from('tour_itineraries').delete().eq('tour_id', currentTourId);
        
        // Re-insert new current array
        if (formData.itineraries.length > 0) {
          const itinerariesPayload = formData.itineraries.map(it => ({
            tour_id: currentTourId,
            day_number: it.day_number,
            head: it.head,
            text: it.text,
            images: it.images || []
          }));
          const { error: itError } = await supabase.from('tour_itineraries').insert(itinerariesPayload);
          if (itError) throw itError;
        }
      }

      router.push('/admin/tours');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render helper for dynamic arrays
  const renderArrayInputs = (field, label, placeholder) => (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Card.Title>{label}</Card.Title>
        {formData[field].map((item, idx) => (
          <div key={idx} className="d-flex mb-2 gap-2">
            <Form.Control
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(field, idx, e.target.value)}
              placeholder={placeholder}
            />
            <Button variant="outline-danger" onClick={() => removeArrayItem(field, idx)}>X</Button>
          </div>
        ))}
        <Button variant="outline-primary" size="sm" onClick={() => addArrayItem(field)}>
          + Add {label}
        </Button>
      </Card.Body>
    </Card>
  );

  return (
    <div className={styles.adminFormPage}>
      <CustomContainer>
        <div className={styles.header}>
          <h2>{isEdit ? 'Edit Tour' : 'Create New Tour'}</h2>
          <Button variant="secondary" onClick={() => router.push('/admin/tours')}>Back to List</Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} className={styles.formContainer}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Basic Information</Card.Title>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tour Name *</Form.Label>
                    <Form.Control required name="name" value={formData.name} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Slug (URL) *</Form.Label>
                    <Form.Control required readOnly name="slug" value={formData.slug} onChange={handleChange} className="bg-light" />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category Type *</Form.Label>
                    <Form.Select name="category_type" value={formData.category_type} onChange={handleChange}>
                      <option value="domestic">Domestic</option>
                      <option value="international">International</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tour Type</Form.Label>
                    <Form.Control name="tour_type" value={formData.tour_type} onChange={handleChange} placeholder="e.g. Daily Tour, Adventure" />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Group Size</Form.Label>
                    <Form.Control type="number" name="group_size" value={formData.group_size} onChange={handleChange} placeholder="e.g. 6" />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Duration Days *</Form.Label>
                    <Form.Control required type="number" name="duration_days" value={formData.duration_days} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Duration Nights *</Form.Label>
                    <Form.Control required type="number" name="duration_nights" value={formData.duration_nights} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Main Image *</Form.Label>
                <div className="d-flex gap-2 mb-2">
                  <Form.Control 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    disabled={uploadingImage}
                  />
                  {uploadingImage && <span className="align-self-center text-muted text-nowrap">Uploading...</span>}
                </div>
                <Form.Control required name="main_image" value={formData.main_image} onChange={handleChange} placeholder="Or paste an image URL here..." />
                {formData.main_image && (
                  <div className="mt-2">
                    <img src={formData.main_image} alt="Preview" style={{ height: '100px', width: 'auto', borderRadius: '4px', objectFit: 'cover' }} />
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Gallery Images</Form.Label>
                <div className="d-flex gap-2 mb-2">
                  <Form.Control 
                    type="file" 
                    accept="image/*" 
                    multiple
                    onChange={handleGalleryUpload} 
                    disabled={uploadingGallery}
                  />
                  {uploadingGallery && <span className="align-self-center text-muted text-nowrap">Uploading...</span>}
                </div>
                
                {formData.images.length > 0 && (
                  <div className="d-flex flex-wrap gap-3 mt-3 p-3 bg-light rounded border">
                    {formData.images.map((imgUrl, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img src={imgUrl} alt="Gallery" style={{ height: '100px', width: '150px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #ddd' }} />
                        <Button 
                          variant="danger" 
                          size="sm" 
                          style={{ position: 'absolute', top: -8, right: -8, padding: '0 6px', borderRadius: '50%', fontWeight: 'bold' }}
                          onClick={() => removeGalleryImage(idx)}
                        >
                          X
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Overview</Form.Label>
                <Form.Control as="textarea" rows={4} name="overview" value={formData.overview} onChange={handleChange} />
              </Form.Group>
            </Card.Body>
          </Card>

          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Location Data</Card.Title>
              {formData.category_type === 'international' ? (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Continent</Form.Label>
                      <Form.Select name="region_continent" value={formData.region_continent} onChange={handleChange}>
                        <option value="">Select Continent...</option>
                        {CONTINENTS.map(c => <option key={c} value={c}>{c}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Country</Form.Label>
                      <Form.Select value={selectedCountryCode} onChange={(e) => setSelectedCountryCode(e.target.value)}>
                        <option value="">Select Country...</option>
                        {filteredCountries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Domestic Region</Form.Label>
                      <Form.Select name="region_continent" value={formData.region_continent} onChange={handleChange}>
                        <option value="">Select Region...</option>
                        {Object.keys(DOMESTIC_REGIONS).map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Destination</Form.Label>
                      <Form.Select 
                        name="location" 
                        value={formData.location} 
                        onChange={handleChange}
                        disabled={!formData.region_continent}
                      >
                        <option value="">Select Destination...</option>
                        {domesticDestinations.map(dest => (
                          <option key={dest} value={dest}>{dest}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              )}
              
              <Form.Group className="mb-3">
                <Form.Label>Specific Location / Address</Form.Label>
                <Form.Control name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Mount Hollywood, LA" />
                <Form.Text className="text-muted">Use this to display a specific localized string on the tour card.</Form.Text>
              </Form.Group>
            </Card.Body>
          </Card>

          <Row>
            <Col md={6}>{renderArrayInputs('destinations', 'Destinations', 'e.g. Salt Lake City')}</Col>
            <Col md={6}>{renderArrayInputs('highlights', 'Highlights', 'e.g. Canoe ride, tattoos')}</Col>
            <Col md={6}>{renderArrayInputs('included', 'Included', 'e.g. Private Transport')}</Col>
            <Col md={6}>{renderArrayInputs('excluded', 'Excluded', 'e.g. Additional Services')}</Col>
          </Row>

          <Card className="mb-4 shadow-sm border-primary">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Itinerary Builder</h5>
              <Button variant="light" size="sm" onClick={addItineraryDay} className="fw-bold text-primary">
                + Add Day
              </Button>
            </Card.Header>
            <Card.Body>
              {formData.itineraries.length === 0 ? (
                <p className="text-muted mb-0">No itineraries added yet. Click + Add Day to start.</p>
              ) : (
                formData.itineraries.map((it, idx) => (
                  <div key={idx} className="p-3 mb-3 border rounded position-relative bg-light">
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      className="position-absolute" 
                      style={{ top: 10, right: 10 }}
                      onClick={() => removeItineraryDay(idx)}
                    >
                      Remove Day {it.day_number}
                    </Button>
                    <h6 className="mb-3 text-primary">Itinererary {it.day_number}</h6>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Headline / Title</Form.Label>
                      <Form.Control 
                        required
                        value={it.head} 
                        onChange={(e) => handleItineraryChange(idx, 'head', e.target.value)} 
                        placeholder="e.g. Arrival in Switzerland" 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        required
                        rows={3} 
                        value={it.text} 
                        onChange={(e) => handleItineraryChange(idx, 'text', e.target.value)} 
                        placeholder="Describe the day's activities..." 
                      />
                    </Form.Group>

                    <Form.Group className="mb-0">
                      <Form.Label>Day Images</Form.Label>
                      <div className="d-flex gap-2 mb-2">
                        <Form.Control 
                          type="file" 
                          accept="image/*" 
                          multiple
                          onChange={(e) => handleItineraryImageUpload(e, idx)} 
                          disabled={uploadingItineraryImageMap[idx]}
                          size="sm"
                        />
                        {uploadingItineraryImageMap[idx] && <span className="align-self-center text-muted small">Uploading...</span>}
                      </div>
                      
                      {it.images && it.images.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mt-2">
                          {it.images.map((imgUrl, imgIdx) => (
                            <div key={imgIdx} style={{ position: 'relative' }}>
                              <img src={imgUrl} alt="Itinerary" style={{ height: '60px', width: '90px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #ccc' }} />
                              <Button 
                                variant="danger" 
                                size="sm" 
                                style={{ position: 'absolute', top: -5, right: -5, padding: '0 4px', fontSize: '10px', borderRadius: '50%' }}
                                onClick={() => removeItineraryImage(idx, imgIdx)}
                              >
                                X
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </Form.Group>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>

          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Settings & Flags</Card.Title>
              <Form.Check 
                type="switch"
                id="is-featured"
                label="Is Featured?"
                name="is_featured"
                checked={formData.flags.is_featured}
                onChange={handleFlagChange}
                className="mb-2"
              />
              <Form.Check 
                type="switch"
                id="is-trending"
                label="Is Trending?"
                name="is_trending"
                checked={formData.flags.is_trending}
                onChange={handleFlagChange}
              />
            </Card.Body>
          </Card>

          <div className="d-grid mb-5">
            <Button variant="success" size="lg" type="submit" disabled={loading}>
              {loading ? 'Saving...' : (isEdit ? 'Update Tour' : 'Create Tour')}
            </Button>
          </div>
        </Form>
      </CustomContainer>
    </div>
  );
};

export default TourForm;
