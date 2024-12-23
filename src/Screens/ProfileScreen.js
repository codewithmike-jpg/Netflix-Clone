import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  FlatList,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ navigation }) {
  const [profiles, setProfiles] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [newProfileName, setNewProfileName] = useState("");

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
    };
    requestPermission();
    loadProfiles(); // Load profiles from local storage when the component mounts
  }, []);

  const loadProfiles = async () => {
    try {
      const storedProfiles = await AsyncStorage.getItem("profiles");
      if (storedProfiles) {
        setProfiles(JSON.parse(storedProfiles));
      }
    } catch (error) {
      console.error("Failed to load profiles.", error);
    }
  };

  const saveProfiles = async (profilesToSave) => {
    try {
      await AsyncStorage.setItem("profiles", JSON.stringify(profilesToSave));
    } catch (error) {
      console.error("Failed to save profiles.", error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setNewProfileImage(result.assets[0].uri);
      setIsModalVisible(true);
    }
  };

  const addProfile = () => {
    if (newProfileName.trim()) {
      const newProfile = { name: newProfileName, image: newProfileImage };
      const updatedProfiles = [...profiles, newProfile];
      setProfiles(updatedProfiles);
      saveProfiles(updatedProfiles); // Save updated profiles to local storage
      setNewProfileName("");
      setNewProfileImage(null);
      setIsModalVisible(false);
    } else {
      Alert.alert("Please enter a name for the profile.");
    }
  };

  const deleteProfile = (index) => {
    const updatedProfiles = profiles.filter((_, i) => i !== index);
    setProfiles(updatedProfiles);
    saveProfiles(updatedProfiles); // Save updated profiles to local storage
  };

  const handleProfilePress = (selectedProfile) => {
    navigation.navigate("HomeTabs", {
      selectedProfileName: selectedProfile.name,
    });
  };

  const renderProfile = ({ item, index }) => (
    <TouchableOpacity
      style={styles.profileBox}
      onPress={() => handleProfilePress(item)}
    >
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.profileImage} />
      )}
      <Text style={styles.profileName}>{item.name}</Text>
      {isEditMode && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteProfile(index)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Who's Watching?</Text>
        <TouchableOpacity
          onPress={() => setIsEditMode(!isEditMode)}
          style={styles.editTextButton}
        >
          <Text style={styles.editText}>{isEditMode ? "Done" : "Edit"}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={[...profiles, { isAddButton: true }]}
        renderItem={({ item, index }) =>
          item.isAddButton ? (
            <TouchableOpacity style={styles.addProfileBox} onPress={pickImage}>
              <Text style={styles.addIcon}>+</Text>
              <Text style={styles.addProfileText}>Add Profile</Text>
            </TouchableOpacity>
          ) : (
            renderProfile({ item, index })
          )
        }
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        columnWrapperStyle={styles.row}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Profile Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Profile Name"
              placeholderTextColor="#888"
              value={newProfileName}
              onChangeText={setNewProfileName}
            />
            <TouchableOpacity onPress={addProfile} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 15,
  },
  heading: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  editTextButton: {
    padding: 10,
  },
  editText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    justifyContent: "space-around",
    marginBottom: 20,
  },
  profileBox: {
    width: 130,
    height: 130,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 15,
  },
  profileImage: {
    width: "100%",
    height: "80%",
    resizeMode: "cover",
    borderRadius: 15,
  },
  profileName: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    borderRadius: 12,
    padding: 2,
  },
  deleteText: {
    color: "white",
    fontSize: 12,
  },
  addProfileBox: {
    width: 130,
    height: 130,
    backgroundColor: "#555555",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 15,
  },
  addIcon: {
    color: "white",
    fontSize: 48,
  },
  addProfileText: {
    color: "white",
    marginTop: 5,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#333333",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "#555555",
    color: "white",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
  },
});
