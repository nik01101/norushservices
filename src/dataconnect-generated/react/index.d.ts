
import { CreateMovieData, CreateMovieVariables, UpsertUserData, UpsertUserVariables, AddReviewData, AddReviewVariables, DeleteReviewData, DeleteReviewVariables, ListMoviesData, ListUsersData, ListUserReviewsData, GetMovieByIdData, GetMovieByIdVariables, SearchMovieData, SearchMovieVariables, CreateBookingData, CreateBookingVariables, UpdateBookingStatusData, UpdateBookingStatusVariables, UpdateAvailabilityData, UpdateAvailabilityVariables, GetServicesData, GetServiceByIdData, GetServiceByIdVariables, GetAvailabilityData, GetBookingsData, GetBookingsVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateMovie(options?: useDataConnectMutationOptions<CreateMovieData, FirebaseError, CreateMovieVariables>): UseDataConnectMutationResult<CreateMovieData, CreateMovieVariables>;
export function useCreateMovie(dc: DataConnect, options?: useDataConnectMutationOptions<CreateMovieData, FirebaseError, CreateMovieVariables>): UseDataConnectMutationResult<CreateMovieData, CreateMovieVariables>;

export function useUpsertUser(options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;
export function useUpsertUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;

export function useAddReview(options?: useDataConnectMutationOptions<AddReviewData, FirebaseError, AddReviewVariables>): UseDataConnectMutationResult<AddReviewData, AddReviewVariables>;
export function useAddReview(dc: DataConnect, options?: useDataConnectMutationOptions<AddReviewData, FirebaseError, AddReviewVariables>): UseDataConnectMutationResult<AddReviewData, AddReviewVariables>;

export function useDeleteReview(options?: useDataConnectMutationOptions<DeleteReviewData, FirebaseError, DeleteReviewVariables>): UseDataConnectMutationResult<DeleteReviewData, DeleteReviewVariables>;
export function useDeleteReview(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteReviewData, FirebaseError, DeleteReviewVariables>): UseDataConnectMutationResult<DeleteReviewData, DeleteReviewVariables>;

export function useCreateBooking(options?: useDataConnectMutationOptions<CreateBookingData, FirebaseError, CreateBookingVariables>): UseDataConnectMutationResult<CreateBookingData, CreateBookingVariables>;
export function useCreateBooking(dc: DataConnect, options?: useDataConnectMutationOptions<CreateBookingData, FirebaseError, CreateBookingVariables>): UseDataConnectMutationResult<CreateBookingData, CreateBookingVariables>;

export function useUpdateBookingStatus(options?: useDataConnectMutationOptions<UpdateBookingStatusData, FirebaseError, UpdateBookingStatusVariables>): UseDataConnectMutationResult<UpdateBookingStatusData, UpdateBookingStatusVariables>;
export function useUpdateBookingStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateBookingStatusData, FirebaseError, UpdateBookingStatusVariables>): UseDataConnectMutationResult<UpdateBookingStatusData, UpdateBookingStatusVariables>;

export function useUpdateAvailability(options?: useDataConnectMutationOptions<UpdateAvailabilityData, FirebaseError, UpdateAvailabilityVariables>): UseDataConnectMutationResult<UpdateAvailabilityData, UpdateAvailabilityVariables>;
export function useUpdateAvailability(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateAvailabilityData, FirebaseError, UpdateAvailabilityVariables>): UseDataConnectMutationResult<UpdateAvailabilityData, UpdateAvailabilityVariables>;


export function useListMovies(options?: useDataConnectQueryOptions<ListMoviesData>): UseDataConnectQueryResult<ListMoviesData, undefined>;
export function useListMovies(dc: DataConnect, options?: useDataConnectQueryOptions<ListMoviesData>): UseDataConnectQueryResult<ListMoviesData, undefined>;

export function useListUsers(options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;
export function useListUsers(dc: DataConnect, options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, undefined>;

export function useListUserReviews(options?: useDataConnectQueryOptions<ListUserReviewsData>): UseDataConnectQueryResult<ListUserReviewsData, undefined>;
export function useListUserReviews(dc: DataConnect, options?: useDataConnectQueryOptions<ListUserReviewsData>): UseDataConnectQueryResult<ListUserReviewsData, undefined>;

export function useGetMovieById(vars: GetMovieByIdVariables, options?: useDataConnectQueryOptions<GetMovieByIdData>): UseDataConnectQueryResult<GetMovieByIdData, GetMovieByIdVariables>;
export function useGetMovieById(dc: DataConnect, vars: GetMovieByIdVariables, options?: useDataConnectQueryOptions<GetMovieByIdData>): UseDataConnectQueryResult<GetMovieByIdData, GetMovieByIdVariables>;

export function useSearchMovie(vars?: SearchMovieVariables, options?: useDataConnectQueryOptions<SearchMovieData>): UseDataConnectQueryResult<SearchMovieData, SearchMovieVariables>;
export function useSearchMovie(dc: DataConnect, vars?: SearchMovieVariables, options?: useDataConnectQueryOptions<SearchMovieData>): UseDataConnectQueryResult<SearchMovieData, SearchMovieVariables>;

export function useServices(options?: useDataConnectQueryOptions<GetServicesData>): UseDataConnectQueryResult<GetServicesData, undefined>;
export function useServices(dc: DataConnect, options?: useDataConnectQueryOptions<GetServicesData>): UseDataConnectQueryResult<GetServicesData, undefined>;

export function useServiceById(vars: GetServiceByIdVariables, options?: useDataConnectQueryOptions<GetServiceByIdData>): UseDataConnectQueryResult<GetServiceByIdData, GetServiceByIdVariables>;
export function useServiceById(dc: DataConnect, vars: GetServiceByIdVariables, options?: useDataConnectQueryOptions<GetServiceByIdData>): UseDataConnectQueryResult<GetServiceByIdData, GetServiceByIdVariables>;

export function useAvailability(options?: useDataConnectQueryOptions<GetAvailabilityData>): UseDataConnectQueryResult<GetAvailabilityData, undefined>;
export function useAvailability(dc: DataConnect, options?: useDataConnectQueryOptions<GetAvailabilityData>): UseDataConnectQueryResult<GetAvailabilityData, undefined>;

export function useBookings(options?: useDataConnectQueryOptions<GetBookingsData, GetBookingsVariables>): UseDataConnectQueryResult<GetBookingsData, GetBookingsVariables>;
export function useBookings(dc: DataConnect, options?: useDataConnectQueryOptions<GetBookingsData, GetBookingsVariables>): UseDataConnectQueryResult<GetBookingsData, GetBookingsVariables>;
