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
  Modal,
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

class DetailOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0,
      modalVisible: false,
      selectedId: "",
      reason: "",
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

  renderModal() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={[styles.text_14, { color: "#A80002", fontWeight: "bold" }]}
            >
              Alasan Pembatalan
            </Text>

            <View
              style={{
                borderColor: "grey",
                borderRadius: 10,
                marginTop: verticalScale(10),
                backgroundColor: "#F0F0F0",
              }}
            >
              <TextInput
                multiline={true}
                numberOfLines={6}
                value={this.state.reason}
                onChangeText={(v) => this.setState({ reason: v })}
              ></TextInput>
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: verticalScale(16),
              }}
            >
              <TouchableOpacity
                onPress={() => this.setState({ modalVisible: false })}
                style={{
                  backgroundColor: "#A80002",
                  paddingHorizontal: moderateScale(30),
                  paddingVertical: moderateScale(10),
                  borderRadius: moderateScale(50),
                }}
              >
                <Text
                  style={[
                    styles.text_14,
                    { color: "#FFFFFF", fontWeight: "bold" },
                  ]}
                >
                  SUBMIT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

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

          <Text style={styles.text_header}>No. Order 34000912</Text>
        </View>

        <View style={styles.container}>
          <View
            style={{
              width: width - moderateScale(40),
              padding: moderateScale(16),
              backgroundColor: "#FFFFFF",
              borderRadius: moderateScale(12),
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.text_10}>Nama Pelanggan</Text>
                <Text style={styles.text_16}>Suryadi</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.text_10}>Nama Pelanggan</Text>
                <Text style={styles.text_16}>08953618918290</Text>
              </View>
            </View>
            <Text
              style={[
                styles.text_10,
                {
                  marginTop: verticalScale(16),
                  marginBottom: verticalScale(5),
                },
              ]}
            >
              Alamat Pengimputan
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[styles.text_16, { flex: 1 }]}>
                Perum Suryadadi B13, Jl. Petogogan IX RT 002 RW 002, Kelurahan
                Genting Kalianak, Kecamatan Asemrowo, Surabaya
              </Text>
              <TouchableOpacity>
                <Image
                  style={{
                    width: moderateScale(40),
                    height: moderateScale(40),
                    resizeMode: "stretch",
                  }}
                  source={require("../../../assets/image/ic_location_map.png")}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{ flexDirection: "row", marginTop: verticalScale(16) }}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.text_10}>APD</Text>
                <Text style={styles.text_16}>12-01-2021</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.text_10}>Tujuan</Text>
                <Text style={styles.text_16}>Makasar</Text>
              </View>
            </View>
            <View
              style={{ flexDirection: "row", marginTop: verticalScale(16) }}
            >
              <Text style={[styles.text_10, { flex: 1 }]}>Nama barang</Text>
              <Text style={[styles.text_10, { flex: 0.6 }]}>Jumlah</Text>
              <Text style={[styles.text_10, { flex: 0.6 }]}>Berat Total</Text>
              <Text style={[styles.text_10, { flex: 0.8 }]}>Req Layanan</Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: verticalScale(8) }}>
              <Text style={[styles.text_10, { flex: 1 }]}>Sepatu Olahraga</Text>
              <Text style={[styles.text_10, { flex: 0.6 }]}>10 psg</Text>
              <Text style={[styles.text_10, { flex: 0.6 }]}>15 Kg</Text>
              <Text style={[styles.text_10, { flex: 0.8 }]}>Kayu</Text>
            </View>
            <View style={styles.line}></View>
            <View style={{ flexDirection: "row", marginTop: verticalScale(8) }}>
              <Text style={[styles.text_10, { flex: 1 }]}>Sepatu Olahraga</Text>
              <Text style={[styles.text_10, { flex: 0.6 }]}>10 psg</Text>
              <Text style={[styles.text_10, { flex: 0.6 }]}>15 Kg</Text>
              <Text style={[styles.text_10, { flex: 0.8 }]}>Kayu</Text>
            </View>
            <View style={styles.line}></View>
            <View style={{ flexDirection: "row", marginTop: verticalScale(8) }}>
              <Text style={[styles.text_10, { flex: 1 }]}>Motor</Text>
              <Text style={[styles.text_10, { flex: 0.6 }]}>1 pcs</Text>
              <Text style={[styles.text_10, { flex: 0.6 }]}>1 Unit</Text>
              <Text style={[styles.text_10, { flex: 0.8 }]}></Text>
            </View>
            <View style={styles.line}></View>
          </View>
        </View>
        {this.renderModal()}
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: moderateScale(20),
            position: "absolute",
            bottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => this.setState({ modalVisible: true })}
            style={[
              styles.button_primary,
              {
                flex: 1,
                marginRight: moderateScale(10),
                backgroundColor: "#262F56",
              },
            ]}
          >
            <Text style={[styles.text_14, { color: "#FFFFFF" }]}>BATAL</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button_primary,
              { flex: 1, marginLeft: moderateScale(10) },
            ]}
          >
            <Text style={[styles.text_14, { color: "#FFFFFF" }]}>PICK UP</Text>
          </TouchableOpacity>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(38, 47, 86, 0.9)",
  },
  modalView: {
    width: width - moderateScale(64),
    // height: moderateScale(180),
    backgroundColor: "white",
    borderRadius: 12,
    padding: verticalScale(15),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button_primary: {
    height: verticalScale(40),
    width: width / 3,
    backgroundColor: "#A80002",
    borderRadius: 20,
    marginTop: verticalScale(8),
    justifyContent: "center",
    alignItems: "center",
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
  line: {
    width: "100%",
    height: 0.5,
    backgroundColor: "grey",
    marginTop: verticalScale(10),
  },
  text_14: {
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

export default DetailOrder;
