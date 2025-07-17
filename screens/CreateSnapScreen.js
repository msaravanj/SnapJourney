import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import ImagePicker from "../components/ImagePicker";
import LocationPicker from "../components/LocationPicker";
import { insertSnap } from "../util/database";
import { removeImageUri } from "../store/redux/slices/imageSlice";
import { resetLocation } from "../store/redux/slices/locationSlice";
import { useFocusEffect } from "@react-navigation/native";

const CreateSnapScreen = ({ setCreateSnapVisible, onCreate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const imageUri = useSelector((state) => state.imageUri.value);
  const address = useSelector((state) => state.location.address);
  const latitude = useSelector((state) => state.location.value[0]);
  const longitude = useSelector((state) => state.location.value[1]);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        dispatch(removeImageUri());
        dispatch(resetLocation());
      };
    }, [dispatch])
  );

  return (
    <View style={styles.portal}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="always"
        style={styles.scrollView}
      >
        <View style={styles.container}>
          <Text style={styles.header}>Create new snap</Text>
          <TextInput
            label="Title"
            value={title}
            onChangeText={(text) => setTitle(text)}
            style={styles.title}
          />
          <TextInput
            placeholder="Description"
            value={description}
            mode="outlined"
            multiline={true}
            onChangeText={(description) => setDescription(description)}
            style={styles.description}
          />
          <ImagePicker />
          <LocationPicker />
          <Button
            icon="check"
            mode="contained"
            disabled={false}
            onPress={async () => {
              if (!title || !imageUri || !address) {
                alert("Please fill in all fields and select an image.");
                return;
              }

              const snap = {
                title,
                description,
                imageUri,
                address,
                latitude,
                longitude,
                createdAt: new Date().toISOString(),
              };

              try {
                await insertSnap(snap);
                setTitle("");
                setDescription("");
                dispatch(removeImageUri());
                dispatch(resetLocation());
                setCreateSnapVisible(false);
                onCreate();
              } catch (error) {
                alert("Failed to save snap. Please try again.");
              }
            }}
            style={styles.saveBtn}
          >
            Save
          </Button>
          <Button
            icon="close"
            mode="outlined"
            style={styles.cancelBtn}
            onPress={() => setCreateSnapVisible(false)}
          >
            Cancel
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  portal: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flexGrow: 1,
    width: "100%",
    padding: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    display: "flex",
  },
  title: {
    width: "90%",
    marginTop: 30,
    marginBottom: 8,
  },
  description: {
    width: "90%",
    height: 100,
    marginBottom: 8,
  },
  saveBtn: {
    width: "80%",
    marginTop: 20,
    marginBottom: 10,
  },
  cancelBtn: {
    width: "80%",
    marginBottom: 60,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default CreateSnapScreen;
