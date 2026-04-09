import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";

function RootGuard() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // Not signed in — send to sign-in
      router.replace("/(auth)/sign-in");
    } else if (user && inAuthGroup) {
      // Already signed in — send to app
      router.replace("/(app)/");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#150b27" }}
      >
        <ActivityIndicator size="large" color="#8c67ff" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootGuard />
    </AuthProvider>
  );
}
