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
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      await new Promise((res) => setTimeout(res, 1200));
      setIsSubmitting(false);
      Alert.alert("Signed in", `Welcome back, ${values.email}`, [
        { text: "OK", onPress: () => resetForm() },
      ]);
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
          <Text style={styles.pageTitle}>Sign In</Text>
          <Text style={styles.pageSubtitle}>Enter your credentials to continue</Text>
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
            placeholderTextColor="#b0aaa0"
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
              placeholderTextColor="#b0aaa0"
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

        <Pressable
          style={[
            styles.submitButton,
            (!formik.isValid || !formik.dirty || isSubmitting) && styles.submitDisabled,
          ]}
          onPress={() => formik.handleSubmit()}
          disabled={!formik.isValid || !formik.dirty || isSubmitting}
        >
          <Text style={styles.submitText}>
            {isSubmitting ? "Signing in..." : "Sign In"}
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
    justifyContent: "center",
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
