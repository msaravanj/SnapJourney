import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function TestScreen() {
  const [count, setCount] = useState(0);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => {
          console.log("pressed");
          setCount(count + 1);
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>Save ({count})</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  saveBtn: { backgroundColor: "#2196f3", padding: 20, borderRadius: 8 },
});
