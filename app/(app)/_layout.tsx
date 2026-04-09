import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#8c67ff",
        tabBarInactiveTintColor: "#d4cceb",
        tabBarStyle: {
          backgroundColor: "#1f1034",
          borderTopColor: "#4c356f",
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        headerStyle: { backgroundColor: "#1f1034" },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "700", fontSize: 17 },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Add Employee",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="submissions"
        options={{
          title: "Submissions",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
