import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { IconButton } from "react-native-paper";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import SnapPreviewOnMap from "../components/SnapPreviewOnMap";

const MapWithSnaps = ({ snaps, onSetMapWithSnapsVisible }) => {
  const [selectedSnap, setSelectedSnap] = useState(null);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: snaps[0]?.latitude || 45.815,
          longitude: snaps[0]?.longitude || 15.9819,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {snaps.map((snap) => (
          <Marker
            key={snap.createdAt}
            coordinate={{
              latitude: snap.latitude,
              longitude: snap.longitude,
            }}
            onPress={() => setSelectedSnap(snap)}
          >
            <Image
              source={{ uri: snap.imageUri }}
              style={styles.markerImage}
              resizeMode="cover"
            />
          </Marker>
        ))}
      </MapView>
      <TouchableOpacity
        style={styles.exitButton}
        onPress={() => onSetMapWithSnapsVisible(false)}
      >
        <Text style={styles.exitButtonText}>Exit map</Text>
      </TouchableOpacity>
      {selectedSnap && (
        <View style={styles.snapCardContainer}>
          <IconButton
            icon="close"
            size={24}
            mode="contained"
            color="#fff"
            style={styles.closeSnapCardBtn}
            onPress={() => setSelectedSnap(null)}
          />
          <SnapPreviewOnMap
            imageUri={selectedSnap.imageUri}
            title={selectedSnap.title}
            description={selectedSnap.description}
            createdAt={selectedSnap.createdAt}
            address={selectedSnap.address}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  markerImage: {
    width: 35,
    height: 35,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  exitButton: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "#2196f3",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    elevation: 4,
  },
  exitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  snapCardContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    padding: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 8,
    alignItems: "center",
  },
  closeSnapCardBtn: {
    position: "absolute",
    top: 10,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  closeSnapCardText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default MapWithSnaps;
