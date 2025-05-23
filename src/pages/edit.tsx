import { useState, useEffect } from 'react';
import { Media, Meta } from '../Types/common';
import { GalleryComponent } from '../Components/GalleryComponent';
import { InputField } from '../Components/InputField';
import { handleEditSubmit } from '../UI/venue/edit';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeOutOnlyVariants } from '../Constants/constants';
import { validateImage } from '../utilities/validation/validateVenue';
import {
  defaultStatus,
  setSubmitError,
  setSuccessMessage,
  StatusMessage,
} from '../utilities/validation/validation';
import { runVenueValidations } from '../utilities/validation/runVenueValidations';
import { Check, ParkingSquare, PawPrint, Plus, Utensils, Wifi } from 'lucide-react';
import { TextCounter } from '../Components/TextCounter';

/**
 * EditPage Component
 *
 * Renders a form for editing an existing venue. The form allows users to:
 * - View and update media (image URLs)
 * - Modify venue details including name, description, pricing, guests, and location
 * - Toggle available amenities (WiFi, parking, pets, breakfast)
 *
 * Features:
 * - Loads initial venue data from `localStorage`
 * - Validates input fields and media before submission
 * - Displays success or error messages based on the result
 * - On success, navigates to the updated venue's detail page
 *
 * @component
 * @returns {JSX.Element} The form UI for editing a venue
 */

