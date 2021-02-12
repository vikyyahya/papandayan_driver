import React, { Component } from "react";
import LinearGradient from "react-native-linear-gradient"; // import LinearGradient
import { moderateScale, verticalScale } from "../../util/ModerateScale";
import {
  Text,
  View,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { getValue, removeValue } from "../../util/AsyncStorage";
import * as constans from "../../util/StringConstans";
import FirstIntroScreen from "../intro_screen/FirstIntroScreen";
const { width, height } = Dimensions.get("window");

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      showSpinner: false,
      message: "",
    };
  }
  componentDidMount() {
    if (Platform.OS == "android") {
      setTimeout(() => {
        this.checkStatusApp();
      }, 2000);
    }
  }

  async checkStatusApp() {
    // removeValue(constans.INTRO_SCREEN);
    let isIntro = await getValue(constans.INTRO_SCREEN);
    let isLogin = await getValue(constans.LOGIN_STATUS);
    if (isIntro == constans.INTRO_SCREEN) {
      if (isLogin == "1") {
        this.props.navigation.replace("MainTabs");
      } else {
        this.props.navigation.replace("Login");
      }
    } else {
      this.props.navigation.replace("IntroScreen");
    }
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

export default SplashScreen;
