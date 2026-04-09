import { sendPasswordResetEmail } from "firebase/auth";
import { useFormik } from "formik";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import * as Yup from "yup";
import { auth } from "../../lib/firebase";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

export default function ForgotPassword() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await sendPasswordResetEmail(auth, values.email);
        Alert.alert(
          "Email Sent",
          `A password reset link has been sent to ${values.email}. Check your inbox.`,
          [{ text: "Back to Sign In", onPress: () => router.replace("/(auth)/sign-in") }]
        );
        resetForm();
      } catch (e: any) {
        const msg =
          e.code === "auth/user-not-found"
            ? "No account found with this email address."
            : e.code === "auth/network-request-failed"
            ? "Network error. Check your connection."
            : e.message;
        Alert.alert("Error", msg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Reset Password</Text>
          <Text style={styles.pageSubtitle}>
            Enter your email and we'll send you a reset link
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            value={formik.values.email}
            onChangeText={formik.handleChange("email")}
            onBlur={formik.handleBlur("email")}
            placeholder="you@example.com"
            placeholderTextColor="#d4cceb"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={[
              styles.input,
              formik.touched.email && formik.errors.email ? styles.inputError : null,
              formik.touched.email && !formik.errors.email ? styles.inputValid : null,
            ]}
          />
          {formik.touched.email && formik.errors.email && (
            <Text style={styles.errorText}>{formik.errors.email}</Text>
          )}
        </View>

        <Pressable
          style={[
            styles.submitButton,
            (!formik.isValid || !formik.dirty || formik.isSubmitting) && styles.submitDisabled,
          ]}
          onPress={() => formik.handleSubmit()}
          disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
        >
          <Text style={styles.submitText}>
            {formik.isSubmitting ? "Sending..." : "Send Reset Link"}
          </Text>
        </Pressable>

        <Pressable onPress={() => router.back()} style={styles.backRow}>
          <Text style={styles.backText}>← Back to Sign In</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#150b27",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: "center",
  },
  pageHeader: { marginBottom: 24 },
  pageTitle: { fontSize: 28, fontWeight: "800", color: "#ffffff", letterSpacing: 0.3 },
  pageSubtitle: { fontSize: 14, color: "#ccc3ff", marginTop: 6 },
  divider: {
    height: 1,
    backgroundColor: "rgba(158, 131, 241, 0.3)",
    marginBottom: 28,
  },
  fieldGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: "600", color: "#ffffff", marginBottom: 7 },
  input: {
    borderWidth: 1,
    borderColor: "#5d4b90",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#ffffff",
    backgroundColor: "#2a1f4e",
  },
  inputError: { borderColor: "#ff93a6", backgroundColor: "#3f2a4a" },
  inputValid: { borderColor: "#5f8aff" },
  errorText: { color: "#ff93a6", fontSize: 12, marginTop: 5 },
  submitButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#8c67ff",
    marginTop: 20,
  },
  submitDisabled: { backgroundColor: "#4b3a7a" },
  submitText: { fontSize: 15, fontWeight: "700", color: "#ffffff" },
  backRow: { alignItems: "center", marginTop: 20 },
  backText: { fontSize: 13, color: "#c3b6ff" },
});
