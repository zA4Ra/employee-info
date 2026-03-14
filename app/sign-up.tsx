import { Ionicons } from "@expo/vector-icons";
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
import * as Yup from "yup";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: { fullName: "", email: "", password: "", confirmPassword: "" },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      await new Promise((res) => setTimeout(res, 1200));
      setIsSubmitting(false);
      Alert.alert("Account created", `Welcome, ${values.fullName}!`, [
        { text: "OK", onPress: () => resetForm() },
      ]);
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
    if (score <= 1) return { label: "Weak", color: "#c0392b", width: "25%" };
    if (score === 2) return { label: "Fair", color: "#e67e22", width: "50%" };
    if (score === 3) return { label: "Good", color: "#8a9a50", width: "75%" };
    return { label: "Strong", color: "#3d5a47", width: "100%" };
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
            placeholderTextColor="#b0aaa0"
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
            placeholderTextColor="#b0aaa0"
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
              placeholderTextColor="#b0aaa0"
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
                <View style={[styles.strengthFill, { width: passwordStrength.width as any, backgroundColor: passwordStrength.color }]} />
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
              placeholderTextColor="#b0aaa0"
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
            (!formik.isValid || !formik.dirty || isSubmitting) && styles.submitDisabled,
          ]}
          onPress={() => formik.handleSubmit()}
          disabled={!formik.isValid || !formik.dirty || isSubmitting}
        >
          <Text style={styles.submitText}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Text>
        </Pressable>

        <Pressable onPress={() => formik.resetForm()} style={styles.clearRow}>
          <Text style={styles.clearText}>Clear form</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f9f7f5",
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 40,
  },
  pageHeader: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1c1a18",
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#9e9890",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#ece9e4",
    marginBottom: 28,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4a4540",
    marginBottom: 7,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd8d2",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#1c1a18",
    backgroundColor: "#ffffff",
  },
  passwordWrapper: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 46,
  },
  toggleIcon: {
    position: "absolute",
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  inputError: {
    borderColor: "#c0392b",
    backgroundColor: "#fdfafa",
  },
  inputValid: {
    borderColor: "#6aab6a",
  },
  errorText: {
    color: "#c0392b",
    fontSize: 12,
    marginTop: 5,
  },
  strengthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  strengthTrack: {
    flex: 1,
    height: 3,
    backgroundColor: "#ece9e4",
    borderRadius: 2,
    overflow: "hidden",
  },
  strengthFill: {
    height: 3,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: "600",
    width: 46,
  },
  submitButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#3d5a47",
    marginTop: 28,
  },
  submitDisabled: {
    backgroundColor: "#a9bfb0",
  },
  submitText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
  clearRow: {
    alignItems: "center",
    marginTop: 18,
  },
  clearText: {
    fontSize: 13,
    color: "#b0aaa0",
  },
});
