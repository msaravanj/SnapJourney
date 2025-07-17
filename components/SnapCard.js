import { Card, Text, IconButton, Button, TextInput } from "react-native-paper";
import { StyleSheet, Pressable, View, Modal } from "react-native";
import { useState } from "react";
import { updateSnap } from "../util/database";

const SnapCard = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [editTitle, setEditTitle] = useState(props.title);
  const [editDescription, setEditDescription] = useState(props.description);
  const [editAddress, setEditAddress] = useState(props.address);

  const handleSave = () => {
    updateSnap({
      title: editTitle,
      description: editDescription,
      address: editAddress,
      imageUri: props.imageUri,
      latitude: props.latitude,
      longitude: props.longitude,
      createdAt: props.createdAt,
    });
    setModalVisible(false);
    if (props.onUpdate) props.onUpdate();
  };

  return (
    <View>
      <Pressable onPress={() => setExpanded((prev) => !prev)}>
        <Card style={styles.card}>
          <Card.Cover style={styles.image} source={{ uri: props.imageUri }} />
          <Card.Content>
            <Text variant="titleLarge">{props.title}</Text>
            <Text variant="bodyMedium">{props.description}</Text>
            {expanded && (
              <View style={styles.extraContent}>
                <Text variant="bodySmall">{props.address}</Text>
                <View style={{ height: 10 }} />
                <Text variant="bodySmall">
                  {new Date(props.createdAt).toLocaleString("hr-HR", {
                    timeZone: "Europe/Zagreb",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </Text>
                <View style={{ height: 10 }} />
                <View style={styles.editBtn}>
                  <IconButton
                    icon="pencil"
                    onPress={() => setModalVisible(true)}
                  />
                </View>
              </View>
            )}
          </Card.Content>
        </Card>
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text variant="titleLarge" style={{ marginBottom: 16 }}>
              Edit Snap
            </Text>
            <TextInput
              label="Title"
              value={editTitle}
              onChangeText={setEditTitle}
              style={{ marginBottom: 10 }}
            />
            <TextInput
              label="Description"
              value={editDescription}
              onChangeText={setEditDescription}
              multiline={true}
              style={{ marginBottom: 10 }}
            />
            <TextInput
              label="Address"
              value={editAddress}
              onChangeText={setEditAddress}
              style={{ marginBottom: 10 }}
            />
            <Button
              mode="contained"
              onPress={handleSave}
              style={{ marginBottom: 10 }}
            >
              Save
            </Button>
            <Button mode="outlined" onPress={() => setModalVisible(false)}>
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    marginBottom: 10,
    borderBottomEndRadius: 0,
    borderBottomLeftRadius: 0,
  },
  card: {
    marginBottom: 5,
    marginTop: 5,
  },
  extraContent: {
    marginTop: 10,
  },
  editBtn: {
    alignItems: "flex-end",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
});

export default SnapCard;
