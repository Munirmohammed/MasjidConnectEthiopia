import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, useColorScheme, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors } from '../../constants/Colors';
import { MOSQUES } from '../../constants/Mosques';
import { LocationService } from '../../services/location';
import { useAppStore } from '../../stores/useAppStore';

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { location, setLocation } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const hasPermission = await LocationService.requestPermissions();
      if (hasPermission) {
        const coords = await LocationService.getCurrentLocation();
        if (coords) {
          setLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
        }
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const initialRegion = {
    latitude: location?.latitude || 9.145, // Ethiopia Center (approx)
    longitude: location?.longitude || 40.4897,
    latitudeDelta: 10,
    longitudeDelta: 10,
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {MOSQUES.map((mosque) => (
          <Marker
            key={mosque.id}
            coordinate={{
              latitude: mosque.latitude,
              longitude: mosque.longitude,
            }}
            pinColor={theme.primary}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{mosque.name}</Text>
                <Text style={styles.calloutText}>{mosque.city}</Text>
                <Text style={styles.calloutLink}>View Details</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  callout: {
    padding: 10,
    minWidth: 150,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calloutText: {
    fontSize: 12,
    color: '#666',
  },
  calloutLink: {
    fontSize: 12,
    color: '#065f46',
    marginTop: 4,
    fontWeight: '600',
  },
});
