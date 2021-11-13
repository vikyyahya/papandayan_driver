import React, { Component } from "react";
import { moderateScale, verticalScale } from "../util/ModerateScale";
import {
  TouchableOpacity,
  Linking,
  View,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  callNumber() {
    Linking.openURL(`tel:${"0213456789"}`);
  }

  render() {
    return (
      <View style={styles.header_home}>
        <View style={{ flex: 1 }}>
          <Image
            source={require("../assets/image/Logo_ppd.png")}
            style={styles.logo_header}
          ></Image>
        </View>

        {/* <View style={styles.view_logo_phone}>
          <Image
            source={require("../assets/image/ic_bantuan.png")}
            style={styles.logo_header_help}
          ></Image>
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header_home: {
    flexDirection: "row",
    height: verticalScale(50),
    width: "100%",
    backgroundColor: "#F1F1F1",
  },

  logo_header: {
    width: verticalScale(30),
    height: verticalScale(33),
    marginHorizontal: moderateScale(24),
    marginVertical: verticalScale(10),
    resizeMode: "stretch",
  },
  logo_header_phone: {
    width: verticalScale(24),
    height: verticalScale(24),
    marginHorizontal: moderateScale(24),
    resizeMode: "stretch",
    marginVertical: verticalScale(15),
  },
  logo_header_help: {
    width: verticalScale(42),
    height: verticalScale(24),
    resizeMode: "stretch",
    marginVertical: verticalScale(15),
  },
  view_logo_phone: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: moderateScale(10),
  },
});

export default Header;
