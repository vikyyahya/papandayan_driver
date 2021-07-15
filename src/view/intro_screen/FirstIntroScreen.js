import React, { Component } from "react";
import LinearGradient from "react-native-linear-gradient"; // import LinearGradient
import { moderateScale, verticalScale } from "../../util/ModerateScale";
import { Text, View, StyleSheet, Image, Dimensions } from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

class FirstIntroScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}

  render() {
    return (
      <LinearGradient colors={["#FBFAF8", "#F0F0F0"]} style={styles.container}>
        <Image
          source={require("../../assets/image/img_on_board.png")}
          style={styles.logo_intro1}
        ></Image>
        <Image
          source={require("../../assets/image/logo_red.png")}
          style={styles.logo_intro}
        ></Image>
        <View
          style={{
            position: "absolute",
            bottom: verticalScale(170),
          }}
        >
          <Text
            style={{
              color: "#686868",
              fontSize: moderateScale(25),
              fontStyle: "italic",
              marginTop: 0,
            }}
          >
            Aplikasi
          </Text>
          <Text
            style={{
              color: "#C63234",
              fontSize: moderateScale(40),
              fontStyle: "italic",
              marginLeft: moderateScale(40),
              marginTop: verticalScale(-10),
            }}
          >
            Driver
          </Text>
        </View>
          <Text>Version code 8</Text>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo_intro: {
    width: moderateScale(100),
    height: moderateScale(100),
    top: Dimensions.get("window").height / 6,
    resizeMode: "stretch",
    position: "absolute",
  },
  logo_intro1: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - verticalScale(200),
    resizeMode: "stretch",
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

export default FirstIntroScreen;
