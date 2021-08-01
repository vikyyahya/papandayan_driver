import React, { Component } from "react";
import Header from "../../Header";
import { moderateScale, verticalScale } from "../../../util/ModerateScale";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Loading } from "../../../util/Loading";
import { LOGIN_STATUS, TOKEN } from "../../../util/StringConstans";
import { getValue, saveData } from "../../../util/AsyncStorage";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { CustomCamera } from "../../../util/CustomCamera";
import ImageResizer from "react-native-image-resizer";

import {
  getData,
  BASE_URL,
  PROFILE,
  UPDATE_PROFILE,
  UPDATE_AVATAR,
  postData,
  postFormData,
} from "../../../network/ApiService";

import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Modal,
  PermissionsAndroid,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Platform,
} from "react-native";
const { width, height } = Dimensions.get("window");

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      name: "",
      username: "",
      email: "",
      phone: "",
      token: "",
      avatar: null,
      dataImage: "",
      dataImageFromDevice: "",
      old_password: "",
      new_password: "",
      modalVisible: false,
      modalOptionVisible: false,
      isCustomCamera: false,
      title: "",
      message: "",
      date: new Date(),
    };
  }
  async componentDidMount() {
    let token = await getValue(TOKEN);
    this.setLoading(true);
    await this.setState({ token });
    await this.getDataProfile();
  }

  async getDataProfile() {
    console.log("getDataProfile token ", this.state.token);

    await getData(BASE_URL + PROFILE, this.state.token).then((response) => {
      console.log("getDataProfile ", response);
      if (response.success == true) {
        let value = response.data;
        this.setState({ name: value.name });
        this.setState({ username: value.username });
        this.setState({ phone: value.phone });
        this.setState({ avatar: value.avatar });
        this.setLoading(false);
      } else if (response.code == 4001) {
        this.props.navigation.replace("Login");
      } else if (response.message == "Unauthenticated.") {
        this.props.navigation.replace("Login");
      }
    });
  }

  async uploadImage() {
    const data = this.state.dataImage;
    const form = new FormData();
    form.append("avatar", {
      uri: data.uri,
      name: this.state.name != "" ? this.state.name : ur.substr(ur.length - 10),
      type: "image/jpeg",
    });

    await postFormData(BASE_URL + UPDATE_AVATAR, form, this.state.token).then(
      (response) => {
        console.log("updateProfile Picture", response);
        if (response.success == true) {
          let value = response.data;

          this.setLoading(false);
          this.setState({
            dataImage: response.data.path,
            // message: 'Profile berhasil diperbaharui',
            // modalVisible: true,
            // title: 'Berhasil',
          });

          this.updateProfile(response.data.path);
        } else if (response.code == 4001) {
          this.setLoading(false);
          this.props.navigation.replace("Login");
        } else if (response.message == "Unauthenticated.") {
          this.setLoading(false);
          this.props.navigation.replace("Login");
        } else {
          this.setLoading(false);
          this.setState({
            message: response.message,
            modalVisible: true,
            title: "Opss",
          });
        }
      }
    );
  }

  async updateProfile(data) {
    console.log("updateProfile token ", this.state.token);
    this.setState({ isLoading: true });
    var params = {};
    if (this.state.dataImage == "") {
      params = {
        name: this.state.name,
        username: this.state.username,
        phone: this.state.phone,
        avatar: this.state.avatar,
      };
    } else {
      params = {
        name: this.state.name,
        username: this.state.username,
        phone: this.state.phone,
        avatar: data,
      };
    }

    console.log("data updateProfile", params);

    await postData(BASE_URL + UPDATE_PROFILE, params, this.state.token).then(
      (response) => {
        console.log("updateProfile ", response);
        if (response.success == true) {
          let value = response.data;
          this.setState({ name: value.name });
          this.setState({ username: value.username });
          this.setState({ phone: value.phone });
          this.setState({ avatar: value.avatar });
          this.setState({ dataImage: "" });
          this.setLoading(false);
          this.setState({
            message: "Profile berhasil diperbaharui",
            modalVisible: true,
            title: "Berhasil",
          });
        } else if (response.code == 4001) {
          this.setLoading(false);
          this.props.navigation.replace("Login");
        } else if (response.message == "Unauthenticated.") {
          this.setLoading(false);
          this.props.navigation.replace("Login");
        } else {
          this.setLoading(false);
          this.setState({
            message: response.message,
            modalVisible: true,
            title: "Opss",
          });
        }
      }
    );
  }

  requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        var isPermissionGranted = false;
        const granted = await PermissionsAndroid.requestMultiple(
          [
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          ],
          {
            title: "Perizinan Aplikasi",
            message: "Aplikasi ini membutuhkan akses kamera ",
            buttonNeutral: "Tanyakan nanti",
            buttonNegative: "Batal",
            buttonPositive: "OK",
          }
        );
        for (var propName in granted) {
          if (granted.hasOwnProperty(propName)) {
            var propValue = granted[propName];
            isPermissionGranted = true;
            // do something with each element here
          } else {
            isPermissionGranted = false;
          }
        }

        if (isPermissionGranted) {
          // this.onLaunchCamera();
          this.setState({ modalOptionVisible: true });
        } else {
          console.log("Camera permission denied", granted);
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      this.onLaunchCamera();
    }
  };
  onLaunchCamera = async () => {
    let options = {
      mediaType: "photo",
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: "low",
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };

    launchCamera(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        // dispatch(onDataForShowAlertDefault("Your cancel"));
        return;
      } else if (response.errorCode == "camera_unavailable") {
        // dispatch(onDataForShowAlertDefault("Camera not available on device"));
        return;
      } else if (response.errorCode == "permission") {
        // dispatch(onDataForShowAlertDefault("Permission not satisfied"));
        return;
      } else if (response.errorCode == "others") {
        // dispatch(onDataForShowAlertDefault(response.errorMessage));
        return;
      }
      if ((response.fileSize / (1024 * 1024)).toFixed(2) > 2) {
        // dispatch(onDataForShowAlertDefault("Photo size minimal 2 mb"));
      } else {
        console.log("true response", response);
        // uploadFileToServer(response);
      }
    });
  };

  validationForm() {
    if (this.state.name == "" || this.state.name == null) {
      this.setState({ message: "Nama wajib diisi", modalVisible: true });
    } else if (this.state.username == "" || this.state.username == null) {
      this.setState({ message: "User Name wajib diisi", modalVisible: true });
    } else if (this.state.phone == "" || this.state.phone == null) {
      this.setState({
        message: "No. Handphone wajib diisi",
        modalVisible: true,
      });
    } else {
      console.log("phone", this.state.phone);
      // this.updateProfile();
      this.uploadImage();
    }
  }
  setLoading(data) {
    this.setState({ isLoading: data });
  }
  gotoProfile() {
    this.props.navigation.goBack();
  }

  async onPicture(data) {
    console.log("onPicture", data);

    await this.setState({
      isCustomCamera: false,
     
    });
    var dataTmpImage = data;
    for (var i = 0; i < 10; i++) {
      await ImageResizer.createResizedImage(
        dataTmpImage.uri,
        300,
        300,
        "JPEG",
        40,
        0,
        undefined,
        false
      )
        .then((response) => {
          console.log("onPicture=>>>>>>>>", response);
          dataTmpImage = response;
          if (response.size < 10000) {
            i = 10;
            console.log("onPicture upload=>>>>>>>>", response);
            this.setState({
              isCustomCamera: false,
              dataImage: dataTmpImage,
              dataImageFromDevice: dataTmpImage,
            });
          }
        })
        .catch((err) => {
          console.log("onPicture error=>>>>>>>>", err);

          // Oops, something went wrong. Check that the filename is correct and
          // inspect err to get more details.
        });
    }
  }

  onCapture() {}

  onChooseImage = async () => {
    let options = {
      mediaType: "photo",
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        this.setState({ modalOptionVisible: false });
        // dispatch(onDataForShowAlertDefault("Your cancel"));
        return;
      } else if (response.errorCode == "camera_unavailable") {
        this.setState({ modalOptionVisible: false });
        // dispatch(onDataForShowAlertDefault("Camera not available on device"));
        return;
      } else if (response.errorCode == "permission") {
        this.setState({ modalOptionVisible: false });
        // dispatch(onDataForShowAlertDefault("Permission not satisfied"));
        return;
      } else if (response.errorCode == "others") {
        this.setState({ modalOptionVisible: false });
        // dispatch(onDataForShowAlertDefault(response.errorMessage));
        return;
      }

      if ((response.fileSize / (1024 * 1024)).toFixed(2) > 2) {
        this.setState({ modalOptionVisible: false });
        // dispatch(onDataForShowAlertDefault("Photo size minimal 2 mb"));
      } else {
        this.setState({ modalOptionVisible: false });
        console.log("onChooseImage", response.uri.length);
        var ur = response.uri.substr(response.uri.length - 10);
        console.log("onChooseImage", ur);
        this.onPicture(response);
        // uploadFileToServer(response);
      }
    });
  };

  renderModal() {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{this.state.title}</Text>
              <Text style={styles.modal_message}>{this.state.message}</Text>

              <TouchableOpacity
                style={{ ...styles.openButton }}
                onPress={() => {
                  this.setState({ modalVisible: false });
                }}
              >
                <Text style={styles.textStyle}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  renderModalOption() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalOptionVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7} // default is .2
          onPress={() => this.setState({ modalOptionVisible: false })}
          style={styles.centeredView}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                width: moderateScale(250),
                height: moderateScale(180),
                backgroundColor: "white",
                borderRadius: 12,
                padding: 15,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 20,
                  fontFamily: "Montserrat-Bold",
                }}
              >
                Pilih Foto
              </Text>
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    isCustomCamera: true,
                    modalOptionVisible: false,
                  })
                }
                style={{ marginVertical: verticalScale(10) }}
              >
                <Text>Kamera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.onChooseImage()}
                style={{ marginVertical: verticalScale(10) }}
              >
                <Text>Galery</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    );
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header></Header>

        <KeyboardAwareScrollView
          enableResetScrollToCoords={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.view_icon_left_arrow}
              onPress={() => this.gotoProfile()}
            >
              <Image
                style={styles.icon_left_arrow}
                source={require("../../../assets/image/left-arrow-black.png")}
              ></Image>
            </TouchableOpacity>
            <Text style={styles.text_header}>Edit Profile</Text>
          </View>
          <View style={styles.profil_picture}>
            <View style={styles.view_photo_profil}>
              {this.state.dataImage == "" ? (
                <Image
                  style={styles.photo_profile}
                  source={
                    this.state.avatar == null
                      ? require("../../../assets/image/user.png")
                      : {
                          uri:
                            BASE_URL +
                            "storage" +
                            this.state.avatar +
                            "?time=" +
                            this.state.date,
                        }
                  }
                ></Image>
              ) : (
                <Image
                  style={styles.photo_profile}
                  source={{ uri: this.state.dataImage.uri }}
                ></Image>
              )}

              <TouchableOpacity
                onPress={() => {
                  this.requestCameraPermission();
                }}
                style={styles.view_ic_change_photo}
              >
                <Image
                  style={styles.ic_change_photo}
                  source={require("../../../assets/image/ic_change_photo.png")}
                ></Image>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.content}>
            <CustomCamera
              modalVisible={this.state.isCustomCamera}
              initialProps={this.props}
              onPicture={(value) => this.onPicture(value)}
              onCapture={(v) => this.onCapture(v)}
            ></CustomCamera>
            {this.renderModal()}
            {this.renderModalOption()}

            <Text style={styles.title}>Nama Lengkap</Text>
            <TextInput
              style={styles.text_input}
              placeholder="Nama Lengkap"
              value={this.state.name}
              onChangeText={(name) => this.setState({ name })}
            ></TextInput>

            <Text style={styles.title}>User Name</Text>
            <TextInput
              style={styles.text_input}
              placeholder="User Name"
              value={this.state.username}
              onChangeText={(username) => this.setState({ username })}
            ></TextInput>

            <Text style={styles.title}>No Handphone</Text>
            <TextInput
              maxLength={13}
              keyboardType="decimal-pad"
              style={styles.text_input}
              placeholder="No Handphone"
              value={this.state.phone}
              onChangeText={(phone) => this.setState({ phone })}
            ></TextInput>

            {/* <Text style={styles.title}>Password Lama</Text>
            <TextInput
              style={styles.text_input}
              placeholder="Password Lama"
              value={this.state.old_password}
              onChangeText={(old_password) => this.setState({ old_password })}
            ></TextInput>

            <Text style={styles.title}>Password Baru</Text>
            <TextInput
              style={styles.text_input}
              placeholder="Passsword Baru"
              value={this.state.new_password}
              onChangeText={(new_password) => this.setState({ new_password })}
            ></TextInput> */}

            <TouchableOpacity
              onPress={() => this.validationForm()}
              style={styles.button_primary}
            >
              <Text style={styles.text_title_14}>SIMPAN</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
        <Loading visible={this.state.isLoading}></Loading>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  content: {
    marginTop: verticalScale(70),
    width: width,
    paddingRight: moderateScale(20),
    paddingLeft: moderateScale(20),
    backgroundColor: "#F1F1F1",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
  },
  text_header: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
    color: "black",
  },
  text_title_20: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
    color: "#262F56",
    marginBottom: verticalScale(8),
  },
  text_title_12: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    color: "#8D8F92",
    marginBottom: verticalScale(8),
  },
  text_title_14: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "white",
  },
  text_title_12_bold: {
    fontSize: 12,
    fontFamily: "Montserrat-Bold",
    color: "#262F56",
    marginBottom: verticalScale(8),
  },
  icon_left_arrow: {
    width: moderateScale(20),
    height: moderateScale(20),
    resizeMode: "stretch",
  },
  view_icon_left_arrow: {
    position: "absolute",
    left: moderateScale(20),
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: "center",
  },
  profil_picture: {
    width: "100%",
    height: verticalScale(150),
    justifyContent: "center",
    alignItems: "center",
  },
  photo_profile: {
    width: verticalScale(173),
    height: verticalScale(173),
    borderRadius: verticalScale(173),
  },
  view_photo_profil: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: verticalScale(173),
    height: verticalScale(173),
    borderWidth: 2,
    borderColor: "white",
    borderRadius: verticalScale(173),
    bottom: verticalScale(-50),
  },
  button_primary: {
    height: verticalScale(40),
    width: "100%",
    backgroundColor: "#A80002",
    borderRadius: 20,
    marginTop: verticalScale(24),
    justifyContent: "center",
    alignItems: "center",
  },
  ic_change_photo: {
    width: verticalScale(40),
    height: verticalScale(40),
    resizeMode: "stretch",
  },
  view_ic_change_photo: {
    width: verticalScale(40),
    height: verticalScale(40),
    resizeMode: "stretch",
    position: "absolute",
  },
  title: {
    marginTop: verticalScale(10),
    fontFamily: "Montserrat-Regular",
    fontSize: moderateScale(9),
    color: "#686868",
  },
  text_input: {
    backgroundColor: "white",
    borderRadius: moderateScale(12),
    marginTop: verticalScale(8),
    fontSize: moderateScale(12),
    paddingStart: moderateScale(16),
    fontFamily: "Montserrat-Regular",
    height: verticalScale(46),
  },

  //modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52, 52, 52, 0.3)",
  },
  modalView: {
    width: moderateScale(250),
    height: moderateScale(180),
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "#A80002",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 10,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Montserrat-Bold",
  },
  modal_message: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Montserrat-Regular",
  },
});
export default EditProfile;
