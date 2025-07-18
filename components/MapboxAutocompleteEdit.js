import { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { TextInput } from "react-native-paper";
import { MAPBOX_TOKEN } from "@env";

const MapboxAutocomplete = (props) => {
  const [value, setValue] = useState(props.address || "");
  const [suggestions, setSuggestions] = useState([]);

  const TOKEN = MAPBOX_TOKEN;

  const handleChange = async (text) => {
    setValue(text);
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        text
      )}.json?access_token=${TOKEN}&autocomplete=true&limit=5`
    );
    const data = await res.json();
    setSuggestions(data.features || []);
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Address"
        placeholder="Search for a place"
        value={value}
        onChangeText={handleChange}
      />
      <View style={styles.suggestionsContainer}>
        {suggestions.slice(0, 4).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.suggestion}
            onPress={() => {
              props.onSetAddress(item.place_name);
              setValue(item.place_name);
              const [long, lat] = item.center;
              props.onSetLocation([lat, long]);
              setTimeout(() => setSuggestions([]), 300);
            }}
          >
            <Text>{item.place_name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    marginBottom: 10,
    backgroundColor: "#fff",
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 2,
  },
  suggestionsContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    zIndex: 9999,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    zIndex: 99999,
  },
});

export default MapboxAutocomplete;
