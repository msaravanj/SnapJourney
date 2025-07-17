import { Card, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";

const SnapPreviewOnMap = (props) => {
  return (
    <Card style={styles.card}>
      <Card.Cover style={styles.image} source={{ uri: props.imageUri }} />
      <Card.Content>
        <Text variant="titleLarge">{props.title}</Text>
        <Text variant="bodyMedium">{props.description}</Text>

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
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    marginBottom: 10,
    borderBottomEndRadius: 16,
    borderBottomLeftRadius: 16,
  },
  card: {
    marginBottom: 5,
    marginTop: 0,
    paddingBottom: 40,
    width: "100%",
  },
  extraContent: {
    marginTop: 10,
  },
});

export default SnapPreviewOnMap;
