import React, { Component } from "react";
import Header from "../Header";
import moment from "moment";
import { moderateScale, verticalScale } from "../../util/ModerateScale";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  getData,
  BASE_URL,
  RECEIVER,
  deleteData,
} from "../../network/ApiService";
import { TOKEN } from "../../util/StringConstans";

import { getValue, saveData } from "../../util/AsyncStorage";

import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
const { width, height } = Dimensions.get("window");

class ReceiverAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",

      token: "",
      data_address: [],
      selected_address: {},
      isCheck: false,
      idSelected: "",
      isLoading: true,

      modalVisible: false,
      message: "",
      idSelectedAddress: "",

      isDatePickerVisible: false,
    };
  }

  async componentDidMount() {
    let token = await getValue(TOKEN);
    await this.setState({
      token: token,
      selected_address: this.props.route.params.sender_address,
    });
    this.getDataSender();

    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      console.log("isFocused _unsubscribe", " ==");
      this.getDataSender();

      // do something
    });
    // console.log("comp returnaddress", this.props.route.params);
    // console.log("comp returnaddress", this.state.selected_address);
  }
  componentDidCatch() {
    console.log("componentDidCatch", " ==");
  }
  componentDidUpdate() {
    console.log("componentDidUpdate", " ==");
  }
  componentWillUnmount() {
    console.log("componentWillUnmount", " ==");
    this._unsubscribe();
  }

  async getDataSender() {
    this.setState({ isLoading: true });
    await getData(BASE_URL + RECEIVER, this.state.token).then((response) => {
      console.log("getDataSender", response);

      if (response.success == true) {
        let value = response.data;
        this.setState({ data_address: value, isLoading: false });
      }
    });
  }

  goBack() {
    // this.props.navigation.goBack();
    this.props.navigation.navigate("PickUp");
  }
  goForm() {
    this.props.navigation.navigate("FormReceiverAddress");
  }

  async actionCheck(data, index) {
    console.log("actionCheck", data + " " + index);
    console.log("actionCheck 2", this.state.data_address[index].isCheck);
    await this.setState({ idSelected: data.id, selected_address: data });
    var dataSender = {
      sender_address: this.state.selected_address,
    };
    await saveData("RECEIVER_ADDRESS", dataSender);
    // this.goBack();
  }

  async deleteAddress(item) {
    this.setState({ modalVisible: false });
    await this.setState({ isLoading: true });

    await deleteData(
      BASE_URL + RECEIVER + "/" + this.state.idSelectedAddress,
      this.state.token
    ).then((response) => {
      console.log("deleteAddress", response);

      if (response.success == true) {
        let value = response.data;
        this.setState({ modalVisible: false });
        this.getDataSender();
      } else if (response.message == "Unauthenticated.") {
        this.props.navigation.replace("Login");
      }
    });
  }

  async actionDelete(data) {
    this.setState({ message: "Apakah yakin ingin menghapus data ini?" });
    this.setState({ modalVisible: true });
    await this.setState({ idSelectedAddress: data.id });

    // this.deleteAddress();
  }

  onSelected() {
    this.props.navigation.navigate("PickUp");
  }
  actionEdit(data) {
    this.props.navigation.navigate("EditFormReceiverAddress", { data: data });
  }

  renderModal() {
    return (
      <View style={styles.centeredView}>
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
          source={require("../../assets/image/icon_location.png")}
        ></Image>
        <View style={{ flex: 1 }}>
          <Text style={styles.text_10_bold}>{item.title}</Text>
          <Text style={styles.text_10}>{address}</Text>
        </View>
        <View style={styles.view_options_right}>
          <TouchableOpacity onPress={() => this.actionEdit(item)}>
            <Image
              style={styles.icon_edit}
              source={require("../../assets/image/edit.png")}
            ></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.actionDelete(item)}>
            <Image
              style={styles.icon_edit}
              source={require("../../assets/image/del.png")}
            ></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.actionCheck(item, index)}>
            {this.state.idSelected == item.id ? (
              <Image
                style={styles.icon_check}
                source={require("../../assets/image/ic_check.png")}
              ></Image>
            ) : (
              <Image
                style={styles.icon_check}
                source={require("../../assets/image/ic_uncheck.png")}
              ></Image>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };
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
              source={require("../../assets/image/left-arrow-black.png")}
            ></Image>
          </TouchableOpacity>

          <Text style={styles.text_header}>Alamat Penerima</Text>
        </View>
        <View style={styles.content}>
          {this.renderModal()}

          <FlatList
            extraData={this.state.idSelected}
            data={this.state.data_address}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderAddress}
          ></FlatList>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: verticalScale(40),
            }}
            onPress={() => this.goForm()}
          >
            <Image
              style={styles.asset_icon_plus}
              source={require("../../assets/image/ic_plus.png")}
            ></Image>
            <Text style={styles.text_12}>tambah data penerima</Text>
          </TouchableOpacity>
        </View>
        {this.state.isLoading && (
          <ActivityIndicator
            style={{
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              position: "absolute",
              backgroundColor: "rgba(52, 52, 52, 0.3)",
            }}
            size="large"
            color="#A80002"
          />
        )}
        <TouchableOpacity
          style={styles.btn_select}
          onPress={() => this.onSelected()}
        >
          <Text style={styles.txt_btn_select}>PILIH</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(18),
    marginBottom: verticalScale(18),
  },
  text_header: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },
  text_12: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    color: "#686868",
  },
  view_icon_left_arrow: {
    position: "absolute",
    left: moderateScale(20),
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: "center",
  },
  asset_icon_plus: {
    height: verticalScale(12),
    width: verticalScale(12),
    resizeMode: "stretch",
    marginRight: 10,
  },
  icon_left_arrow: {
    position: "absolute",
    width: moderateScale(20),
    height: moderateScale(20),
    resizeMode: "stretch",
  },
  content: {
    width: width,
    paddingRight: moderateScale(20),
    paddingLeft: moderateScale(20),
  },
  text_pickup: {
    marginTop: 24,
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
  },
  view_armada: {
    flexDirection: "row",
  },
  view_options: {
    flexDirection: "row",
    height: verticalScale(95),
    backgroundColor: "#FFFFFF",
    marginTop: verticalScale(8),
    alignItems: "center",
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

  //
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
export default ReceiverAddress;
