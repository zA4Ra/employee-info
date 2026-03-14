import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
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

const employmentTypes = ["full-time", "part-time", "temporary", "contract"];

const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be 60 characters or less")
    .matches(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
    .required("Full name is required"),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  employeeId: Yup.string()
    .matches(/^[A-Z]{2}\d{4}$/, "Employee ID must be 2 uppercase letters followed by 4 digits (e.g. AB1234)")
    .required("Employee ID is required"),
  department: Yup.string()
    .min(2, "Department must be at least 2 characters")
    .required("Department is required"),
  salary: Yup.number()
    .typeError("Salary must be a number")
    .min(15000, "Salary must be at least $15,000")
    .max(500000, "Salary must be $500,000 or less")
    .required("Salary is required"),
});

export default function Employee() {
  const [dob, setDob] = useState(new Date(1995, 0, 1));
  const [startDate, setStartDate] = useState(new Date());
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [employmentType, setEmploymentType] = useState("full-time");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      phoneNumber: "",
      employeeId: "",
      department: "",
      salary: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      await new Promise((res) => setTimeout(res, 1200));
      setIsSubmitting(false);
      Alert.alert(
        "Submitted",
        `Employee ${values.fullName} has been saved.`,
        [{ text: "OK", onPress: () => resetForm() }]
      );
    },
  });

  const getFieldStyle = (field: keyof typeof formik.values) => [
    styles.input,
    formik.touched[field] && formik.errors[field] ? styles.inputError : null,
    formik.touched[field] && !formik.errors[field] ? styles.inputValid : null,
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Page header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Employee Information</Text>
          <Text style={styles.pageSubtitle}>Fill in the details below to register an employee</Text>
        </View>

        {/* Form section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PERSONAL DETAILS</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              value={formik.values.fullName}
              onChangeText={formik.handleChange("fullName")}
              onBlur={formik.handleBlur("fullName")}
              placeholder="e.g. John Smith"
              placeholderTextColor="#b0aaa0"
              autoCapitalize="words"
              style={getFieldStyle("fullName")}
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <Text style={styles.errorText}>{formik.errors.fullName}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              value={formik.values.phoneNumber}
              onChangeText={formik.handleChange("phoneNumber")}
              onBlur={formik.handleBlur("phoneNumber")}
              placeholder="10-digit number"
              placeholderTextColor="#b0aaa0"
              keyboardType="phone-pad"
              maxLength={10}
              style={getFieldStyle("phoneNumber")}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <Text style={styles.errorText}>{formik.errors.phoneNumber}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <Pressable onPress={() => setShowDobPicker(true)} style={styles.dateButton}>
              <Ionicons name="calendar-outline" size={16} color="#7c756e" />
              <Text style={styles.dateText}>{dob.toDateString()}</Text>
            </Pressable>
            {showDobPicker && (
              <DateTimePicker
                value={dob}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={(_, selected) => {
                  setShowDobPicker(false);
                  if (selected) setDob(selected);
                }}
              />
            )}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>EMPLOYMENT DETAILS</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Employee ID</Text>
            <TextInput
              value={formik.values.employeeId}
              onChangeText={(text) => formik.setFieldValue("employeeId", text.toUpperCase())}
              onBlur={formik.handleBlur("employeeId")}
              placeholder="e.g. AB1234"
              placeholderTextColor="#b0aaa0"
              autoCapitalize="characters"
              maxLength={6}
              style={getFieldStyle("employeeId")}
            />
            {formik.touched.employeeId && formik.errors.employeeId && (
              <Text style={styles.errorText}>{formik.errors.employeeId}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Department</Text>
            <TextInput
              value={formik.values.department}
              onChangeText={formik.handleChange("department")}
              onBlur={formik.handleBlur("department")}
              placeholder="e.g. Engineering"
              placeholderTextColor="#b0aaa0"
              autoCapitalize="words"
              style={getFieldStyle("department")}
            />
            {formik.touched.department && formik.errors.department && (
              <Text style={styles.errorText}>{formik.errors.department}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Annual Salary (CAD)</Text>
            <TextInput
              value={formik.values.salary}
              onChangeText={formik.handleChange("salary")}
              onBlur={formik.handleBlur("salary")}
              placeholder="e.g. 65000"
              placeholderTextColor="#b0aaa0"
              keyboardType="numeric"
              style={getFieldStyle("salary")}
            />
            {formik.touched.salary && formik.errors.salary && (
              <Text style={styles.errorText}>{formik.errors.salary}</Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Start Date</Text>
            <Pressable onPress={() => setShowStartPicker(true)} style={styles.dateButton}>
              <Ionicons name="calendar-outline" size={16} color="#7c756e" />
              <Text style={styles.dateText}>{startDate.toDateString()}</Text>
            </Pressable>
            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(_, selected) => {
                  setShowStartPicker(false);
                  if (selected) setStartDate(selected);
                }}
              />
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Employment Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={employmentType}
                onValueChange={(val) => setEmploymentType(val)}
                mode="dropdown"
                style={styles.picker}
              >
                {employmentTypes.map((t) => (
                  <Picker.Item
                    key={t}
                    label={t.charAt(0).toUpperCase() + t.slice(1).replace("-", " ")}
                    value={t}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <Pressable style={styles.resetButton} onPress={() => formik.resetForm()}>
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>

          <Pressable
            style={[
              styles.submitButton,
              (!formik.isValid || !formik.dirty || isSubmitting) && styles.submitDisabled,
            ]}
            onPress={() => formik.handleSubmit()}
            disabled={!formik.isValid || !formik.dirty || isSubmitting}
          >
            <Text style={styles.submitText}>
              {isSubmitting ? "Saving..." : "Save Employee"}
            </Text>
          </Pressable>
        </View>
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
    marginBottom: 28,
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
  section: {
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#b0aaa0",
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#ece9e4",
    marginVertical: 24,
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
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#ddd8d2",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#ffffff",
  },
  dateText: {
    fontSize: 15,
    color: "#1c1a18",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd8d2",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    height: 50,
    justifyContent: "center",
  },
  picker: {
    height: 50,
    color: "#1c1a18",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 32,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd8d2",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  resetText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#7c756e",
  },
  submitButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#3d5a47",
  },
  submitDisabled: {
    backgroundColor: "#a9bfb0",
  },
  submitText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
});
