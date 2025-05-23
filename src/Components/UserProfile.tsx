import React, { useEffect, useState } from 'react';
import { APIBookingData, APIVenueData, Profile } from '../Types/common';
import { VenueCard } from './VenueCard';
import { EditProfile } from './EditProfile';
import { Link } from 'react-router-dom';
import { BookingCard } from './BookingCard';
import { storedName, storedVenueManager } from '../Constants/constants';
import { BadgeCheck, UserRoundPen } from 'lucide-react';
import { readUserBookings } from '../API/booking/userBooking';
import { Pagination } from './pagination';
import { ReadUserVenues } from '../API/venues/read';

interface BuildUserProps {
  profile: Profile;
}

/**
 * The BuildUser component displays the user's profile information, including the profile picture, banner,
 * bio, venues, and bookings. It allows the user to edit their profile if it is their own account.
 *
 * @param {Object} props - The component's props.
 * @param {Profile} props.profile - The profile data to be displayed.
 *
 * @returns {JSX.Element} The rendered profile page with user details, venues, and bookings.
 */

export const BuildUser: React.FC<BuildUserProps> = ({ profile }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [bookingPage, setBookingPage] = useState<number>(1);
  const [venuePage, setVenuePage] = useState<number>(1);
  const [venueData, setVenueData] = useState<APIVenueData>();
  const [bookingData, setBookingData] = useState<APIBookingData>();

  const limit = 8;
  const bookingTotalPages = bookingData ? Math.ceil(bookingData?.meta.totalCount / limit) : 0;
  const venueTotalPages = venueData ? Math.ceil(venueData?.meta.totalCount / limit) : 0;
  const bookingHasNext = bookingPage < bookingTotalPages;
  const bookingHasPrevious = bookingPage > 1;
  const venueHasNext = venuePage < venueTotalPages;
  const venueHasPrevious = venuePage > 1;

  useEffect(() => {
    readUserBookings({
      page: bookingPage,
      limit: limit,
      setAPIData: setBookingData,
    });
  }, [bookingPage]);

  useEffect(() => {
    ReadUserVenues({
      page: venuePage,
      limit: limit,
      setAPIData: setVenueData,
      name: profile.name,
    });
  }, [venuePage, profile.name]);

  return (
    <div className="w-full flex flex-col items-center gap-14 md:gap-20 lg:gap-24 font-primary">
      <div className="max-w-[1440px] w-full flex flex-col items-center md:items-start">
        <img
          src={profile.banner.url}
          className="skeleton-banner bg-[#C4C4C4] w-full h-[250px] md:h-[360px] object-cover"
          alt={profile.banner.alt}
        />
        <div className="flex flex-col md:flex-row items-center w-full gap-5 md:gap-0">
          <img
            src={profile.avatar.url}
            alt={profile.avatar.alt}
            className="skeleton-avatar flex items-center object-cover justify-center overflow-hidden rounded-full w-full h-[136px] max-w-[136px] md:h-[170px] md:max-w-[170px] lg:h-[236px] lg:max-w-[236px] mt-[-68px] md:mt-[-85px] lg:mt-[-125px] md:ml-[50px] lg:ml-[75px]"
          />
          <div className="skeleton-bio flex flex-col justify-center w-full">
            <div className="flex flex-col gap-4 justify-center mx-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-5">
                  <h1 className="text-lg md:text-2xl rounded dark:text-white">{profile.name}</h1>
                  {storedVenueManager ? (
                    <BadgeCheck className="dark:text-white fill-green-400 dark:fill-green-700" />
                  ) : null}
                </div>
                {profile.name === storedName && (
                  <div
                    onClick={() => setShowUpdateModal(true)}
                    className="edit-container items-center flex gap-2.5 cursor-pointer"
                  >
                    <p className="dark:text-white">Edit User</p>
                    <UserRoundPen className="text-lg md:text-2xl dark:text-white" />
                  </div>
                )}
                <EditProfile
                  isOpen={showUpdateModal}
                  onClose={() => setShowUpdateModal(false)}
                  profile={profile}
                />
              </div>
              <p className="text-base md:text-lg rounded text-gray-500 dark:text-gray-300 italic">
                {profile.bio ? profile.bio : 'This user has no bio yet'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center items-center max-w-[1440px] flex-col gap-10 px-5 2xl:px-0">
        {storedVenueManager === true && (
          <section id="UserVenues" className="w-full">
            <h2 className="headlineTwo self-start ">
              {profile.name == storedName ? 'Your venues' : 'Venues By User'}{' '}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-10 w-full">
              {venueData && venueData.data?.length > 0 ? (
                venueData.data.map((venue) => <VenueCard key={venue.id} venue={venue} />)
              ) : (
                <p className="text-gray-500 italic">Oops! No information here yet!</p>
              )}
            </div>{' '}
            {venueTotalPages > 1 && (
              <Pagination
                page={venuePage}
                setPage={setVenuePage}
                hasNext={venueHasNext}
                hasPrevious={venueHasPrevious}
                totalPages={venueTotalPages}
              />
            )}
          </section>
        )}
        <section
          id="Bookings"
          className={`w-full ${profile.name === storedName ? 'grid' : 'hidden'}`}
        >
          <h2
            className={`headlineTwo self-start ${profile.name === storedName ? 'grid' : 'hidden'}`}
          >
            Your Bookings
          </h2>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-10 w-full ${profile.name === storedName ? 'grid' : 'hidden'}`}
          >
            {bookingData && bookingData?.data.length > 0 ? (
              bookingData.data.map((booking) => (
                <BookingCard oldBooking={false} key={booking.id} booking={booking} />
              ))
            ) : (
              <p className="text-gray-500 italic">Oops! No information here yet!</p>
            )}
          </div>
          {bookingTotalPages > 1 && (
            <Pagination
              page={bookingPage}
              setPage={setBookingPage}
              hasNext={bookingHasNext}
              hasPrevious={bookingHasPrevious}
              totalPages={bookingTotalPages}
            />
          )}
        </section>
        {profile.bookings.length > 0 && (
          <section id="PrevBookings" className="w-full">
            <h2
              className={`headlineTwo self-start ${profile.name === storedName ? 'grid' : 'hidden'}`}
            >
              Your Previous Bookings
            </h2>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-10 w-full ${profile.name === storedName ? 'grid' : 'hidden'}`}
            >
              {[...profile.bookings]
                .filter((booking) => new Date(booking.dateTo) < new Date()) // Only past bookings
                .sort((a, b) => new Date(b.dateFrom).getTime() - new Date(a.dateFrom).getTime()) // Sort newest first
                .map((booking) => (
                  <BookingCard oldBooking={true} key={booking.id} booking={booking} />
                ))}
            </div>
          </section>
        )}
        {!(profile.venues.length || profile.bookings.length) && (
          <Link to="/" className="button text-center mt-10">
            Back To Homepage
          </Link>
        )}
      </div>
    </div>
  );
};
