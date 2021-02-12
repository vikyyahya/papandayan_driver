import React, { Component } from "react";
import Header from "../../Header";
import { moderateScale, verticalScale } from "../../../util/ModerateScale";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Loading } from "../../../util/Loading";
import { LOGIN_STATUS, TOKEN } from "../../../util/StringConstans";
import { getValue, saveData } from "../../../util/AsyncStorage";
import { getData, BASE_URL, PROFILE } from "../../../network/ApiService";

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
  KeyboardAvoidingView,
} from "react-native";
const { width, height } = Dimensions.get("window");

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      name: "",
      email: "",
      phone: "",
      token: "",
      old_password: "",
      new_password: "",
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
        this.setState({ email: value.email });
        this.setState({ phone: value.phone });
        this.setLoading(false);
      } else if (response.code == 4001) {
        this.props.navigation.replace("Login");
      } else if (response.message == "Unauthenticated.") {
        this.props.navigation.replace("Login");
      }
    });
  }
  setLoading(data) {
    this.setState({ isLoading: data });
  }
  gotoProfile() {
    this.props.navigation.goBack();
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
              <Image
                style={styles.photo_profile}
                source={require("../../../assets/image/img_profile.png")}
              ></Image>
              <TouchableOpacity style={styles.view_ic_change_photo}>
                <Image
                  style={styles.ic_change_photo}
                  source={require("../../../assets/image/ic_change_photo.png")}
                ></Image>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>Nama Lengkap</Text>
            <TextInput
              style={styles.text_input}
              placeholder="Nama Lengkap"
              value={this.state.name}
              onChangeText={(name) => this.setState({ name })}
            ></TextInput>

            <Text style={styles.title}>Email</Text>
            <TextInput
              style={styles.text_input}
              placeholder="Email"
              value={this.state.email}
              onChangeText={(email) => this.setState({ email })}
            ></TextInput>

            <Text style={styles.title}>No Handphone</Text>
            <TextInput
              style={styles.text_input}
              placeholder="No Handphone"
              value={this.state.phone}
              onChangeText={(phone) => this.setState({ phone })}
            ></TextInput>

            <Text style={styles.title}>Password Lama</Text>
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
            ></TextInput>

            <TouchableOpacity style={styles.button_primary}>
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
    paddingTop: verticalScale(18),
    // backgroundColor: "#A80002",
  },
  text_header: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
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
    width: moderateScale(24),
    height: moderateScale(24),
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
    // backgroundColor: "#A80002",
    justifyContent: "center",
    alignItems: "center",
  },
  photo_profile: {
    width: verticalScale(173),
    height: verticalScale(173),
    resizeMode: "stretch",
  },
  view_photo_profil: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: verticalScale(170),
    height: verticalScale(170),
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 85,
    bottom: verticalScale(-50),
  },
  button_primary: {
    height: verticalScale(40),
    width: "100%",
    backgroundColor: "#A80002",
    borderRadius: 20,
    marginTop: verticalScale(12),
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
});
export default EditProfile;
