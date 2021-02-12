import AppIntroSlider from "react-native-app-intro-slider";
import React, { Component } from "react";
import FirstIntroScreen from "./FirstIntroScreen";
import SecondIntroScreen from "./SecondIntroScreen";
import ThirdIntroScreen from "./ThirdIntroScreen";
import { moderateScale, verticalScale } from "../../util/ModerateScale";
import { saveData } from "../../util/AsyncStorage";
import * as constans from "../../util/StringConstans";

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");

class IntroScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0,
    };
  }
  componentDidMount() {
    this.gotoLogin();
  }
  handleScroll(event) {
    var x = parseInt(event.nativeEvent.contentOffset.x);
    var w = parseInt(Dimensions.get("window").width);

    //check index
    if (x == 0) {
      this.setState({ pageIndex: 0 });
    } else {
      var i = x / w;
      this.setState({ pageIndex: Math.round(i) });
    }
  }

  gotoLogin() {
    this.props.navigation.navigate("Login");
    saveData(constans.INTRO_SCREEN, constans.INTRO_SCREEN);
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={"dark-content"} backgroundColor="#FBFAF8" />

        <ScrollView
          pagingEnabled
          horizontal
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => this.handleScroll(e)}
          scrollEventThrottle={4}
        >
          <View style={{ width, height }}>
            <FirstIntroScreen></FirstIntroScreen>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  paginationWrapper: {
    position: "absolute",
    bottom: responsiveHeight(9),
    left: responsiveWidth(10),
    right: 0,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  skipWrapper: {
    position: "absolute",
    bottom: responsiveHeight(9),
    right: responsiveWidth(10),
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  paginationDots: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    backgroundColor: "#C63234",
    marginLeft: 10,
  },
  textPrimer: {
    color: "#E21C1C",
    fontSize: moderateScale(12),
    marginTop: 5,
    fontFamily: "Montserrat-Regular",
  },
});

export default IntroScreen;
