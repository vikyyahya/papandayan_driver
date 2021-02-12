import React, { Component } from "react";
import Header from "../../Header";
import { moderateScale, verticalScale } from "../../../util/ModerateScale";
import {
  Dimensions,
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
const { width, height } = Dimensions.get("window");

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data_teacher: "",
      data_my_course: "",
    };
  }
  goBack() {
    this.props.navigation.goBack();
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header></Header>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.view_icon_left_arrow}
            onPress={() => this.goBack()}
          >
            <Image
              style={styles.icon_left_arrow}
              source={require("../../../assets/image/left-arrow-black.png")}
            ></Image>
          </TouchableOpacity>
          <Text style={styles.text_header}>History</Text>
        </View>
        <View style={styles.content}>
          <View
            style={{
              flexDirection: "row",
              marginVertical: verticalScale(24),
              justifyContent: "center",
            }}
          >
           
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View>
              <Text>PRK 1365 8834 FDE8</Text>
              <Text style={[styles.text_title_12, { color: "#8D8F92" }]}>
                Surabaya - Medan
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            ></View>
            <View style={styles.view_circle}></View>
            <Text
              style={[
                styles.text_title_14,
                {
                  color: "#717171",
                },
              ]}
            >
              Transit
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: verticalScale(10),
            }}
          >
            <View>
              <Text>GRK 0923 5411 HGP1</Text>
              <Text style={[styles.text_title_12, { color: "#8D8F92" }]}>
                Surabaya - Pontianak
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            ></View>
            <View style={styles.view_circle}></View>

            <Text
              style={[
                styles.text_title_14,
                {
                  color: "#717171",
                },
              ]}
            >
              Transit
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: verticalScale(10),
            }}
          >
            <View>
              <Text>OJK 0982 3423 RDA0</Text>
              <Text style={[styles.text_title_12, { color: "#8D8F92" }]}>
                Surabaya - Medan
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            ></View>
            <Image
              style={styles.icon_check}
              source={require("../../../assets/image/ic_check.png")}
            ></Image>
            <Text
              style={[
                styles.text_title_14,
                {
                  color: "#717171",
                },
              ]}
            >
              Terkirim
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    marginTop: verticalScale(24),
    width: width,
    paddingRight: moderateScale(20),
    paddingLeft: moderateScale(20),
    backgroundColor: "#F1F1F1",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: verticalScale(18),
  },
  view_icon_left_arrow: {
    position: "absolute",
    left: moderateScale(20),
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: "center",
  },
  icon_left_arrow: {
    position: "absolute",
    width: moderateScale(20),
    height: moderateScale(20),
    resizeMode: "stretch",
  },
  text_header: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },
  text_12: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  text_bold_12: {
    fontSize: 12,
    fontFamily: "Montserrat-Bold",
  },
  text_title_12: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  text_title_14: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
  icon_check: {
    width: moderateScale(17),
    height: moderateScale(17),
    resizeMode: "stretch",
    marginRight: moderateScale(5),
  },
  view_circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FED43B",
    marginRight: moderateScale(10),
  },
});
export default History;
