import { useEffect, useState } from 'react';
import { ReadVenues } from '../API/venues/read';
import { VenueCard } from '../Components/VenueCard';
import { APIVenueData, Venue } from '../Types/common';
import { Search } from '../Components/Search';
import SkeletonLoaderHome from '../Components/loading/SkeletonLoaderHome';
import { motion } from 'framer-motion';
import { fadeOutOnlyVariants } from '../Constants/constants';
import { searchVenues } from '../API/venues/search';
import { Pagination } from '../Components/pagination';
import banner from '/banner.jpg';

/**
 * The HomePage component displays a list of all available venues. It fetches the venue data from an API on
 * component mount and allows users to filter the list using a search functionality. It also handles loading
 * states while data is being fetched.
 *
 * - Fetches venue data using `ReadVenues` and updates the state accordingly.
 * - Displays a search input to filter the venues by name.
 * - Renders a grid of `VenueCard` components for each venue.
 * - Shows a loading component while fetching the venue data.
 * - If no venues match the search query, a message is displayed.
 *
 * @returns {JSX.Element} The rendered homepage with a list of venues and a search bar.
 */

const HomePage = () => {
  const [venueData, setVenueData] = useState<APIVenueData>();
  const [searchData, setSearchData] = useState<APIVenueData>();
  const [searchPage, setSearchPage] = useState<number>(1);
  const [venuePage, setVenuePage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const limit = 12;
  const searchTotalPages = searchData ? Math.ceil(searchData.meta.totalCount / limit) : 0;
  const venueTotalPages = venueData ? Math.ceil(venueData?.meta.totalCount / limit) : 0;
  const searchHasNext = searchPage < searchTotalPages;
  const searchHasPrevious = searchPage > 1;
  const venueHasNext = venuePage < venueTotalPages;
  const venueHasPrevious = venuePage > 1;

  useEffect(() => {
    document.title = 'Holidaze';
  }, []);

  useEffect(() => {
    ReadVenues({
      page: venuePage,
      limit: limit,
      setAPIData: setVenueData,
    });
  }, [venuePage]);

  useEffect(() => {
    searchVenues({
      page: searchPage,
      limit: limit,
      setAPIData: setSearchData,
      text: searchText,
    });
  }, [searchPage, searchText]);

  if (venueData?.data.length === 0) {
    return <SkeletonLoaderHome />;
  }

  return (
    <motion.div
      variants={fadeOutOnlyVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
      className="w-full flex flex-col items-center justify font-primary"
    >
      <div className="max-w-[1440px] w-full h-[400px] lg:h-[600px] overflow-hidden relative">
        <img
          src={banner}
          alt="brown wooden house near green trees and mountain under white clouds and blue sky during daytime"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute text-white bottom-0 pl-5 pb-5 md:pl-10 md:pb-10 lg:pl-20 lg:pb-20 pr-5 flex gap-3 bg-shadow-image w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%)',
          }}
        >
          <div className="self-end flex flex-col gap-1 lg:gap-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-widest">
              Escape Everyday
            </h1>
            <p className="text-sm sm:text-base lg:text-xl italic">
              Find your next cozy gateway to Holidaze
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] w-full">
        <div className="mx-5 2xl:mx-0">
          <Search setSearchText={setSearchText} searchText={searchText} />
          {searchText &&
            searchData &&
            SearchSection({
              searchAllVenues: searchData.data,
              searchHasNext: searchHasNext,
              searchHasPrevious: searchHasPrevious,
              searchPage: searchPage,
              searchText: searchText,
              searchTotalPages: searchTotalPages,
              setSearchPage: setSearchPage,
              setText: setSearchText,
            })}

          <section>
            <h2 className="headlineTwo self-start">All Venues</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-10">
              {venueData &&
                venueData.data.map((venue) => <VenueCard venue={venue} key={venue.id} />)}
            </div>
            <Pagination
              page={venuePage}
              setPage={setVenuePage}
              hasNext={venueHasNext}
              hasPrevious={venueHasPrevious}
              totalPages={venueTotalPages}
            />
          </section>
        </div>
      </div>
    </motion.div>
  );
};

interface searchSectionProps {
  searchAllVenues: Venue[];
  searchText: string;
  searchPage: number;
  setSearchPage: (input: number) => void;
  searchHasNext: boolean;
  searchHasPrevious: boolean;
  searchTotalPages: number;
  setText: (input: string) => void;
}
const SearchSection = ({
  searchAllVenues,
  searchText,
  searchPage,
  setSearchPage,
  searchHasNext,
  searchHasPrevious,
  searchTotalPages,
  setText,
}: searchSectionProps) => (
  <>
    {searchAllVenues.length > 0 ? (
      <section className=" mb-15">
        <div className="flex justify-between items-center headlineTwo self-start flex-wrap">
          <h2>Search: '{searchText}'</h2>
          <button
            onClick={() => setText('')}
            className="text-base transition scale-95 hover:scale-100 cursor-pointer bg-error-red py-2 px-4 rounded-lg dark:text-black"
          >
            Clear Search
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-10">
          {searchAllVenues.map((venue) => (
            <VenueCard venue={venue} key={venue.id} />
          ))}
        </div>
        <Pagination
          page={searchPage}
          setPage={setSearchPage}
          hasNext={searchHasNext}
          hasPrevious={searchHasPrevious}
          totalPages={searchTotalPages}
        />
      </section>
    ) : (
      <section className=" mb-15 dark:text-white">
        <h2 className="font-bold text-base md:text-xl self-start border-b-[1px] border-brand-grey mb-5 py-2">
          Search: '{searchText}'
        </h2>
        <p>No venues found!</p>
      </section>
    )}
  </>
);

export default HomePage;
