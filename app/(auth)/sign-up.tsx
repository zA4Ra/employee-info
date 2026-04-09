import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
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
  fullName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .matches(/^[a-zA-Z\s'-]+$/, "Name can only contain letters and spaces")
    .required("Full name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

type FieldKey = "fullName" | "email" | "password" | "confirmPassword";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: { fullName: "", email: "", password: "", confirmPassword: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const credential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        // Save display name to Firebase profile
        await updateProfile(credential.user, { displayName: values.fullName });
        // Auth guard redirects automatically
      } catch (e: any) {
        const msg =
          e.code === "auth/email-already-in-use"
            ? "An account with this email already exists."
            : e.code === "auth/weak-password"
            ? "Password is too weak. Please choose a stronger one."
            : e.code === "auth/network-request-failed"
            ? "Network error. Check your connection and try again."
            : e.message;
        Alert.alert("Sign Up Failed", msg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const inputStyle = (field: FieldKey) => [
    styles.input,
    formik.touched[field] && formik.errors[field] ? styles.inputError : null,
    formik.touched[field] && !formik.errors[field] ? styles.inputValid : null,
  ];

  const passwordStrength = (() => {
    const p = formik.values.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { label: "Weak", color: "#e07a91", width: "25%" };
    if (score === 2) return { label: "Fair", color: "#e6a817", width: "50%" };
    if (score === 3) return { label: "Good", color: "#5f8aff", width: "75%" };
    return { label: "Strong", color: "#4caf88", width: "100%" };
  })();

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
          <Text style={styles.pageTitle}>Create Account</Text>
          <Text style={styles.pageSubtitle}>Fill in your details to get started</Text>
        </View>

        <View style={styles.divider} />

        {/* Full Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={formik.values.fullName}
            onChangeText={formik.handleChange("fullName")}
            onBlur={formik.handleBlur("fullName")}
            placeholder="John Smith"
            placeholderTextColor="#d4cceb"
            autoCapitalize="words"
            style={inputStyle("fullName")}
          />
          {formik.touched.fullName && formik.errors.fullName && (
            <Text style={styles.errorText}>{formik.errors.fullName}</Text>
          )}
        </View>

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
            style={inputStyle("email")}
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
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              placeholderTextColor="#d4cceb"
              secureTextEntry={!showPassword}
              style={[inputStyle("password"), styles.passwordInput]}
            />
            <Pressable onPress={() => setShowPassword((p) => !p)} style={styles.toggleIcon}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#9e9890"
              />
            </Pressable>
          </View>
          {formik.values.password.length > 0 && passwordStrength && (
            <View style={styles.strengthRow}>
              <View style={styles.strengthTrack}>
                <View
                  style={[
                    styles.strengthFill,
                    {
                      width: passwordStrength.width as any,
                      backgroundColor: passwordStrength.color,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                {passwordStrength.label}
              </Text>
            </View>
          )}
          {formik.touched.password && formik.errors.password && (
            <Text style={styles.errorText}>{formik.errors.password}</Text>
          )}
        </View>

        {/* Confirm Password */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              value={formik.values.confirmPassword}
              onChangeText={formik.handleChange("confirmPassword")}
              onBlur={formik.handleBlur("confirmPassword")}
              placeholder="Re-enter your password"
              placeholderTextColor="#d4cceb"
              secureTextEntry={!showConfirm}
              style={[inputStyle("confirmPassword"), styles.passwordInput]}
            />
            <Pressable onPress={() => setShowConfirm((p) => !p)} style={styles.toggleIcon}>
              <Ionicons
                name={showConfirm ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#9e9890"
              />
            </Pressable>
          </View>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <Text style={styles.errorText}>{formik.errors.confirmPassword}</Text>
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
            {formik.isSubmitting ? "Creating account..." : "Create Account"}
          </Text>
        </Pressable>

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>Already have an account? </Text>
          <Pressable onPress={() => router.push("/(auth)/sign-in")}>
            <Text style={styles.switchLink}>Sign In</Text>
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
  strengthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  strengthTrack: {
    flex: 1,
    height: 3,
    backgroundColor: "#4f3b75",
    borderRadius: 2,
    overflow: "hidden",
  },
  strengthFill: { height: 3, borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontWeight: "600", width: 46 },
  submitButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#8c67ff",
    marginTop: 28,
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
