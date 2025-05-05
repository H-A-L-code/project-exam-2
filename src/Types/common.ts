import { InputHTMLAttributes } from 'react';

export type Media = {
  url: string;
  alt: string;
};

export type BookingData = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guest: number;
  created: string;
  updated: string;
  venue: Venue;
  customer: User;
};

export type ProfileData = {
  name: string;
  email: string;
  bio: string;
  avatar: Media;
  banner: Media;
  venueManager: boolean;
  venues: Venue[];
};

export type Venue = {
  id: string;
  name: string;
  description: string;
  media: Media[];
  location: Location;
  owner: User;
  count: {
    bookings: number;
  };
  price: number;
  rating: number;
  maxGuests: number;
  meta: Meta;
  bookings: BookingData[];
};

export type Booking = {
  id: string;
  dateFrom: string;
  dateTo: string;
  venue: Venue;
};

export type Location = {
  address: string;
  city: string;
  zip: string;
  country: string;
  continent: string;
  lat: number;
  lng: number;
};

export type User = {
  name: string;
  email: string;
  bio: string;
  avatar: Media;
  banner: Media;
};

export type Meta = {
  breakfast: boolean;
  parking: boolean;
  pets: boolean;
  wifi: boolean;
};

export type InputType = {
  id?: string;
  labelText?: string;
  textarea?: boolean;
  icon?: React.ReactNode;
  name?: string;
  onButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & InputHTMLAttributes<HTMLInputElement>;
