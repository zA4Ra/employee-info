import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Stack } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Employee() {
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [employmentType, setEmploymentType] = useState("full-time");

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <Text style={styles.title}>Employee Information Form</Text>

        {/* Name Input */}
        <TextInput
          value={userName}
          onChangeText={setUserName}
          placeholder="Enter your first and last name"
          placeholderTextColor="#666"
          autoCapitalize="words"
          style={styles.input}
        />

        {/* Phone Input */}
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter your phone number"
          placeholderTextColor="#666"
          keyboardType="phone-pad"
          maxLength={10}
          style={styles.input}
        />

        {/* Date of Birth */}
        <Text style={styles.label}>Date of Birth</Text>
        <Pressable
          onPress={() => setShowDobPicker(true)}
          style={styles.pickerButton}
        >
          <Text style={styles.pickerText}>{dob.toDateString()}</Text>
        </Pressable>

        {showDobPicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDobPicker(false);
              if (selectedDate) setDob(selectedDate);
            }}
          />
        )}

        {/* Start Date */}
        <Text style={styles.label}>Date Position Started</Text>
        <Pressable
          onPress={() => setShowStartPicker(true)}
          style={styles.pickerButton}
        >
          <Text style={styles.pickerText}>{startDate.toDateString()}</Text>
        </Pressable>

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) setStartDate(selectedDate);
            }}
          />
        )}

        {/* Employment Type */}
        <Text style={styles.label}>Employment Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={employmentType}
            onValueChange={(itemValue) => setEmploymentType(itemValue)}
            mode="dropdown"
            style={styles.picker}
          >
            <Picker.Item label="Full Time" value="full-time" />
            <Picker.Item label="Part Time" value="part-time" />
            <Picker.Item label="Temporary" value="temporary" />
            <Picker.Item label="Contract" value="contract" />
          </Picker>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 15,
    backgroundColor: "#83cef9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    maxWidth: 350,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#83cef9",
    color: "#000",
  },
  label: {
    fontWeight: "600",
    textAlign: "center",
    width: "100%",
    marginTop: 10,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#83cef9",
    justifyContent: "center",
  },
  pickerText: {
    color: "#000",
  },
  pickerContainer: {
    width: "100%",
    maxWidth: 350,
    height: 90,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  picker: {
    height: 55,
    color: "#666",
  },
});
