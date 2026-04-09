import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useFormik } from "formik";
import { useState } from "react";
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
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        // Auth guard in _layout.tsx automatically redirects to (app)
      } catch (e: any) {
        const msg =
          e.code === "auth/invalid-credential" || e.code === "auth/wrong-password"
            ? "Invalid email or password. Please try again."
            : e.code === "auth/user-not-found"
            ? "No account found with this email."
            : e.code === "auth/network-request-failed"
            ? "Network error. Check your connection and try again."
            : e.message;
        Alert.alert("Sign In Failed", msg);
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
          <Text style={styles.pageTitle}>Welcome Back</Text>
          <Text style={styles.pageSubtitle}>Sign in to your account to continue</Text>
        </View>

        <View style={styles.divider} />

        {/* Email */}
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

        {/* Password */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              value={formik.values.password}
              onChangeText={formik.handleChange("password")}
              onBlur={formik.handleBlur("password")}
              placeholder="Minimum 8 characters"
              placeholderTextColor="#d4cceb"
              secureTextEntry={!showPassword}
              style={[
                styles.input,
                styles.passwordInput,
                formik.touched.password && formik.errors.password ? styles.inputError : null,
                formik.touched.password && !formik.errors.password ? styles.inputValid : null,
              ]}
            />
            <Pressable
              onPress={() => setShowPassword((p) => !p)}
              style={styles.toggleIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#9e9890"
              />
            </Pressable>
          </View>
          {formik.touched.password && formik.errors.password && (
            <Text style={styles.errorText}>{formik.errors.password}</Text>
          )}
        </View>

        {/* Forgot password link */}
        <Pressable
          onPress={() => router.push("/(auth)/forgot-password")}
          style={styles.forgotRow}
        >
          <Text style={styles.forgotText}>Forgot your password?</Text>
        </Pressable>

        <Pressable
          style={[
            styles.submitButton,
            (!formik.isValid || !formik.dirty || formik.isSubmitting) &&
              styles.submitDisabled,
          ]}
          onPress={() => formik.handleSubmit()}
          disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
        >
          <Text style={styles.submitText}>
            {formik.isSubmitting ? "Signing in..." : "Sign In"}
          </Text>
        </Pressable>

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Don't have an account? </Text>
          <Pressable onPress={() => router.push("/(auth)/sign-up")}>
            <Text style={styles.switchLink}>Sign Up</Text>
          </Pressable>
        </View>
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
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.3,
  },
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
  passwordWrapper: { position: "relative" },
  passwordInput: { paddingRight: 46 },
  toggleIcon: {
    position: "absolute",
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  inputError: { borderColor: "#ff93a6", backgroundColor: "#3f2a4a" },
  inputValid: { borderColor: "#5f8aff" },
  errorText: { color: "#ff93a6", fontSize: 12, marginTop: 5 },
  forgotRow: { alignItems: "flex-end", marginBottom: 8 },
  forgotText: { fontSize: 13, color: "#c3b6ff" },
  submitButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#8c67ff",
    marginTop: 20,
  },
  submitDisabled: { backgroundColor: "#4b3a7a" },
  submitText: { fontSize: 15, fontWeight: "700", color: "#ffffff" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  switchText: { fontSize: 13, color: "#ccc3ff" },
  switchLink: { fontSize: 13, color: "#8c67ff", fontWeight: "700" },
});
