import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";

type Submission = {
  id: string;
  fullName: string;
  phoneNumber: string;
  employeeId: string;
  department: string;
  salary: number;
  dob: string;
  startDate: string;
  employmentType: string;
  createdAt: any;
};

export default function Submissions() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit modal state
  const [editTarget, setEditTarget] = useState<Submission | null>(null);
  const [editDepartment, setEditDepartment] = useState("");
  const [editSalary, setEditSalary] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    setError(null);
    const q = query(
      collection(db, "submissions"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Submission));
        setSubmissions(data);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Failed to load submissions. Check your connection.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  // ── DELETE ──────────────────────────────────────────────────────────────────
  const handleDelete = (item: Submission) => {
    Alert.alert(
      "Delete Record",
      `Are you sure you want to delete the record for ${item.fullName}? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "submissions", item.id));
            } catch {
              Alert.alert("Error", "Could not delete this record. Try again.");
            }
          },
        },
      ]
    );
  };

  // ── EDIT ─────────────────────────────────────────────────────────────────────
  const openEdit = (item: Submission) => {
    setEditTarget(item);
    setEditDepartment(item.department);
    setEditSalary(String(item.salary));
  };

  const handleSaveEdit = async () => {
    if (!editTarget) return;
    const salaryNum = Number(editSalary);
    if (!editDepartment.trim() || editDepartment.trim().length < 2) {
      Alert.alert("Validation", "Department must be at least 2 characters.");
      return;
    }
    if (isNaN(salaryNum) || salaryNum < 15000 || salaryNum > 500000) {
      Alert.alert("Validation", "Salary must be between $15,000 and $500,000.");
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, "submissions", editTarget.id), {
        department: editDepartment.trim(),
        salary: salaryNum,
      });
      setEditTarget(null);
    } catch {
      Alert.alert("Error", "Could not update the record. Try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── RENDER ───────────────────────────────────────────────────────────────────
  const renderItem = ({ item }: { item: Submission }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {item.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </Text>
        </View>
        <View style={styles.cardTitle}>
          <Text style={styles.cardName}>{item.fullName}</Text>
          <Text style={styles.cardId}>{item.employeeId}</Text>
        </View>
        <View style={styles.cardActions}>
          <Pressable onPress={() => openEdit(item)} style={styles.iconBtn} hitSlop={8}>
            <Ionicons name="pencil-outline" size={18} color="#8c67ff" />
          </Pressable>
          <Pressable onPress={() => handleDelete(item)} style={styles.iconBtn} hitSlop={8}>
            <Ionicons name="trash-outline" size={18} color="#e07a91" />
          </Pressable>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Row icon="business-outline" label="Department" value={item.department} />
        <Row
          icon="cash-outline"
          label="Salary"
          value={`$${Number(item.salary).toLocaleString()} CAD`}
        />
        <Row icon="briefcase-outline" label="Type" value={capitalize(item.employmentType)} />
        <Row
          icon="calendar-outline"
          label="Start Date"
          value={new Date(item.startDate).toDateString()}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8c67ff" />
        <Text style={styles.loadingText}>Loading submissions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="cloud-offline-outline" size={48} color="#e07a91" />
        <Text style={styles.errorTitle}>Connection Error</Text>
        <Text style={styles.errorMsg}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#150b27" }}>
      {submissions.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="people-outline" size={56} color="#5d4b90" />
          <Text style={styles.emptyTitle}>No submissions yet</Text>
          <Text style={styles.emptyMsg}>
            Use the Add Employee tab to save your first record.
          </Text>
        </View>
      ) : (
        <FlatList
          data={submissions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Edit Modal */}
      <Modal visible={!!editTarget} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Record</Text>
            <Text style={styles.modalSubtitle}>{editTarget?.fullName}</Text>

            <Text style={styles.label}>Department</Text>
            <TextInput
              value={editDepartment}
              onChangeText={setEditDepartment}
              style={styles.modalInput}
              placeholderTextColor="#d4cceb"
              autoCapitalize="words"
            />

            <Text style={styles.label}>Annual Salary (CAD)</Text>
            <TextInput
              value={editSalary}
              onChangeText={setEditSalary}
              keyboardType="numeric"
              style={styles.modalInput}
              placeholderTextColor="#d4cceb"
            />

            <View style={styles.modalBtns}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setEditTarget(null)}
                disabled={saving}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                onPress={handleSaveEdit}
                disabled={saving}
              >
                <Text style={styles.saveText}>{saving ? "Saving..." : "Save Changes"}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={14} color="#9a8fcf" style={{ marginTop: 1 }} />
      <Text style={styles.rowLabel}>{label}:</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace("-", " ");
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: "#150b27",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 12,
  },
  loadingText: { color: "#ccc3ff", fontSize: 14, marginTop: 8 },
  errorTitle: { fontSize: 18, fontWeight: "700", color: "#e07a91", marginTop: 8 },
  errorMsg: { fontSize: 14, color: "#ccc3ff", textAlign: "center" },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#ffffff", marginTop: 8 },
  emptyMsg: { fontSize: 14, color: "#ccc3ff", textAlign: "center", marginTop: 4 },
  list: { padding: 16, gap: 14 },
  card: {
    backgroundColor: "rgba(60, 30, 90, 0.45)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#4c356f",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#8c67ff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  cardTitle: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: "700", color: "#ffffff" },
  cardId: { fontSize: 12, color: "#c9bfff", marginTop: 2 },
  cardActions: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardBody: { gap: 8 },
  row: { flexDirection: "row", alignItems: "flex-start", gap: 6 },
  rowLabel: { fontSize: 13, color: "#9a8fcf", width: 80 },
  rowValue: { fontSize: 13, color: "#e9e4ff", flex: 1 },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#1f1034",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    gap: 8,
  },
  modalTitle: { fontSize: 20, fontWeight: "800", color: "#ffffff" },
  modalSubtitle: { fontSize: 13, color: "#ccc3ff", marginBottom: 8 },
  label: { fontSize: 13, fontWeight: "600", color: "#ffffff", marginTop: 8 },
  modalInput: {
    borderWidth: 1,
    borderColor: "#5d4b90",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#ffffff",
    backgroundColor: "#2a1f4e",
    marginTop: 4,
  },
  modalBtns: { flexDirection: "row", gap: 10, marginTop: 20 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#8267da",
    alignItems: "center",
    backgroundColor: "#260f42",
  },
  cancelText: { fontSize: 15, fontWeight: "600", color: "#c3b6ff" },
  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#8c67ff",
  },
  saveBtnDisabled: { backgroundColor: "#4b3a7a" },
  saveText: { fontSize: 15, fontWeight: "700", color: "#ffffff" },
});
