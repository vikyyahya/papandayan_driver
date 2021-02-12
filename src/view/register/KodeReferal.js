import React, { Component } from "react";
import { moderateScale, verticalScale } from "../../util/ModerateScale";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LogoGoogle from "../../assets/image/logo_google.svg";

import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

class KodeReferal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      no_hp: "",
      password: "",
      no_hp: "",
      isPassword: true,
      isEmail: true,
    };
  }
  componentDidMount() {}

  gotoHome() {
    this.props.navigation.replace("MainTabs");
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
            <Image
              source={require("../../assets/image/logo_red.png")}
              style={styles.logo_register}
            ></Image>
            <Text style={styles.center_text_red}>
              Proses registrasi BERHASIL!
            </Text>

            <View style={styles.content}>
              <Text style={styles.center_text}>
                Selamat! Anda sudah terdaftar di aplikasi Papandayan Cargo.
                Untuk kelancaran penggunaan aplikasi ini, silahkan masukan nomor
                handphone dan kode referral jika ada.
              </Text>
              <Text style={styles.title}>Nomor Handphone</Text>
              <TextInput
                style={styles.text_input}
                placeholder="Nomor Handphone"
              ></TextInput>

              <Text style={styles.title}>Kode Referal</Text>
              <TextInput
                style={
                  this.state.isPassword == false
                    ? styles.text_input_false
                    : styles.text_input
                }
                placeholder="Kode Referal"
                keyboardType="default"
                autoCapitalize="none"
                onChangeText={(no_hp) => this.setState({ no_hp })}
                value={this.state.no_hp}
              ></TextInput>
              {!this.state.isPassword && (
                <Text style={styles.text_false}>
                  Password yang Anda masukkan salah
                </Text>
              )}

              <TouchableOpacity
                style={styles.btn_login}
                onPress={() => this.gotoHome()}
              >
                <Text style={styles.text_btn_register}>SUBMIT</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btn_login_replace}
                onPress={() => this.gotoHome()}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.text_btn_register_replace}>SKIP</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
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

  logo_register: {
    width: verticalScale(130),
    height: verticalScale(130),
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
    textAlign: "center",
    marginTop: verticalScale(40),
    marginBottom: verticalScale(14),
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
    marginTop: moderateScale(40),
    height: verticalScale(40),
    alignItems: "center",
    justifyContent: "center",
  },
  text_btn_register: {
    color: "white",
    fontFamily: "Montserrat-Bold",
    fontSize: moderateScale(14),
  },
  btn_login_replace: {
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
  text_btn_register_replace: {
    color: "#A80002",
    fontFamily: "Montserrat-Bold",
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
});

export default KodeReferal;
