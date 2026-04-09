import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#1f1034" },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "700", fontSize: 17 },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "#150b27" },
      }}
    />
  );
}
