import { Ionicons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { auth } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            // Auth guard redirects to sign-in automatically
          } catch {
            Alert.alert("Error", "Could not sign out. Try again.");
          }
        },
      },
    ]);
  };

  const displayName = user?.displayName || "User";
  const email = user?.email || "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      <Text style={styles.displayName}>{displayName}</Text>
      <Text style={styles.email}>{email}</Text>

      <View style={styles.divider} />

      {/* Info rows */}
      <View style={styles.infoBox}>
        <InfoRow icon="mail-outline" label="Email" value={email} />
        <InfoRow
          icon="shield-checkmark-outline"
          label="Account Status"
          value={user?.emailVerified ? "Verified" : "Unverified"}
          valueColor={user?.emailVerified ? "#4caf88" : "#e6a817"}
        />
        <InfoRow
          icon="time-outline"
          label="Member Since"
          value={
            user?.metadata?.creationTime
              ? new Date(user.metadata.creationTime).toDateString()
              : "—"
          }
        />
      </View>

      {/* Sign Out */}
      <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={18} color="#e07a91" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  valueColor = "#e9e4ff",
}: {
  icon: any;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={16} color="#9a8fcf" />
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, { color: valueColor }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#150b27",
    alignItems: "center",
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#8c67ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: { fontSize: 30, fontWeight: "800", color: "#fff" },
  displayName: { fontSize: 22, fontWeight: "700", color: "#ffffff" },
  email: { fontSize: 14, color: "#ccc3ff", marginTop: 4 },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(158, 131, 241, 0.3)",
    marginVertical: 28,
  },
  infoBox: {
    width: "100%",
    backgroundColor: "rgba(60, 30, 90, 0.4)",
    borderRadius: 16,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: "#4c356f",
  },
  infoRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 12, color: "#9a8fcf", marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: "600" },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 32,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e07a91",
    backgroundColor: "rgba(224, 122, 145, 0.08)",
  },
  signOutText: { fontSize: 15, fontWeight: "700", color: "#e07a91" },
});
