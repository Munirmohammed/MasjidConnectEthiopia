import React, { useEffect, useState } from 'react';
import { StyleSheet, View, useColorScheme, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors } from '../../constants/Colors';
import { mosqueService, Mosque } from '../../services/mosqueService';
import { LocationService } from '../../services/location';
import { useAppStore } from '../../stores/useAppStore';
import { ThemedText } from '../../components/ThemedText';
import { Card } from '../../components/Card';
import { router } from 'expo-router';

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { location, setLocation } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [mosques, setMosques] = useState<Mosque[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
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
        
        // Fetch real data from backend
        const liveMosques = await mosqueService.list();
        setMosques(liveMosques);
      } catch (error) {
        console.warn('Could not fetch nearby mosques:', error);
        // Do not block map rendering on fetch failure
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const initialRegion = {
    latitude: location?.latitude || 9.145, // Ethiopia Center (approx)
    longitude: location?.longitude || 40.4897,
    latitudeDelta: location ? 0.05 : 10, // Zoom in if location known
    longitudeDelta: location ? 0.05 : 10,
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        customMapStyle={colorScheme === 'dark' ? darkMapStyle : []}
      >
        {mosques.map((mosque) => (
          <Marker
            key={mosque.id}
            coordinate={{
              latitude: mosque.latitude,
              longitude: mosque.longitude,
            }}
            pinColor={theme.primary}
          >
            <Callout 
              onPress={() => router.push(`/mosque/${mosque.id}`)}
              tooltip
            >
              <Card style={styles.calloutCard}>
                <ThemedText type="bold" style={styles.calloutTitle}>{mosque.name}</ThemedText>
                <ThemedText type="caption" style={styles.calloutText}>{mosque.city}</ThemedText>
                <View style={styles.linkContainer}>
                  <ThemedText style={[styles.calloutLink, { color: theme.primary }]}>View Details</ThemedText>
                </View>
              </Card>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const darkMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#242f3e" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#746855" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#242f3e" }]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#d59563" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#d59563" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{ "color": "#263c3f" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#17263c" }]
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  calloutCard: {
    minWidth: 180,
    padding: 12,
    marginBottom: 0,
    borderRadius: 12,
  },
  calloutTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  calloutText: {
    fontSize: 12,
    marginBottom: 8,
  },
  linkContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 8,
  },
  calloutLink: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
