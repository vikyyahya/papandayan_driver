import React, { Component } from "react";
import Header from "../../Header";
import { moderateScale, verticalScale } from "../../../util/ModerateScale";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LOGIN_STATUS, TOKEN } from "../../../util/StringConstans";
import { getValue, saveData } from "../../../util/AsyncStorage";
import {
  getData,
  BASE_URL,
  PROFILE,
} from "../../../network/ApiService";
import { Loading } from "../../../util/Loading";

import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
const { width, height } = Dimensions.get("window");

class Profil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      name: "",
      email: "",
      phone: "",
      token: "",
      idSelected: "",
      data_address: [],
      data_address_receiver: [],
      data_address_sender: [],
      data_address_collector: [],
      isLoading: false,
      addressId: 0,

      modalVisible: false,
      modalVisibleProfile: false,
      message: "",
    };
  }

  async componentDidMount() {
    let token = await getValue(TOKEN);
    this.setLoading(true);
    await this.setState({ token });
    await this.getDataProfile();
  }

 

  async getDataProfile() {
    console.log("getDataProfile token ", this.state.token);

    await getData(BASE_URL + PROFILE, this.state.token).then((response) => {
      console.log("getDataProfile ", response);
      if (response.success == true) {
        let value = response.data;
        this.setState({ name: value.name });
        this.setState({ email: value.email });
        this.setState({ phone: value.phone });
        this.setLoading(false);
      } else if (response.code == 4001) {
        this.goLogout()
      } else if (response.message == "Unauthenticated.") {
        this.goLogout()

      }
    });
  }

  setLoading(data) {
    this.setState({ isLoading: data });
  }

  gotoEditProfile() {
    this.props.navigation.navigate("EditProfile");
  }
  goLogout() {
    saveData(TOKEN, "");
    saveData(LOGIN_STATUS, "0");
    this.props.navigation.replace("Login");
  }

  showConfirmLogout() {
    this.setState({
      message: "Ands yakin ingin menutup aplikasi?",
      modalVisible: true,
      modalVisibleProfile: false,
    });
  }

  onSelectAddress(id, value) {
    this.setState({ idSelected: id });
    this.setState({ data_address: value });
  }
  renderModal() {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          // onRequestClose={() => {
          //   Alert.alert("Modal has been closed.");
          // }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Konfirmasi</Text>
              <Text style={styles.modal_message}>{this.state.message}</Text>

              <TouchableOpacity
                style={{ ...styles.buttonYes }}
                onPress={() => this.goLogout()}
              >
                <Text style={styles.textStyle}>Ya</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ ...styles.openButton }}
                onPress={() => {
                  this.setState({ modalVisible: false });
                }}
              >
                <Text style={styles.textStyle}>Tidak</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  renderModalProfil() {
    return (
      <Modal
      animationType="fade"
      transparent={true}
      visible={this.state.modalVisibleProfile}>
      <TouchableOpacity
        onPress={() => {
          this.setState({modalVisibleProfile: false});
        }}
        style={{
          flex: 1,
          backgroundColor: 'rgba(52, 52, 52, 0.3)',
          alignItems: 'flex-end',
        }}>
        <TouchableWithoutFeedback>
          <View
            style={{
              width: moderateScale(130),
              height: moderateScale(100),
              marginHorizontal: moderateScale(20),
              marginVertical: moderateScale(70),
              backgroundColor: 'white',
              borderRadius: moderateScale(8),
              padding: moderateScale(10),
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
            <TouchableOpacity style={{marginVertical: verticalScale(5)}}>
              <Text>Tentang Aplikasi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.showConfirmLogout()}
              style={{marginVertical: verticalScale(5)}}>
              <Text>Keluar</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
 
    );
  }

  renderModalOptions() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(52, 52, 52, 0.7)",
        }}
      >
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalOption}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Konfirmasi</Text>
              <Text style={styles.modal_message}>{this.state.message}</Text>

              <TouchableOpacity
                style={{ ...styles.buttonYes }}
                onPress={() => this.deleteAddress()}
              >
                <Text style={styles.textStyle}>Ya</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ ...styles.openButton }}
                onPress={() => {
                  this.setState({ modalOption: false });
                }}
              >
                <Text style={styles.textStyle}>Tidak</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  renderAddress = ({ item, index }) => {
    item.isCheck = false;
    var address =
      item.street +
      ", " +
      item.village +
      ", " +
      item.district +
      ", " +
      item.city +
      ", " +
      item.province;
    console.log("actionCheck 3", this.state.data_address[index].isCheck);

    return (
      <View style={styles.view_options}>
        <Image
          style={styles.icon_location}
          source={require("../../../assets/image/icon_location.png")}
        ></Image>
        <View style={{ flex: 1 }}>
          <Text style={styles.text_10_bold}>{item.title}</Text>
          <Text style={styles.text_10}>{address}</Text>
        </View>
        <View style={styles.view_options_right}>
          <TouchableOpacity>
            <Image
              style={styles.icon_edit}
              source={require("../../../assets/image/edit.png")}
            ></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.actionDelete(item)}>
            <Image
              style={styles.icon_edit}
              source={require("../../../assets/image/del.png")}
            ></Image>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderHeaderBS() {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            backgroundColor: "grey",
            height: moderateScale(5),
            width: moderateScale(35),
            borderRadius: moderateScale(5),
          }}
        ></View>
        <View
          style={{
            flexDirection: "row",
            paddingTop: verticalScale(15),
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() =>
              this.onSelectAddress(0, this.state.data_address_sender)
            }
            style={{ flex: 1 }}
          >
            <Text
              style={
                this.state.idSelected == 0
                  ? styles.text_12_selected
                  : styles.text_12
              }
            >
              Alamat Pengirim
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.onSelectAddress(1, this.state.data_address_receiver)
            }
            style={{ flex: 1 }}
          >
            <Text
              style={
                this.state.idSelected == 1
                  ? styles.text_12_selected
                  : styles.text_12
              }
            >
              Data Penerima
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.onSelectAddress(2, this.state.data_address_collector)
            }
            style={{ flex: 1 }}
          >
            <Text
              style={
                this.state.idSelected == 2
                  ? styles.text_12_selected
                  : styles.text_12
              }
            >
              Alamat Penagihan
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header></Header>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.view_icon_left_arrow}
            onPress={() => this.props.navigation.goBack()}
          >
            <Image
              style={styles.icon_left_arrow}
              source={require("../../../assets/image/left_arrow_black.png")}
            ></Image>
          </TouchableOpacity>

          <Text style={styles.text_header}>Profile</Text>

          <TouchableOpacity
            onPress={() => this.setState({ modalVisibleProfile: true })}
            style={{
              position: "absolute",
              right: moderateScale(20),
              padding: moderateScale(8)
            }}
          >
            <View
              style={{
                backgroundColor: "#000000",
                width: 3,
                height: 3,
                margin: 2,
                borderRadius: 3.5,
              }}
            ></View>
            <View
              style={{
                backgroundColor: "#000000",
                width: 3,
                height: 3,
                margin: 2,
                borderRadius: 3.5,
              }}
            ></View>
            <View
              style={{
                backgroundColor: "#000000",
                width: 3,
                height: 3,
                margin: 2,
                borderRadius: 3.5,
              }}
            ></View>
          </TouchableOpacity>
        </View>
        <View style={styles.profil_picture}>
          <View style={styles.view_photo_profil}>
            <Image
              style={styles.photo_profile}
              source={require("../../../assets/image/img_profile.png")}
            ></Image>
          </View>
        </View>
        <View style={styles.content}>
          {this.renderModal()}
          {this.renderModalProfil()}
          <Text style={styles.text_title_20}>{this.state.name}</Text>
          {/* <Text style={styles.text_title_12_bold}>Customor Poin : 675</Text> */}
          <Text style={styles.text_title_12}>{this.state.email}</Text>
          <Text style={styles.text_title_12}>
            {this.state.phone == null ? "-" : this.state.phone}
          </Text>
          <TouchableOpacity
            style={styles.button_primary}
            onPress={() => this.gotoEditProfile()}
          >
            <Text style={styles.text_title_14}>UBAH</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.button_primary}
            onPress={() => this.goLogout()}
          >
            <Text style={styles.text_title_14}>Keluar</Text>
          </TouchableOpacity> */}
        </View>
       
        <Loading visible={this.state.isLoading}></Loading>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  content: {
    marginTop: verticalScale(70),
    justifyContent: "center",
    alignItems: "center",
    width: width,
    paddingRight: moderateScale(20),
    paddingLeft: moderateScale(20),
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: verticalScale(10),
    // backgroundColor: "#A80002",
  },
  text_header: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },
  text_title_20: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
    color: "#262F56",
    marginBottom: verticalScale(8),
  },
  text_title_12: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    color: "#8D8F92",
    marginBottom: verticalScale(8),
  },
  text_12: {
    fontSize: 10,
    fontFamily: "Montserrat-Regular",
    color: "#686868",
    textAlign: "center",
  },
  text_12_selected: {
    fontSize: 10,
    fontFamily: "Montserrat-Bold",
    color: "#A80002",
    textAlign: "center",
  },
  text_title_14: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "white",
  },
  text_title_12_bold: {
    fontSize: 12,
    fontFamily: "Montserrat-Bold",
    color: "#262F56",
    marginBottom: verticalScale(8),
  },
  icon_left_arrow: {
    position: "absolute",
    left: moderateScale(10),
    width: moderateScale(20),
    height: moderateScale(12),
    resizeMode: "stretch",
  },
  view_icon_left_arrow: {
    position: "absolute",
    left: moderateScale(10),
    width: moderateScale(30),
    height: moderateScale(30),
    top: verticalScale(16)
  },
  profil_picture: {
    width: "100%",
    height: verticalScale(150),
    // backgroundColor: "#A80002",
    justifyContent: "center",
    alignItems: "center",
  },
  photo_profile: {
    width: verticalScale(170),
    height: verticalScale(170),
    resizeMode: "stretch",
  },
  view_photo_profil: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: verticalScale(170),
    height: verticalScale(170),
    borderWidth: 5,
    borderColor: "white",
    borderRadius: verticalScale(85),
    bottom: verticalScale(-50),
  },
  button_primary: {
    height: verticalScale(40),
    width: "100%",
    backgroundColor: "#A80002",
    borderRadius: 20,
    marginTop: verticalScale(8),
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    backgroundColor: "green",
    flex: 1,
  },

  //
  view_options: {
    flexDirection: "row",
    height: verticalScale(95),
    backgroundColor: "#FFFFFF",
    marginTop: verticalScale(8),
    alignItems: "center",
    marginHorizontal: moderateScale(20),
  },
  icon_location: {
    height: verticalScale(19),
    width: verticalScale(21, 6),
    resizeMode: "stretch",
    marginHorizontal: moderateScale(10),
  },
  text_10_bold: {
    fontFamily: "Montserrat-Bold",
    fontSize: 10,
  },
  text_10: {
    fontFamily: "Montserrat-Regular",
    fontSize: 10,
    marginTop: verticalScale(8),
  },
  view_options_right: {
    flex: 0.5,
    // backgroundColor: "#A80002",
    flexDirection: "row",
    height: verticalScale(75),
    alignItems: "center",
    justifyContent: "center",
  },
  icon_check: {
    height: verticalScale(17),
    width: verticalScale(17),
    resizeMode: "stretch",
    margin: moderateScale(2),
  },
  icon_edit: {
    height: verticalScale(100),
    width: verticalScale(30),
    resizeMode: "stretch",
    margin: moderateScale(2),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52, 52, 52, 0.3)",
  },
  modalView: {
    width: moderateScale(250),
    height: moderateScale(180),
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    position: "absolute",
    bottom: 15,
    right: 12,
    // backgroundColor: "#A80002",
    // borderRadius: 5,
    padding: 10,
    // elevation: 2,
  },
  buttonYes: {
    position: "absolute",
    bottom: 15,
    right: 70,
    padding: 10,
  },
  textStyle: {
    color: "#A80002",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 10,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Montserrat-Bold",
  },
  modal_message: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Montserrat-Regular",
  },
  btn_select: {
    position: "absolute",
    width: width - moderateScale(40),
    borderRadius: 50,
    backgroundColor: "#A80002",
    height: verticalScale(40),
    alignItems: "center",
    justifyContent: "center",
    bottom: verticalScale(30),
    left: moderateScale(20),
  },
  txt_btn_select: {
    color: "white",
    fontFamily: "Montserrat-Regular",
    fontSize: moderateScale(14),
  },
});
export default Profil;
