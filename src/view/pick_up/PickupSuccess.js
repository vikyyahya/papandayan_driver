import React, { Component } from "react";
import Header from "../Header";
import moment from "moment";
import { moderateScale, verticalScale } from "../../util/ModerateScale";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CheckBox from "@react-native-community/checkbox";
import { Picker } from "@react-native-picker/picker";
import { getValue, saveData } from "../../util/AsyncStorage";
import { TOKEN } from "../../util/StringConstans";

import {
  postData,
  getData,
  BASE_URL,
  PROVINCES,
  CITIES,
  DISTRICTS,
  VILLAGES,
  SENDER,
} from "../../network/ApiService";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  SafeAreaView,
  Modal,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
const { width, height } = Dimensions.get("window");

class PickupSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
    };
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header></Header>
        <View style={styles.content}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              fontFamily: "Montserrat-Bold",
            }}
          >
            Hore!
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: 14,
              fontFamily: "Montserrat-Regular",
              paddingHorizontal: moderateScale(40),
            }}
          >
            Permintaan Pick Up kamu sedang di proses dan petugas kami akan
            datang ke alamat penjemputan.
          </Text>
          <Image
            style={{
              height: moderateScale(150),
              width: width - moderateScale(60),
              resizeMode: "stretch",
              marginTop: verticalScale(20),
            }}
            source={require("../../assets/image/img_pickup_success.png")}
          ></Image>
          <TouchableOpacity
            style={[styles.button_primary, { marginTop: verticalScale(45) }]}
            onPress={() => this.props.navigation.replace("MainTabs")}
          >
            <Text style={styles.text_title_14}>OK</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  text_header: {
    fontFamily: "Montserrat-Bold",
    fontSize: moderateScale(17),
  },
  icon_left_arrow: {
    position: "absolute",
    width: moderateScale(20),
    height: moderateScale(20),
    resizeMode: "stretch",
  },
  content: {
    flex: 1,
    paddingRight: moderateScale(20),
    paddingLeft: moderateScale(20),
    paddingBottom: verticalScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  button_primary: {
    height: verticalScale(40),
    width: width - moderateScale(40),
    backgroundColor: "#A80002",
    borderRadius: 20,
    marginTop: verticalScale(20),
    justifyContent: "center",
    alignItems: "center",
    alignItems: "center",
  },
  text_title_14: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "white",
  },
});

export default PickupSuccess;
