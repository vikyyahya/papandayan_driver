import React, { Component } from "react";
import { moderateScale, verticalScale } from "../../../util/ModerateScale";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Header from "../../Header";
import { saveData } from "../../../util/AsyncStorage";
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
  ScrollView,
  FlatList,
} from "react-native";
import { Icon } from "native-base";
const { width, height } = Dimensions.get("window");

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
  },
];

class ListOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0,
      selectedId: "",
    };
  }
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", async () => {
      saveData("SENDER_ADDRESS", null);
      saveData("RECEIVER_ADDRESS", null);
      saveData("COLLECTOR_ADDRESS", null);
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }

  gotoDropOff() {
    this.props.navigation.navigate("DropOff");
  }
  gotoPickUp() {
    this.props.navigation.navigate("PickUp");
  }

  renderItem() {}

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={"light-content"} backgroundColor="#A80002" />
        <Header></Header>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginVertical: verticalScale(10),
          }}
        >
          <TouchableOpacity
            style={styles.icon_left_arrow}
            onPress={() => this.props.navigation.goBack()}
          >
            <Image
              style={styles.icon_left_arrow}
              source={require("../../../assets/image/left_arrow_black.png")}
            ></Image>
          </TouchableOpacity>

          <Text style={styles.text_header}>0930.15032021</Text>
        </View>

        <View style={styles.container}>
          <View style={styles.content}>
            <View
              style={{
                flexDirection: "row",
                borderRadius: moderateScale(12),
                backgroundColor: "#FFFFFF",
                alignItems: "center",
                paddingHorizontal: moderateScale(5),
              }}
            >
              <Image
                style={{ width: moderateScale(25), height: moderateScale(25) }}
                source={require("../../../assets/image/ic_search.png")}
              ></Image>

              <TextInput placeholder="Cari Order"></TextInput>
            </View>

            <View
              style={{
                flexDirection: "row",
                borderRadius: moderateScale(12),
                backgroundColor: "#FFFFFF",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: moderateScale(5),
                paddingVertical: verticalScale(8),
                marginTop: verticalScale(16),
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: verticalScale(16),
                }}
              >
                <Image
                  style={{
                    width: moderateScale(30),
                    height: moderateScale(30),
                  }}
                  source={require("../../../assets/image/ic_box_red.png")}
                ></Image>

                <View style={{ marginHorizontal: moderateScale(10) }}>
                  <Text style={styles.text_10}>Total Order</Text>
                  <Text style={styles.text_18_bold}>12</Text>
                </View>
              </View>

              <View
                style={{
                  width: 1,
                  backgroundColor: "#E2E2E2",
                  height: "80%",
                  marginHorizontal: moderateScale(3),
                }}
              ></View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: verticalScale(16),
                }}
              >
                <Image
                  style={{
                    width: moderateScale(30),
                    height: moderateScale(30),
                  }}
                  source={require("../../../assets/image/ic_volume.png")}
                ></Image>

                <View style={{ marginHorizontal: moderateScale(10) }}>
                  <Text style={styles.text_10}>Volume (M3)</Text>
                  <Text style={styles.text_18_bold}>96,3</Text>
                </View>
              </View>

              <View
                style={{
                  width: 1,
                  backgroundColor: "#E2E2E2",
                  height: "80%",
                  marginHorizontal: moderateScale(3),
                }}
              ></View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: verticalScale(16),
                }}
              >
                <Image
                  style={{
                    width: moderateScale(30),
                    height: moderateScale(30),
                  }}
                  source={require("../../../assets/image/ic_berat.png")}
                ></Image>

                <View style={{ marginHorizontal: moderateScale(10) }}>
                  <Text style={styles.text_10}>Berat (Kg)</Text>
                  <Text style={styles.text_18_bold}>782,3</Text>
                </View>
              </View>
            </View>

            <FlatList
              data={DATA}
              renderItem={this.renderItem()}
              keyExtractor={(item) => item.id}
              extraData={this.state.selectedId}
            />

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("DetailOrder")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: verticalScale(10),
                marginTop: verticalScale(20),
              }}
            >
              <View>
                <Text>34000912</Text>
                <Text style={[styles.text_title_12, { color: "#8D8F92" }]}>
                  Suryadi 081234567890
                </Text>
                <Text style={[styles.text_title_12, { color: "#8D8F92" }]}>
                  Perum Suryadadi B13, Jl. Petogogan IX ...{" "}
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
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("DetailOrder")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: verticalScale(10),
              }}
            >
              <View>
                <Text>34000913</Text>
                <Text style={[styles.text_title_12, { color: "#8D8F92" }]}>
                  Bagoes 081134567890{" "}
                </Text>
                <Text style={[styles.text_title_12, { color: "#8D8F92" }]}>
                  Perum Suryadadi B13, Jl. Petogogan IX ...{" "}
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
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("DetailOrder")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: verticalScale(10),
              }}
            >
              <View>
                <Text>34000913</Text>
                <Text style={[styles.text_title_12, { color: "#8D8F92" }]}>
                  Bagoes 081134567890{" "}
                </Text>
                <Text style={[styles.text_title_12, { color: "#8D8F92" }]}>
                  Perum Suryadadi B13, Jl. Petogogan IX ...{" "}
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
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#F1F1F1",
  },
  content: {
    width: width,
    paddingRight: moderateScale(20),
    paddingLeft: moderateScale(20),
    paddingBottom: verticalScale(20),
    paddingTop: verticalScale(20),
  },
  icon_check: {
    width: moderateScale(17),
    height: moderateScale(17),
    resizeMode: "stretch",
    marginRight: moderateScale(5),
  },
  icon_left_arrow: {
    position: "absolute",
    left: moderateScale(10),
    width: moderateScale(20),
    height: moderateScale(12),
    resizeMode: "stretch",
  },
  text_header: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },
  scrollview: {
    height: moderateScale(260),
  },
  header_home: {
    flexDirection: "row",
    height: verticalScale(60),
    width: "100%",
    backgroundColor: "#A80002",
  },
  home_banner: {
    height: moderateScale(260),
    width: width,
    resizeMode: "stretch",
  },
  logo_header: {
    width: verticalScale(35),
    height: verticalScale(40),
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
  view_logo_phone: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  paginationWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: verticalScale(10),
    width: width,
  },
  paginationDots: {
    height: 7,
    width: 7,
    borderRadius: 10 / 2,
    backgroundColor: "#A80002",
    marginLeft: 10,
  },
  view_banner: {
    height: verticalScale(250),
    width: width,
  },
  row_button: {
    marginTop: verticalScale(36),
    flexDirection: "row",
    marginBottom: verticalScale(30),
  },
  button_drop_off: {
    flex: 1,
    backgroundColor: "#A80002",
    height: verticalScale(45),
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    borderRightWidth: 0.5,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  button_pickup: {
    flex: 1,
    backgroundColor: "#A80002",
    height: verticalScale(45),
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderLeftWidth: 0.5,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  text_14: {
    color: "#FFFFFF",
    fontFamily: "Montserrat-Regular",
  },
  text_18: {
    textAlign: "left",
    fontFamily: "Montserrat-Regular",
  },
  text_12: {
    textAlign: "left",
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
  },
  text_12_bold: {
    textAlign: "left",
    fontFamily: "Montserrat-Bold",
    fontSize: 12,
  },
  text_10: {
    fontFamily: "Montserrat-Regular",
    fontSize: 10,
  },
  text_16: {
    textAlign: "left",
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
  },
  text_16_bold: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
  },
  text_18_bold: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },
  text_14_bold: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
  },
  view_accordion: {
    height: verticalScale(46),
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    marginTop: verticalScale(10),
    justifyContent: "center",
    padding: 10,
  },
  home_post: {
    height: verticalScale(100),
    width: "100%",
    backgroundColor: "grey",
    resizeMode: "cover",
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
    borderRadius: 12,
  },
  view_post: { flex: 1 },
  date_home_post: {
    fontSize: 9,
    fontFamily: "Montserrat-Regular",
  },
  description_home_post: {
    fontSize: 14,
  },
});

export default ListOrder;