const EditPage = () => {
  useEffect(() => {
    document.title = 'Edit Venue';
  }, []);

  const venueData = localStorage.getItem('editVenue');
  const venue = venueData ? JSON.parse(venueData) : null;

  const navigate = useNavigate();
  const [media, setMedia] = useState<Media[]>(venue?.media || []);
  const [formStatus, setFormStatus] = useState<StatusMessage>(defaultStatus);
  const [imageInput, setImageInput] = useState('');
  const [textCount, setTextCount] = useState<number>(venue?.description?.length || 0);
  const [formData, setFormData] = useState({
    venueName: venue?.name || '',
    description: venue?.description || '',
    price: venue?.price || '',
    maxGuests: venue?.maxGuests || '',
    rating: venue?.rating || '',
    address: venue?.location?.address || '',
    city: venue?.location?.city || '',
    zip: venue?.location?.zip || '',
    country: venue?.location?.country || '',
  });
  const [amenitiesChecked, setAmenitiesChecked] = useState<Meta>({
    pets: venue?.meta?.pets || false,
    parking: venue?.meta?.parking || false,
    breakfast: venue?.meta?.breakfast || false,
    wifi: venue?.meta?.wifi || false,
  });

  const handleAmenities = (key: keyof Meta) => {
    setAmenitiesChecked((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleRemoveImage = (url: string) => {
    setMedia((prev) => prev.filter((image) => image.url !== url));
  };

  const handleAddImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const isValid = validateImage(imageInput, media.length, setFormStatus);
    if (!isValid) return;

    setMedia((prev) => [...prev, { url: imageInput.trim(), alt: 'venue image' }]);
    setImageInput('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const { name, value } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'description') {
      setTextCount(value.length);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);

    const isValid = runVenueValidations(form, setFormStatus);
    if (!isValid) return;

    try {
      const result = await handleEditSubmit(form, media, venue.id);
      setSuccessMessage('Venue successfully updated!', setFormStatus);

      if (result) {
        setTimeout(() => {
          navigate(`/venues?id=${venue.id}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to edit venue:', error);
      const err = error as Error;
      setSubmitError(err.message, setFormStatus);
    }
  };

  return (
    <motion.div
      variants={fadeOutOnlyVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-[1000px] w-full h-full flex flex-col justify-center font-primary"
    >
      <section className="w-full flex flex-col items-center justify-center">
        <h1 className="headlineOne mt-7 md:mt-16">Edit your Venue</h1>
        <form
          className="max-w-[1000px] w-full h-full flex flex-col justify-center font-primary"
          onSubmit={handleSubmit}
        >
          <div className="mx-5 flex flex-col mb-10 gap-12 md:gap-28">
            <div className="h-full flex flex-col gap-4 mt-10">
              {media.length > 0 && (
                <GalleryComponent
                  media={media}
                  onRemoveImage={handleRemoveImage}
                  isEditable={true}
                />
              )}
            </div>

            {/* Basic info */}
            <section className="flex flex-col gap-4">
              <h2 className="headlineTwo">Basic info</h2>

              <InputField
                id="image"
                name="image"
                labelText="URL - Media"
                type="url"
                value={imageInput}
                placeholder="https://example.com/image.jpg"
                icon={<Plus size={24} />}
                onChange={(e) => setImageInput(e.target.value)}
                onButtonClick={handleAddImage}
              />

              {formStatus.validationErrors?.image && (
                <p className="error-message">{formStatus.validationErrors.image}</p>
              )}
              {formStatus.successMessages?.image && (
                <div className="success-message">{formStatus.successMessages.image}</div>
              )}

              {[
                {
                  id: 'venueName',
                  labelText: 'Name of venue *',
                  placeholder: 'Name of the venue',
                  type: 'text',
                },
                {
                  id: 'description',
                  labelText: 'Description *',
                  placeholder: 'Write a description of the venue',
                  type: 'text',
                  textarea: true,
                  counter: true,
                },
              ].map((item) => (
                <div key={item.id} className="flex flex-col gap-2">
                  <InputField
                    id={item.id}
                    name={item.id}
                    type={item.type}
                    labelText={item.labelText}
                    placeholder={item.placeholder}
                    value={formData[item.id as keyof typeof formData] || ''}
                    onChange={handleChange}
                    textarea={item.textarea}
                  />
                  {formStatus.validationErrors?.[item.id] && (
                    <p className="error-message">{formStatus.validationErrors[item.id]}</p>
                  )}
                  {item.counter && <TextCounter count={textCount} maxCharacters={1000} />}
                </div>
              ))}
            </section>

            {/* Pricing & Guests */}
            <section className="flex flex-col gap-4">
              <h2 className="headlineTwo">Pricing & Guests</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'price', label: 'Price *', placeholder: 'Enter price', type: 'number' },
                  {
                    id: 'maxGuests',
                    label: 'Max Guests *',
                    placeholder: 'Add number of guests',
                    type: 'number',
                  },
                  {
                    id: 'rating',
                    label: 'Rating',
                    placeholder: '1-5',
                    type: 'number',
                    step: 0.5,
                    max: 5,
                  },
                ].map((item) => (
                  <div className="flex flex-col gap-2" key={item.id}>
                    <InputField
                      id={item.id}
                      name={item.id}
                      labelText={item.label}
                      type={item.type}
                      placeholder={item.placeholder}
                      step={item.step}
                      max={item.max}
                      value={formData[item.id as keyof typeof formData]}
                      onChange={handleChange}
                    />
                    {formStatus.validationErrors?.[item.id] && (
                      <p className="error-message">{formStatus.validationErrors[item.id]}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Location */}
            <section className="flex flex-col gap-4">
              <h2 className="headlineTwo">Location</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'address', label: 'Address', placeholder: 'Imaginary street 123' },
                  { id: 'city', label: 'City', placeholder: 'Bergen' },
                  { id: 'zip', label: 'Zip-Code', placeholder: '1010' },
                  { id: 'country', label: 'Country', placeholder: 'Dreamland' },
                ].map((item) => (
                  <div className="flex flex-col gap-2" key={item.id}>
                    <InputField
                      id={item.id}
                      name={item.id}
                      labelText={item.label}
                      type="text"
                      placeholder={item.placeholder}
                      value={formData[item.id as keyof typeof formData]}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities */}
            <section className="flex flex-col gap-4">
              <h2 className="headlineTwo">Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 dark:text-white">
                {[
                  { id: 'pets', label: 'Pets', icon: <PawPrint size={24} /> },
                  { id: 'parking', label: 'Parking', icon: <ParkingSquare size={24} /> },
                  { id: 'breakfast', label: 'Breakfast', icon: <Utensils size={24} /> },
                  { id: 'wifi', label: 'Free Wifi', icon: <Wifi size={24} /> },
                ].map((item) => (
                  <div className="flex w-full p-2 rounded" key={item.id}>
                    <label htmlFor={item.id} className="amenities-label">
                      <input
                        type="checkbox"
                        id={item.id}
                        name={item.id}
                        className="sr-only peer"
                        checked={amenitiesChecked[item.id as keyof typeof amenitiesChecked]}
                        onChange={() => handleAmenities(item.id as keyof typeof amenitiesChecked)}
                      />
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span className="text-base">{item.label}</span>
                      </div>

                      <span className="amenities-checkbox">
                        <Check size={18} className="text-white dark:text-dark" />
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex flex-col items-center justify-center gap-5">
              <button type="submit" className="button transition font-bold">
                Save Changes
              </button>
              {formStatus.success && (
                <div id="createSuccess" className="success-message">
                  {formStatus.success}
                </div>
              )}
              {formStatus.submitError && (
                <div id="createError" className="error-message">
                  {formStatus.submitError}
                </div>
              )}
            </div>
          </div>
        </form>
      </section>
    </motion.div>
  );
};

export default EditPage;
