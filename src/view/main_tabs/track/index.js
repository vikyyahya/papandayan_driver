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
import { color } from "react-native-reanimated";
const { width, height } = Dimensions.get("window");

class Track extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data_teacher: "",
      data_my_course: "",
    };
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header></Header>
        <View style={styles.header}>
          <Image
            style={styles.icon_left_arrow}
            source={require("../../../assets/image/left-arrow.png")}
          ></Image>
          <Text style={styles.text_header}>Lacak Kiriman Anda</Text>
        </View>
        <View
          style={[
            styles.content,
            {
              backgroundColor: "#A80002",
            },
          ]}
        >
          <Text style={[styles.text_title_9, { marginTop: 46 }]}>
            Nomor Resi / Nomor Booking / Nomor AWB
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginBottom: verticalScale(45),
              marginVertical: verticalScale(10),
            }}
          >
            <TextInput
              style={[styles.text_input, { flex: 1 }]}
              placeholder="Nomor Resi"
              value={this.state.name}
            ></TextInput>
            <View
              style={[
                styles.text_input,
                {
                  flex: 0.2,
                  marginLeft: moderateScale(16),
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Image
                style={styles.icon_barcode}
                source={require("../../../assets/image/barcode.png")}
              ></Image>
            </View>
          </View>
        </View>

        <View style={[styles.content]}>
          <Text
            style={[
              styles.text_title_18,
              { color: "#A80002", marginVertical: verticalScale(24) },
            ]}
          >
            Paket Anda
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
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

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: verticalScale(10),
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
              Terkirim
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
    width: width,
    paddingRight: moderateScale(20),
    paddingLeft: moderateScale(20),
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: verticalScale(18),
    backgroundColor: "#A80002",
  },
  icon_left_arrow: {
    position: "absolute",
    left: moderateScale(20),
    width: moderateScale(20),
    height: moderateScale(20),
    resizeMode: "stretch",
  },
  text_header: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
    color: "white",
  },
  text_title_9: {
    fontSize: 9,
    fontFamily: "Montserrat-Regular",
    color: "white",
  },
  text_title_18: {
    fontSize: 18,
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
  text_input: {
    backgroundColor: "white",
    borderRadius: moderateScale(12),
    marginTop: verticalScale(8),
    fontSize: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    fontFamily: "Montserrat-Regular",
    height: verticalScale(46),
  },
  icon_barcode: {
    width: moderateScale(42),
    height: verticalScale(29.6),
    resizeMode: "stretch",
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
export default Track;
