'use client';

import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';

// Define the geographical bounds for New York City
const NYC_BOUNDS = {
  north: 40.917577,
  south: 40.477399,
  east: -73.700272,
  west: -74.25909,
};

// Define the props our component will accept
interface AddressAutocompleteInputProps {
  onAddressSelect: (address: string) => void;
  initialValue?: string;
}

export function AddressAutocompleteInput({ onAddressSelect, initialValue = '' }: AddressAutocompleteInputProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  });

  // 2. Refs and state to manage the Autocomplete instance and input value
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(initialValue);

  // 3. This function is called when the Autocomplete instance is loaded
  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocompleteInstance;
  };

  // 4. This function is called when the user selects a place from the dropdown
  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      const formattedAddress = place.formatted_address || '';
      setInputValue(formattedAddress);
      onAddressSelect(formattedAddress); // Pass the validated address back to the parent
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  // Render a disabled input while the script is loading
  if (!isLoaded) {
    return <Input placeholder="Loading address..." disabled />;
  }

  // Render the Autocomplete component
  return (
    <Autocomplete
      onLoad={onLoad}
      onPlaceChanged={onPlaceChanged}
      options={{
        bounds: NYC_BOUNDS,      // Bias search results to within these bounds
        strictBounds: true,      // STRICTLY restrict results to within these bounds
        componentRestrictions: { country: 'us' }, // Restrict to the United States
        types: ['address'],      // Only show results that are precise addresses
      }}
    >
      <Input
        type="text"
        placeholder="Enter a New York City address"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        required
      />
    </Autocomplete>
  );
}