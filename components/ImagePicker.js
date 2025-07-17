import { Alert, Image, StyleSheet, Text, View } from "react-native";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { updateImageUri } from "../store/redux/slices/imageSlice";

const ImagePicker = () => {
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();
  const imageUri = useSelector((state) => state.imageUri.value);
  const dispatch = useDispatch();

  async function verifyPermissions() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant camera permissions to use this app."
      );
      return false;
    }

    return true;
  }

  async function takeImageHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    dispatch(updateImageUri(image.assets[0].uri));
  }

  async function pickImageHandler() {
    const image = await launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!image.canceled && image.assets?.[0]?.uri) {
      dispatch(updateImageUri(image.assets[0].uri));
    }
  }

  let imagePreview = <Text>No image taken yet.</Text>;

  if (imageUri) {
    imagePreview = <Image style={styles.image} source={{ uri: imageUri }} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <Button
        icon="camera"
        mode="outlined"
        style={styles.button}
        onPress={takeImageHandler}
      >
        Take image
      </Button>
      <Button
        icon="image"
        mode="outlined"
        style={styles.button}
        onPress={pickImageHandler}
      >
        Choose from gallery
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignItems: "center",
    marginBottom: 24,
  },
  imagePreview: {
    width: "100%",
    height: 300,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
    borderRadius: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  button: {
    width: "100%",
  },
});

export default ImagePicker;
