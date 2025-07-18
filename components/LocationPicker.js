import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useSelector, useDispatch } from "react-redux";
import {
  updateLocation,
  updateLocationName,
} from "../store/redux/slices/locationSlice";
import MapboxAutocomplete from "./MapboxAutocomplete";

const LocationPicker = () => {
  const location = useSelector((state) => state.location.value);
  const address = useSelector((state) => state.location.address);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [addressLoading, setAddressLoading] = useState(false);

  const MAPBOX_TOKEN =
    "pk.eyJ1IjoibXNhcmF2YW5qIiwiYSI6ImNtYnRvb291YjA0c3AybHIzM2dwbnQzdTUifQ.Nth17Opy9i0tNdJSXxdtRQ";

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Error", "You have not given permission to location.");
        setLoading(false);
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = userLocation.coords;

      dispatch(updateLocation([latitude, longitude]));

      // reverse geocoding: dohvat adrese
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}`
        );
        const data = await res.json();
        const addressText = data.features[0]?.place_name || "Unknown address";
        dispatch(updateLocationName(addressText));
      } catch (e) {
        console.error("Error fetching address:", e);
        dispatch(updateLocationName("Unknown address"));
      }

      setLoading(false);
    })();
  }, []);

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    dispatch(updateLocation([latitude, longitude]));
    setAddressLoading(true);

    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await res.json();
      const address = data.features[0]?.place_name || "Unknown address";
      dispatch(updateLocationName(address));
    } catch (e) {
      dispatch(updateLocationName("Error fetching address"));
    } finally {
      setAddressLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapboxAutocomplete address={address} />
      <MapView
        style={styles.map}
        region={{
          latitude: location[0],
          longitude: location[1],
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
        showsUserLocation={true}
      >
        {location && (
          <Marker
            coordinate={{ latitude: location[0], longitude: location[1] }}
            draggable
          />
        )}
      </MapView>

      <View style={styles.info}>
        <Text style={styles.text}>
          {addressLoading ? "Loading..." : address}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", alignItems: "center" },
  map: { width: "95%", height: 250, borderRadius: 12 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  info: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
});

export default LocationPicker;
