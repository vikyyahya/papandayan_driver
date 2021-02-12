import React, { Component } from "react";
import { moderateScale, verticalScale } from "../../util/ModerateScale";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { postData } from "../../network/ApiService";
import LogoGoogle from "../../assets/image/logo_google.svg";
import { BASE_URL, REGISTER } from "../../network/ApiService";

import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      username: "",

      isName: true,
      isEmail: true,
      isUserName: true,
      isPassword: true,
      isPasswordConfirm: true,
      isLoading: false,
      message: "",
      modalVisible: false,

      messageErrorEmail: "",

      isForm: false,
    };
  }
  componentDidMount() {}

  async validationForm() {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (this.state.name == "") {
      this.setState({ isName: false });
    }
    if (this.state.email == "") {
      this.setState({
        isEmail: false,
        messageErrorEmail: "Email wajib diisi",
      });
    }
    if (this.state.username == "") {
      this.setState({ isUserName: false });
    }
    if (this.state.password == "") {
      this.setState({ isPassword: false });
    }

    if (this.state.password_confirmation == "") {
      this.setState({ isPasswordConfirm: false });
    }

    if (this.state.email != "") {
      if (reg.test(this.state.email) === false) {
        console.log("Email is Not Correct");
        this.setState({ email: this.state.email });
        this.setState({
          isEmail: false,
          messageErrorEmail: "Harap masukkan email dengan benar",
        });
        return false;
      } else {
        this.setState({ email: this.state.email });
        console.log("Email is Correct");
      }
    }

    if (this.state.password != this.state.password_confirmation) {
      await this.setState({ message: "Kata kunci tidak sama" });
      this.setState({ modalVisible: true });
      return false;
    }
    if (
      this.state.name != "" &&
      this.state.email != "" &&
      this.state.username != "" &&
      this.state.password != "" &&
      this.state.password_confirmation != ""
    ) {
      this.setState({ isForm: true });
    }
  }

  async gotoKodeReferal() {
    await this.validationForm();

    if (this.state.isForm == true) {
      this.setLoading(true);

      var params = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        password_confirmation: this.state.password_confirmation,
        role_id: "1",
        username: this.state.username,
      };
      await postData(BASE_URL + REGISTER, params, "")
        .then((response) => {
          console.log("reg response", response);
          if (response.success == true) {
            this.setLoading(false);
            this.props.navigation.replace("KodeReferal");
          } else {
            this.setLoading(false);
            this.setState({ message: response.message });
            this.setState({ modalVisible: true });
            // this.setState({ isPassword: false, isUserId: false });
          }
        })
        .catch((error) => {
          this.setLoading(false);
        });
    }
  }

  register() {
    this.setLoading(true);
  }
  setLoading(data) {
    this.setState({ isLoading: data });
  }

  async onChangeName(name) {
    await this.setState({ name });
    if (this.state.name != "") {
      this.setState({ isName: true });
    }
  }
  async onChangeEmail(email) {
    await this.setState({ email });
    if (this.state.email != "") {
      this.setState({ isEmail: true });
    }
  }

  async onChangeIdOption(username) {
    await this.setState({ username });
    if (this.state.username != "") {
      this.setState({ isUserName: true });
    }
  }

  async onChangePassword(password) {
    await this.setState({ password });
    if (this.state.password != "") {
      this.setState({ isPassword: true });
    }
  }

  async onChangeRepeatPassword(password_confirmation) {
    await this.setState({ password_confirmation });
    if (this.state.password_confirmation != "") {
      this.setState({ isPasswordConfirm: true });
    }
  }

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
              <Text style={styles.modalText}>Opps!</Text>
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

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={"dark-content"} backgroundColor="#FBFAF8" />
        <KeyboardAwareScrollView
          enableResetScrollToCoords={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.container}>
            {this.renderModal()}
            <Image
              source={require("../../assets/image/logo_red.png")}
              style={styles.logo_register}
            ></Image>
            <Text style={styles.center_text_red}>Registrasi Pengguna</Text>
            <View style={styles.content}>
              <Text style={styles.title}>Nama Lengkap</Text>
              <TextInput
                style={
                  this.state.isName == false
                    ? styles.text_input_false
                    : styles.text_input
                }
                placeholder="Nama Lengkap"
                value={this.state.name}
                onChangeText={(name) => this.onChangeName(name)}
              ></TextInput>
              {!this.state.isName && (
                <Text style={styles.text_false}>Nama wajib diisi</Text>
              )}

              <Text style={styles.title}>Email</Text>
              <TextInput
                style={
                  this.state.isEmail == false
                    ? styles.text_input_false
                    : styles.text_input
                }
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(email) => this.onChangeEmail(email)}
                value={this.state.email}
              ></TextInput>
              {!this.state.isEmail && (
                <Text style={styles.text_false}>
                  {this.state.messageErrorEmail}
                </Text>
              )}

              <Text style={styles.title}>Pilihan Id</Text>
              <TextInput
                style={
                  this.state.isUserName == false
                    ? styles.text_input_false
                    : styles.text_input
                }
                placeholder="Pilihan Id"
                keyboardType="default"
                autoCapitalize="none"
                onChangeText={(username) => this.onChangeIdOption(username)}
                value={this.state.username}
              ></TextInput>
              {!this.state.isUserName && (
                <Text style={styles.text_false}>Pilihan Id wajib diisi</Text>
              )}

              <Text style={styles.title}>Kata Kunci</Text>
              <TextInput
                style={
                  this.state.isPassword == false
                    ? styles.text_input_false
                    : styles.text_input
                }
                placeholder="Kata Kunci"
                type="password"
                secureTextEntry={this.state.password.length != 0 ? true : false}
                autoCapitalize="none"
                onChangeText={(password) => this.onChangePassword(password)}
                value={this.state.password}
              ></TextInput>
              {!this.state.isPassword && (
                <Text style={styles.text_false}>Kata kunci wajib diisi</Text>
              )}

              <Text style={styles.title}>Ulangi Kata Kunci</Text>
              <TextInput
                style={
                  this.state.isPasswordConfirm == false
                    ? styles.text_input_false
                    : styles.text_input
                }
                placeholder="Ulangi Kata Kunci"
                type="password"
                secureTextEntry={
                  this.state.password_confirmation.length != 0 ? true : false
                }
                autoCapitalize="none"
                onChangeText={(password_confirmation) =>
                  this.onChangeRepeatPassword(password_confirmation)
                }
                value={this.state.password_confirmation}
              ></TextInput>
              {!this.state.isPasswordConfirm && (
                <Text style={styles.text_false}>
                  Ulangi kata kunci wajib diisi
                </Text>
              )}

              <TouchableOpacity
                style={styles.btn_login}
                onPress={() => this.gotoKodeReferal()}
              >
                <Text style={styles.text_btn_login}>DAFTAR</Text>
              </TouchableOpacity>
              <View style={styles.row_center}>
                <View style={styles.line} />
                <Text style={styles.center_text}>ATAU</Text>
                <View style={styles.line} />
              </View>
              <TouchableOpacity style={styles.btn_login_google}>
                <View style={{ flexDirection: "row" }}>
                  <LogoGoogle style={styles.logo_google}></LogoGoogle>
                  <Text style={styles.text_btn_login_google}>
                    Daftar dengan Google
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
        {this.state.isLoading && (
          <ActivityIndicator
            style={{
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              position: "absolute",
              backgroundColor: "rgba(52, 52, 52, 0.3)",
            }}
            size="large"
            color="#A80002"
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FBFAF8",
    paddingBottom: verticalScale(10),
  },

  line: {
    height: 1,
    marginHorizontal: moderateScale(10),
    width: moderateScale(120),
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },

  logo_register: {
    width: verticalScale(100),
    height: verticalScale(100),
    resizeMode: "stretch",
    marginBottom: verticalScale(5),
  },
  content: {
    paddingHorizontal: moderateScale(30),
    width: "100%",
  },
  title: {
    marginTop: verticalScale(10),
    fontFamily: "Montserrat-Regular",
    fontSize: moderateScale(9),
    color: "#686868",
  },
  center_text: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  text_false: {
    marginTop: verticalScale(8),
    fontFamily: "Montserrat-Bold",
    fontSize: moderateScale(9),
    textAlign: "right",
    color: "#E21C1C",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(24.5),
  },
  center_text_red: {
    justifyContent: "center",
    textAlign: "center",
    fontFamily: "Montserrat-Bold",
    fontSize: moderateScale(12),
    color: "#E21C1C",
    marginTop: verticalScale(30),
  },
  text_input: {
    backgroundColor: "#F0F0F0",
    borderRadius: moderateScale(12),
    marginTop: verticalScale(8),
    fontSize: moderateScale(12),
    paddingStart: moderateScale(16),
    fontFamily: "Montserrat-Regular",
    height: verticalScale(46),
  },
  text_input_false: {
    backgroundColor: "#F0F0F0",
    borderRadius: moderateScale(12),
    marginTop: verticalScale(8),
    fontSize: moderateScale(12),
    paddingStart: moderateScale(16),
    fontFamily: "Montserrat-Regular",
    borderColor: "#E21C1C",
    height: verticalScale(46),
    borderWidth: 1,
  },

  btn_login: {
    width: "100%",
    borderRadius: 50,
    alignItems: "center",
    backgroundColor: "#A80002",
    marginTop: moderateScale(15),
    height: verticalScale(40),
    alignItems: "center",
    justifyContent: "center",
  },
  text_btn_login: {
    color: "white",
    fontFamily: "Montserrat-Regular",
    fontSize: moderateScale(14),
  },
  btn_login_google: {
    width: "100%",
    borderRadius: 50,
    alignItems: "center",
    backgroundColor: "white",
    marginTop: verticalScale(15),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    elevation: 3,
    height: verticalScale(40),
    alignItems: "center",
    justifyContent: "center",
  },
  text_btn_login_google: {
    color: "#262F56",
    fontFamily: "Montserrat-Regular",
    fontSize: moderateScale(14),
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  row_center: {
    marginTop: verticalScale(24),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text_red: {
    color: "#E21C1C",
    fontFamily: "Montserrat-Bold",
    fontSize: 12,
  },
  logo_google: {
    marginHorizontal: moderateScale(10),
  },

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

export default Register;
