import React, { Component } from "react";
import Header from "../../Header";
import { moderateScale, verticalScale } from "../../../util/ModerateScale";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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

class Rates extends Component {
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
        <KeyboardAwareScrollView
          enableResetScrollToCoords={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
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
            <Text style={styles.text_header}>Notifikasi</Text>
          </View>
       
          <View style={styles.content}>
            {/* <TouchableOpacity
              style={styles.button_primary}
              // onPress={() => this.gotoEditProfile()}
            >
              <Text style={styles.text_title_14}>CEK TARIF</Text>
            </TouchableOpacity> */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: verticalScale(10),
              }}
            >
              <View style={styles.icon_armada}>
                <Image
                  style={styles.asset_icon_armada}
                  source={require("../../../assets/image/icon_regular.png")}
                ></Image>
                <Text style={styles.asset_text_armada}>REGULER</Text>
              </View>
              <Text style={styles.text_title_12}>
                Pengiriman melalui jalur laut (Reguler)
              </Text>
            </View>
            <View
              style={{ height: verticalScale(160), backgroundColor: "white" }}
            >
              <View style={{ flexDirection: "row", padding: 12 }}>
                <Text style={[styles.text_10, { flex: 1 }]}>Kota Tujuan</Text>
                <Text style={[styles.text_bold_10, { flex: 1 }]}>Bandung</Text>
              </View>
              <View style={{ height: 1, backgroundColor: "#F1F1F1" }}></View>
              <View style={{ flexDirection: "row", padding: 12 }}>
                <Text style={[styles.text_10, { flex: 1 }]}>Tarif / Kg</Text>
                <Text style={[styles.text_bold_10, { flex: 1 }]}>
                  Rp 1.500,-
                </Text>
              </View>
              <View style={{ height: 1, backgroundColor: "#F1F1F1" }}></View>
              <View style={{ flexDirection: "row", padding: 12 }}>
                <Text style={[styles.text_10, { flex: 1 }]}>
                  Minimum Charge
                </Text>
                <Text style={[styles.text_bold_10, { flex: 1 }]}>
                  50 Kg pertama Rp 150.000,-
                </Text>
              </View>
              <View style={{ height: 1, backgroundColor: "#F1F1F1" }}></View>
              <View style={{ flexDirection: "row", padding: 12 }}>
                <Text style={[styles.text_10, { flex: 1 }]}>
                  Estimasi Waktu
                </Text>
                <Text style={[styles.text_bold_10, { flex: 1 }]}>7 hari</Text>
              </View>
              <View style={{ height: 1, backgroundColor: "#F1F1F1" }}></View>
            </View>
            {/* */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: verticalScale(39),
              }}
            >
              <View style={styles.icon_armada}>
                <Image
                  style={styles.asset_icon_armada}
                  source={require("../../../assets/image/icon_regular.png")}
                ></Image>
                <Text style={styles.asset_text_armada}>REGULER</Text>
              </View>
              <Text style={styles.text_title_12}>
                Pengiriman melalui jalur laut (Express)
              </Text>
            </View>
            <View
              style={{ height: verticalScale(160), backgroundColor: "white" }}
            >
              <View style={{ flexDirection: "row", padding: 12 }}>
                <Text style={[styles.text_10, { flex: 1 }]}>Kota Tujuan</Text>
                <Text style={[styles.text_bold_10, { flex: 1 }]}>Bandung</Text>
              </View>
              <View style={{ height: 1, backgroundColor: "#F1F1F1" }}></View>
              <View style={{ flexDirection: "row", padding: 12 }}>
                <Text style={[styles.text_10, { flex: 1 }]}>Tarif / Kg</Text>
                <Text style={[styles.text_bold_10, { flex: 1 }]}>
                  Rp 1.500,-
                </Text>
              </View>
              <View style={{ height: 1, backgroundColor: "#F1F1F1" }}></View>
              <View style={{ flexDirection: "row", padding: 12 }}>
                <Text style={[styles.text_10, { flex: 1 }]}>
                  Minimum Charge
                </Text>
                <Text style={[styles.text_bold_10, { flex: 1 }]}>
                  50 Kg pertama Rp 150.000,-
                </Text>
              </View>
              <View style={{ height: 1, backgroundColor: "#F1F1F1" }}></View>
              <View style={{ flexDirection: "row", padding: 12 }}>
                <Text style={[styles.text_10, { flex: 1 }]}>
                  Estimasi Waktu
                </Text>
                <Text style={[styles.text_bold_10, { flex: 1 }]}>4 hari</Text>
              </View>
              <View style={{ height: 1, backgroundColor: "#F1F1F1" }}></View>
            </View>

            {/* */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: verticalScale(39),
              }}
            >
              <View style={styles.icon_armada}>
                <Image
                  style={styles.asset_icon_armada}
                  source={require("../../../assets/image/icon_plane.png")}
                ></Image>
                <Text style={styles.asset_text_armada}>UDARA</Text>
              </View>
              <Text style={styles.text_title_12}>
                Pengiriman melalui jalur udara
              </Text>
            </View>
            <View
              style={{ height: verticalScale(160), backgroundColor: "white" }}
            >
              <View style={{ flexDirection: "row", padding: 12 }}>
                <Text style={[styles.text_10, { flex: 1 }]}>Kota Tujuan</Text>
                <Text style={[styles.text_bold_10, { flex: 1 }]}>Bandung</Text>
              </View>
              <View style={{ height: 1, backgroundColor: "#F1F1F1" }}></View>
              <View style={{ flexDirection: "row", padding: 12 }}>
                <Text style={[styles.text_10, { flex: 1 }]}>Tarif / Kg</Text>
                <Text style={[styles.text_bold_10, { flex: 1 }]}>
                  Rp 1.500,-
                </Text>
              </View>
              <View style={{ height: 1, backgroundColor: "#F1F1F1" }}></View>
              <View style={{ flexDirection: "row", padding: 12 }}>
                <Text style={[styles.text_10, { flex: 1 }]}>
                  Minimum Charge
                </Text>
                <Text style={[styles.text_bold_10, { flex: 1 }]}>
                  50 Kg pertama Rp 150.000,-
                </Text>
              </View>
              <View style={{ height: 1, backgroundColor: "#F1F1F1" }}></View>
              <View style={{ flexDirection: "row", padding: 12 }}>
                <Text style={[styles.text_10, { flex: 1 }]}>
                  Estimasi Waktu
                </Text>
                <Text style={[styles.text_bold_10, { flex: 1 }]}>4 hari</Text>
              </View>
              <View style={{ height: 1, backgroundColor: "#F1F1F1" }}></View>
            </View>

            {/* */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: verticalScale(39),
              }}
            >
              <View style={styles.icon_armada}>
                <Image
                  style={styles.asset_icon_armada}
                  source={require("../../../assets/image/icon_land.png")}
                ></Image>
                <Text style={styles.asset_text_armada}>UDARA</Text>
              </View>
              <Text style={styles.text_title_12}>
                Pengiriman melalui jalur darat
              </Text>
            </View>
            <View
              style={{ height: verticalScale(160), backgroundColor: "white" }}
            >
              <View style={{ flexDirection: "row", padding: 12 }}>
                <Text style={[styles.text_10, { flex: 1 }]}>Kota Tujuan</Text>
                <Text style={[styles.text_bold_10, { flex: 1 }]}>Bandung</Text>
              </View>
              <View style={{ height: 1, backgroundColor: "#F1F1F1" }}></View>
              <View style={{ flexDirection: "row", padding: 12 }}>
                <Text style={[styles.text_10, { flex: 1 }]}>Tarif / Kg</Text>
                <Text style={[styles.text_bold_10, { flex: 1 }]}>
                  Rp 1.500,-
                </Text>
              </View>
              <View style={{ height: 1, backgroundColor: "#F1F1F1" }}></View>
              <View style={{ flexDirection: "row", padding: 12 }}>
                <Text style={[styles.text_10, { flex: 1 }]}>
                  Minimum Charge
                </Text>
                <Text style={[styles.text_bold_10, { flex: 1 }]}>
                  50 Kg pertama Rp 150.000,-
                </Text>
              </View>
              <View style={{ height: 1, backgroundColor: "#F1F1F1" }}></View>
              <View style={{ flexDirection: "row", padding: 12 }}>
                <Text style={[styles.text_10, { flex: 1 }]}>
                  Estimasi Waktu
                </Text>
                <Text style={[styles.text_bold_10, { flex: 1 }]}>4 hari</Text>
              </View>
              <View style={{ height: 1, backgroundColor: "#F1F1F1" }}></View>
            </View>
          </View>
        </KeyboardAwareScrollView>
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
  button_primary: {
    height: verticalScale(40),
    width: width - moderateScale(40),
    backgroundColor: "#A80002",
    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",
  },
  text_title_14: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "white",
  },
  text_title_12: {
    fontSize: 12,
    fontFamily: "Montserrat-Bold",
    color: "#262F56",
  },
  icon_armada: {
    width: verticalScale(50),
    height: verticalScale(50),
    borderColor: "#A80002",

    borderRadius: 12,
    marginRight: verticalScale(8),
    justifyContent: "center",
    alignItems: "center",
  },
  asset_icon_armada: {
    height: verticalScale(20),
    width: verticalScale(30),
    resizeMode: "stretch",
  },
  asset_text_armada: {
    fontSize: 7,
    fontFamily: "Montserrat-Bold",
    color: "#A80002",
  },
  text_10: {
    fontFamily: "Montserrat-Regular",
    fontSize: 10,
  },
  text_bold_10: {
    fontFamily: "Montserrat-Bold",
    fontSize: 10,
  },
});
export default Rates;
