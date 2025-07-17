import { View, FlatList, StyleSheet, Text } from "react-native";
import SnapCard from "../components/SnapCard";
import { useState } from "react";
import { fetchSnaps } from "../util/database";
import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Button, IconButton } from "react-native-paper";
import { deleteSnap } from "../util/database";
import CreateSnapScreen from "./CreateSnapScreen";
import MapWithSnaps from "./MapWithSnaps";
import { Portal } from "react-native-paper";

const HomeScreen = ({
  navigation,
  sortOrder = "desc",
  onCreateSnapVisible,
  setCreateSnapVisible,
}) => {
  const [snaps, setSnaps] = useState([]);
  const [mapWithSnapsVisible, setMapWithSnapsVisible] = useState(false);

  const handleDelete = async (createdAt) => {
    await deleteSnap(createdAt);

    const snapsData = await fetchSnaps();
    setSnaps(snapsData);
  };

  const refreshSnaps = async () => {
    const snapsData = await fetchSnaps();
    // Sortiraj prema sortOrder
    const sorted = [...snapsData].sort((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    setSnaps(sorted);
  };

  const renderRightActions = (item) => (
    <View style={styles.deleteBtn}>
      <IconButton
        icon="delete"
        iconColor="red"
        size={32}
        onPress={() => handleDelete(item.createdAt)}
      />
    </View>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <SnapCard
        title={item.title}
        description={item.description}
        imageUri={item.imageUri}
        address={item.address}
        latitude={item.latitude}
        longitude={item.longitude}
        createdAt={item.createdAt}
        onUpdate={refreshSnaps}
      />
    </Swipeable>
  );

  useFocusEffect(
    React.useCallback(() => {
      refreshSnaps();
    }, [sortOrder])
  );

  return (
    <View style={styles.container}>
      {snaps.length > 0 ? (
        <FlatList
          data={snaps}
          renderItem={renderItem}
          keyExtractor={(item) => item.title}
        />
      ) : (
        <Text>No snaps available.</Text>
      )}
      <View style={styles.endOfList} />
      <Button
        icon="map"
        mode="contained"
        disabled={false}
        onPress={() => setMapWithSnapsVisible(true)}
        style={styles.findOnMapBtn}
      >
        Find on map
      </Button>
      {onCreateSnapVisible && (
        <Portal>
          <CreateSnapScreen
            setCreateSnapVisible={setCreateSnapVisible}
            onCreate={refreshSnaps}
          />
        </Portal>
      )}
      {mapWithSnapsVisible && (
        <Portal>
          <MapWithSnaps
            snaps={snaps}
            onSetMapWithSnapsVisible={setMapWithSnapsVisible}
          />
        </Portal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    gap: 8,
    width: "96%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  appBar: {
    width: "100%",
  },
  deleteBtn: {
    justifyContent: "center",
    alignItems: "center",
  },
  portal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  findOnMapBtn: {
    position: "absolute",
    bottom: 50,
    left: "10%",
    width: "80%",
    zIndex: 10,
  },
  endOfList: {
    height: 100,
    width: "100%",
  },
});

export default HomeScreen;
