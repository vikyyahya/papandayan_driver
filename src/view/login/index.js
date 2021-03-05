import React, { Component } from "react";
import { moderateScale, verticalScale } from "../../util/ModerateScale";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CheckBox from "@react-native-community/checkbox";
import LogoGoogle from "../../assets/image/logo_google.svg";
import { postData } from "../../network/ApiService";
import { BASE_URL, LOGIN } from "../../network/ApiService";
import Modals from "../../util/Modal";
import { saveData } from "../../util/AsyncStorage";
import { LOGIN_STATUS, TOKEN } from "../../util/StringConstans";

import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";

class Login extends Component {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
    this.state = {
      userId: "driver1@gmail.com",
      password: "driver",
      message: "",
      isPassword: true,
      isUserId: true,
      stay_login: false,
      isLoading: false,
      isForm: false,
    };
  }
  componentDidMount() {}

  async validationForm() {
    if (this.state.userId == "") {
    } else if (this.state.password == "") {
    }
  }

  goCallAdmin() {
    // this.props.navigation.navigate("Register");
    Linking.openURL(`tel:${"0213456789"}`);
  }

  async goToHome() {
    this.setLoading(true);
    var params = {
      userId: this.state.userId,
      password: this.state.password,
    };
    await postData(BASE_URL + LOGIN, params, "")
      .then((response) => {
        console.log("login response", response);
        if (response.success == true) {
          saveData(TOKEN, response.data.token);
          saveData(LOGIN_STATUS, "1");
          this.setLoading(false);
          this.props.navigation.replace("MainTabs");
        } else if (response.data == "4001") {
          this.setLoading(false);
          this.setState({ isUserId: false, message: response.message });
        } else if (response.data == "4002") {
          this.setLoading(false);
          this.setState({ isPassword: false, message: response.message });
        } else if (response.data == "4003") {
          this.setLoading(false);
          this.setState({ isUserId: false, message: response.message });
        } else if (response.data == "4005") {
          this.setLoading(false);
          this.setState({ isPassword: false, message: response.message });
        } else {
          this.setLoading(false);
        }
      })
      .catch((error) => {
        this.setLoading(false);
      });
  }

  setLoading(data) {
    this.setState({ isLoading: data });
  }
  setmodal() {
    this.modal.setModalErrorVisible(true);
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
            <Modals onModal={(ref) => (this.modal = ref)} />

            <Image
              source={require("../../assets/image/logo_red.png")}
              style={styles.logo_login}
            ></Image>
            <View style={styles.content}>
              <Text style={styles.title}>ID Pelanggan</Text>
              <TextInput
                value={this.state.userId}
                style={
                  this.state.isUserId == false
                    ? styles.text_input_false
                    : styles.text_input
                }
                placeholder="ID Pelanggan"
                onChangeText={(userId) => this.setState({ userId })}
              ></TextInput>
              {!this.state.isUserId && (
                <Text style={styles.text_false}>{this.state.message}</Text>
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
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
              ></TextInput>
              {!this.state.isPassword && (
                <Text style={styles.text_false}>
                  Password yang Anda masukkan salah
                </Text>
              )}
              <View style={styles.row}>
                <CheckBox
                  disabled={false}
                  value={this.state.stay_login}
                  onValueChange={(stay_login) => this.setState({ stay_login })}
                  tintColors={{ true: "#E21C1C" }}
                />
                <Text style={styles.cb_text}>
                  Biarkan saya tetap login di perangkat ini
                </Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.center_text_red}>Lupa Kata Kunci?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn_login}
                onPress={() => this.goToHome()}
              >
                <Text style={styles.text_btn_login}>MASUK</Text>
              </TouchableOpacity>

              <View style={styles.row_center}>
                <Text style={styles.cb_text}>Tidak punya akun?</Text>
                <TouchableOpacity
                  style={{ marginLeft: 10 }}
                  onPress={() => this.goCallAdmin()}
                >
                  <Text style={styles.text_red}>Hubungin Admin</Text>
                </TouchableOpacity>
              </View>
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
  logo_login: {
    width: verticalScale(180),
    height: verticalScale(180),
    resizeMode: "stretch",
    marginBottom: verticalScale(5),
  },
  content: {
    paddingHorizontal: moderateScale(30),
    width: "100%",
  },
  title: {
    marginTop: verticalScale(24),
    fontFamily: "Montserrat-Regular",
    fontSize: moderateScale(9),
    color: "#686868",
  },
  cb_text: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
  },
  text_false: {
    marginTop: verticalScale(5),
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
  },
  text_red: {
    color: "#E21C1C",
    fontFamily: "Montserrat-Bold",
    fontSize: 12,
  },
  logo_google: {
    marginHorizontal: moderateScale(10),
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

export default Login;
