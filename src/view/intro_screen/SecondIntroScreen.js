import React, { Component } from "react";
import LinearGradient from "react-native-linear-gradient"; // import LinearGradient
import { moderateScale, verticalScale } from "../../util/ModerateScale";
import LogoRed from "../../assets/image/logo_red.svg";
import { Text, View, StyleSheet, Image, TextInput } from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

class SecondIntroScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}

  render() {
    return (
      <LinearGradient colors={["#FBFAF8", "#F0F0F0"]} style={styles.container}>
        <Image
          source={require("../../assets/image/img_intro02.png")}
          style={styles.logo_intro1}
        ></Image>
        <Image
          source={require("../../assets/image/logo_red.png")}
          style={styles.logo_intro}
        ></Image>
        <Text style={styles.text_bold_intro}>
          Lacak pengiriman paket jadi lebih mudah{" "}
        </Text>
        <Text style={styles.text_intro}>
          Sekarang Anda bisa melakukan tracking dari mana saja dan kapan saja
        </Text>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  logo_intro: {
    width: moderateScale(140),
    height: moderateScale(140),
    marginTop: responsiveHeight(8),
    resizeMode: "stretch",
  },
  logo_intro1: {
    position: "absolute",
    width: responsiveWidth(90),
    height: responsiveHeight(50),
    resizeMode: "stretch",
    top: responsiveHeight(42),
  },

  text_bold_intro: {
    marginTop: responsiveHeight(7),
    fontFamily: "Montserrat-Bold",
    fontSize: responsiveFontSize(2.5),
    alignContent: "center",
    alignItems: "center",
    marginHorizontal: responsiveWidth(18),
  },
  text_intro: {
    marginTop: moderateScale(8),
    fontFamily: "Montserrat-Regular",
    fontSize: responsiveFontSize(1.7),
    alignContent: "center",
    alignItems: "center",
    marginHorizontal: responsiveWidth(18),
    color: "#969CBA",
  },
});

export default SecondIntroScreen;
