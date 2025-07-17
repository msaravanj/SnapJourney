import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { enableScreens } from "react-native-screens";
import {
  IconButton,
  Menu,
  Provider as PaperProvider,
} from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateSnapScreen from "./screens/CreateSnapScreen";
import HomeScreen from "./screens/HomeScreen";
import { Provider } from "react-redux";
import { store } from "./store/redux/store";
import { useEffect, useState } from "react";
import { initDatabase } from "./util/database";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import { StyleSheet } from "react-native";

enableScreens();
const Stack = createNativeStackNavigator();

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [createSnapVisible, setCreateSnapVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    initDatabase()
      .then(() => setDbInitialized(true))
      .catch((error) =>
        console.error("Database initialization failed:", error)
      );
  }, []);

  useEffect(() => {
    if (dbInitialized) {
      SplashScreen.hideAsync();
    }
  }, [dbInitialized]);

  if (!dbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <IconButton icon="loading" size={32} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer>
          <PaperProvider>
            <Stack.Navigator detachInactiveScreens={true}>
              <Stack.Screen
                name="My Journey Snap"
                options={({ navigation }) => ({
                  headerRight: () => (
                    <View style={styles.header}>
                      <IconButton
                        icon="plus"
                        iconColor="green"
                        size={32}
                        onPress={() => {
                          setFilterVisible(false);
                          setCreateSnapVisible(true);
                        }}
                      />
                      <Menu
                        visible={filterVisible}
                        onDismiss={() => setFilterVisible(false)}
                        anchor={
                          <IconButton
                            icon="filter-variant"
                            size={32}
                            onPress={() => setFilterVisible(true)}
                          />
                        }
                      >
                        <Menu.Item
                          onPress={() => {
                            setSortOrder("asc");
                            setFilterVisible(false);
                          }}
                          title="Sort by oldest"
                        />
                        <Menu.Item
                          onPress={() => {
                            setSortOrder("desc");
                            setFilterVisible(false);
                          }}
                          title="Sort by newest"
                        />
                      </Menu>
                    </View>
                  ),
                })}
              >
                {(props) => (
                  <HomeScreen
                    {...props}
                    sortOrder={sortOrder}
                    onCreateSnapVisible={createSnapVisible}
                    setCreateSnapVisible={setCreateSnapVisible}
                  />
                )}
              </Stack.Screen>
            </Stack.Navigator>
          </PaperProvider>
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    marginLeft: 70,
  },
});
