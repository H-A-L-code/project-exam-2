import { HandleCreateVenue } from '../../API/venues/create';
import { Media, Venue } from '../../Types/common';

const buildVenueCreatePayload = (formdata: FormData, media: Media[]): Venue => ({
  media,
  name: formdata.get('name')?.toString() || '',
  description: formdata.get('description')?.toString() || '',

  price: Number(formdata.get('price')),
  maxGuests: Number(formdata.get('maxGuests')),
  rating: Number(formdata.get('rating')),

  location: {
    address: formdata.get('address')?.toString() || '',
    city: formdata.get('city')?.toString() || '',
    zip: formdata.get('zip-code')?.toString() || '',
    country: formdata.get('country')?.toString() || '',
  },

  meta: {
    wifi: !!formdata.get('wifi'),
    parking: !!formdata.get('parking'),
    breakfast: !!formdata.get('breakfast'),
    pets: !!formdata.get('pets'),
  },
});

export const handleCreateVenueSubmit = (formdata: FormData, media: Media[]) => {
  const payload = buildVenueCreatePayload(formdata, media);

  console.log('📦 Venue form data:', payload);

  try {
    HandleCreateVenue(payload);
  } catch (error) {
    console.error('Venue creation failed:', error);
  }
};
