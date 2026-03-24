import * as Location from 'expo-location';

export const LocationService = {
  requestPermissions: async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  },

  getCurrentLocation: async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      return location.coords;
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  },

  reverseGeocode: async (latitude: number, longitude: number) => {
    try {
      const result = await Location.reverseGeocodeAsync({ latitude, longitude });
      return result[0];
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      return null;
    }
  },
};
