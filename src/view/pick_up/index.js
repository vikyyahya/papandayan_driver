import React, { Component } from "react";
import Header from "../Header";
import moment from "moment";
import { moderateScale, verticalScale } from "../../util/ModerateScale";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getValue, saveData } from "../../util/AsyncStorage";
import { Loading } from "../../util/Loading";
import { ModalWarning, ModalSuccess } from "../../util/CustModal";
import { SvgUri } from "react-native-svg";
import BottomSheet from "react-native-bottomsheet-reanimated";

//redux
import { connect } from "react-redux";
import { addDataItems } from "../../redux/actions/inPickup";
import { dataPickup } from "../../redux/reducers/dataPickup";

import {
  postData,
  getData,
  BASE_URL,
  ALLUNIT,
  SERVICE,
  FLEET,
  PROMO,
  CALCULATE,
  SELECT_PROMO,
  PICKUP,
} from "../../network/ApiService";
import { TOKEN } from "../../util/StringConstans";

import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  SafeAreaView,
  Modal,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList,
  Alert,
} from "react-native";
const { width, height } = Dimensions.get("window");
const snapPoints = [0, height / 2, "70%", "100%"];

class PickUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      isSelected: true,
      isDatePickerVisible: false,
      token: "",
      unit: { id: "", name: "" },
      units: [],
      fleets: [],
      view_unit: "",
      view_service: "",
      services: [],
      typeModal: "",
      modalVisible: false,
      itemModal: [],
      type: "",
      promotions: [],
      dataItems: [
        // {
        //   unit_id: "",
        //   unit_label: "",
        //   service_id: "",
        //   service_label: "",
        //   name: "",
        //   unit_total: "",
        //   unit_count: "",
        // },
      ],
      dataItemsTemporary: {
        unit_id: "",
        unit_label: "",
        service_id: "",
        service_label: "",
        name: "",
        unit_total: "",
        unit_count: "",
      },
      calculates: [],
      dataCalculates: "",
      valueDiskon: 0,

      //data to pickup
      fleetId: "",
      promoId: null,
      name: "",
      phone: "",
      senderId: "",
      receiverId: "",
      debtorId: "",
      notes: "",
      picktime: "",
      origin: "",
      destination_city: "",
      destination_district: "",
      //

      toSender: false,
      toReceiver: false,

      sender_address: null,
      recieve_address: null,
      collector_address: null,

      isLoading: true,
      isModalWarning: false,
      isModalSuccess: false,
      indexFLeet: "",
      indexPromo: "",

      messageWarning: "",
    };
  }
  async componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener("focus", async () => {
      console.log("isFocused _unsubscribe", "index");
      await this.getDataStorage();
      setTimeout(() => {
        this.getShippingCostWhenFocus();
      }, 2500);
    });

    let token = await getValue(TOKEN);
    console.log("Token", token);

    await this.setState({ token: token });
    await this.getAllUnit();
    await this.getServices();
    await this.getFleets();
    await this.getPromo();
    await this.getDataStorage();
  }
  componentWillUnmount() {
    this._unsubscribe();
  }

  async getPromo() {
    await getData(BASE_URL + PROMO, this.state.token).then((response) => {
      if (response.success == true) {
        let value = response.data;
        this.setState({ promotions: value, isLoading: false });
        // this.setState({ picker: true });
      } else if (response.message == "Unauthenticated.") {
        this.props.navigation.replace("Login");
      }
    });
  }

  async getFleets() {
    await getData(BASE_URL + FLEET, this.state.token).then((response) => {
      if (response.success == true) {
        let value = response.data;
        this.setState({ fleets: value });

        // this.setState({ picker: true });
      } else if (response.message == "Unauthenticated.") {
        // this.props.navigation.replace("Login");
      }
    });
  }

  async getAllUnit() {
    await getData(BASE_URL + ALLUNIT, this.state.token).then((response) => {
      if (response.success == true) {
        let value = response.data;
        this.setState({ units: value });

        // this.setState({ picker: true });
      } else if (response.message == "Unauthenticated.") {
        // this.props.navigation.replace("Login");
      }
    });
  }

  async getServices() {
    await getData(BASE_URL + SERVICE, this.state.token).then((response) => {
      if (response.success == true) {
        let value = response.data;
        this.setState({ services: value });
        // this.setState({ picker: true });
      } else if (response.message == "Unauthenticated.") {
        // this.props.navigation.replace("Login");
      }
    });
  }
  async actionToSender() {
    await this.setState({ toSender: !this.state.toSender });
    if (this.state.toReceiver == true) {
      await this.setState({
        toReceiver: false,
      });
    }
    if (this.state.toSender == true) {
      this.setState({ collector_address: this.state.sender_address });
    }
  }

  async actionToReceiver() {
    await this.setState({ toReceiver: !this.state.toReceiver });
    if (this.state.toSender == true) {
      await this.setState({
        toSender: false,
      });
    }
    if (this.state.toReceiver == true) {
      await this.setState({
        collector_address:
          this.state.recieve_address != null
            ? this.state.recieve_address.sender_address
            : null,
      });
    }
    console.log("actionToReceiver", this.state.collector_address);
  }

  setLoading(data) {
    this.setState({ isLoading: data });
  }

  getDataStorage() {
    // COLLECTOR_ADDRESS
    getValue("SENDER_ADDRESS").then((response) => {
      if (response != null) {
        console.log("componentDidMount SENDER_ADDRESS", response);
        if (response != undefined || response != "") {
          this.setState({ sender_address: response });
        }
      } else {
        this.setState({ sender_address: null });
      }
    });
    getValue("RECEIVER_ADDRESS").then((response) => {
      if (response != null) {
        console.log("componentDidMount RECEIVER_ADDRESS", response);
        this.setState({ recieve_address: response });
      } else {
        this.setState({ recieve_address: null });
      }
    });
    getValue("COLLECTOR_ADDRESS").then((response) => {
      if (response != null) {
        console.log("componentDidMount COLLECTOR_ADDRESS", response);
        this.setState({ collector_address: response });
      } else {
        this.setState({ collector_address: null });
      }
    });
  }

  showDatePicker() {
    this.setState({ isDatePickerVisible: true });
  }
  handleConfirmDate(date) {
    var dt = moment(date).format("YYYY-MM-DD");

    this.setState({ isDatePickerVisible: false, picktime: dt });
  }

  goReturnAddress() {
    if (this.state.sender_address != null) {
      this.props.navigation.navigate("ReturnAddress", {
        sender_address: this.state.sender_address.sender_address,
      });
    } else {
      this.props.navigation.navigate("ReturnAddress", {
        sender_address: null,
        recieve_address: null,
      });
    }
  }

  goReceiverAddress() {
    if (this.state.sender_address != null) {
      this.props.navigation.navigate("ReceiverAddress", {
        sender_address: this.state.sender_address.sender_address,
      });
    } else {
      this.props.navigation.navigate("ReceiverAddress", {
        sender_address: null,
      });
    }
  }

  goCollectorAddress() {
    this.props.navigation.navigate("CollectorAddress");
  }

  goBack() {
    this.props.navigation.goBack();
  }

  addItems(data) {
    if (
      this.state.collector_address == null &&
      this.state.toReceiver == false &&
      this.state.toSender == false
    ) {
      this.setState({
        messageWarning: "Harap lengkapi alamat data penagihan",
        isModalWarning: true,
      });
    } else if (this.state.fleetId == "") {
      this.setState({
        messageWarning: "Harap pilih armada",
        isModalWarning: true,
      });
    } else if (this.state.picktime == "") {
      this.setState({
        messageWarning: "Harap isi jadwal pickup",
        isModalWarning: true,
      });
    } else if (this.state.name == "") {
      this.setState({
        messageWarning: "Harap masukkan nama",
        isModalWarning: true,
      });
    } else if (this.state.phone == "") {
      this.setState({
        messageWarning: "Harap isi nomor handphone",
        isModalWarning: true,
      });
    } else if (this.state.sender_address == null) {
      this.setState({
        messageWarning: "Harap lengkapi alamat data pengirim",
        isModalWarning: true,
      });
    } else if (this.state.recieve_address == null) {
      this.setState({
        messageWarning: "Harap lengkapi alamat data penerima",
        isModalWarning: true,
      });
    } else if (
      this.state.dataItems[this.state.index_selected].unit_total == "" &&
      this.state.dataItems[this.state.index_selected].unit_id == "" &&
      this.state.dataItems[this.state.index_selected].service_id == ""
    ) {
      this.setState({
        messageWarning: "Harap lengkapi Data Barang",
        isModalWarning: true,
      });
    } else if (
      this.state.collector_address == null &&
      this.state.toReceiver == false &&
      this.state.toSender == false
    ) {
      this.setState({
        messageWarning: "Harap lengkapi alamat data penagihan",
        isModalWarning: true,
      });
    } else {
      let dataItems = this.state.dataItems;
      var item = {
        unit_id: "",
        unit_label: "",
        service_id: "",
        service_label: "",
        name: "",
        unit_total: "",
        unit_count: "",
      };
      // dataItems.push(item);
      this.onOpenBottomSheetHandler(2);

      this.setState({ dataItems: dataItems });
      this.props.addDataItems(dataItems);
    }
  }

  async onSelectedUnit(value) {
    if (this.state.typeModal == "unit") {
      // var unit = value.name;
      // if (unit == "Kilogram") {
      //   unit = "Kg";
      // } else {
      //   var strThree = unit.substring(0, 3);
      //   unit = strThree;
      // }
      // const data = [...this.state.dataItems];
      // data[this.state.index_selected] = {
      //   ...data[this.state.index_selected],
      //   unit_label: unit,
      // };
      // data[this.state.index_selected] = {
      //   ...data[this.state.index_selected],
      //   unit_id: value.id,
      // };
      // await this.setState({ modalVisible: false, dataItems: data });
      // this.props.addDataItems(data);
      // if (
      //   this.state.dataItems[this.state.index_selected].unit_total != "" &&
      //   this.state.dataItems[this.state.index_selected].unit_id != "" &&
      //   this.state.dataItems[this.state.index_selected].service_id != ""
      // ) {
      //   this.getShippingCost();
      // }
      var data = { ...this.state.dataItemsTemporary };
      data = { ...data, unit_label: value.name };
      data = { ...data, unit_id: value.id };
      this.setState({ dataItemsTemporary: data, modalVisible: false });
    } else {
      // var unit = value.name;
      // const data = [...this.state.dataItems];
      // data[this.state.index_selected] = {
      //   ...data[this.state.index_selected],
      //   service_label: unit,
      // };
      // data[this.state.index_selected] = {
      //   ...data[this.state.index_selected],
      //   service_id: value.id,
      // };

      // await this.setState({ modalVisible: false, dataItems: data });
      // this.props.addDataItems(data);

      // if (
      //   this.state.dataItems[this.state.index_selected].unit_total != "" &&
      //   this.state.dataItems[this.state.index_selected].unit_id != "" &&
      //   this.state.dataItems[this.state.index_selected].service_id != ""
      // ) {
      //   this.getShippingCost();
      // }
      var data = { ...this.state.dataItemsTemporary };
      data = { ...data, service_label: value.name };
      data = { ...data, service_id: value.id };
      this.setState({ dataItemsTemporary: data, modalVisible: false });
    }
  }

  onSaveItem() {
    if (this.state.dataItemsTemporary.name == "") {
      this.setState({
        messageWarning: "Harap isi nama barang",
        isModalWarning: true,
      });
    } else if (this.state.dataItemsTemporary.unit_count == "") {
      this.setState({
        messageWarning: "Harap isi jumlah barang",
        isModalWarning: true,
      });
    } else if (this.state.dataItemsTemporary.unit_total == "") {
      this.setState({
        messageWarning: "Harap isi berat barang",
        isModalWarning: true,
      });
    } else if (this.state.dataItemsTemporary.unit_label == "") {
      this.setState({
        messageWarning: "Harap pilih satuan",
        isModalWarning: true,
      });
    } else if (this.state.dataItemsTemporary.service_label == "") {
      this.setState({
        messageWarning: "Harap pilih layanan",
        isModalWarning: true,
      });
    } else {
      let dataItems = this.state.dataItems;
      var item = this.state.dataItemsTemporary;
      dataItems.push(item);
      this.setState({ dataItems: dataItems });
      this.refs.BottomSheet.snapTo(0);
      var dataItemsTemporary = {
        unit_id: "",
        unit_label: "",
        service_id: "",
        service_label: "",
        name: "",
        unit_total: "",
        unit_count: "",
      };
      this.setState({ dataItemsTemporary: dataItemsTemporary });
      this.getShippingCost();
    }
  }

  deleteUnit(index) {
    const data = [...this.state.dataItems];
    data.splice(index, 1);
    this.setState({ dataItems: data });
  }

  async onNameItemChange(value, index) {
    // const data = [...this.state.dataItems];
    // data[index] = { ...data[index], name: value };
    // await this.setState({ dataItems: data });
    // this.props.addDataItems(data);
    // if (this.state.dataItems[index].name != "") {
    // }
    var data = { ...this.state.dataItemsTemporary };
    data = { ...data, name: value };
    this.setState({ dataItemsTemporary: data });
  }

  async onTotalUnitChange(value, index) {
    // const data = [...this.state.dataItems];
    // data[index] = { ...data[index], unit_total: value };
    // await this.setState({ dataItems: data });
    // this.props.addDataItems(data);
    // if (
    //   this.state.dataItems[index].unit_total != "" &&
    //   this.state.dataItems[index].unit_id != "" &&
    //   this.state.dataItems[index].service_id != ""
    // ) {
    //   this.getShippingCost();
    // }
    var data = { ...this.state.dataItemsTemporary };
    data = { ...data, unit_total: value };
    this.setState({ dataItemsTemporary: data });
  }

  onTotalItemChange(value, index) {
    // const data = [...this.state.dataItems];
    // data[index] = { ...data[index], unit_count: value };
    // this.setState({ dataItems: data });
    // this.props.addDataItems(data);
    var data = { ...this.state.dataItemsTemporary };
    data = { ...data, unit_count: value };
    this.setState({ dataItemsTemporary: data });
  }

  selectUnits(index_selected) {
    this.setState({
      index_selected,
      itemModal: this.state.units,
      typeModal: "unit",
    });
    this.setState({ modalVisible: true });
  }
  selectService(index_selected) {
    this.setState({
      index_selected,
      itemModal: this.state.services,
      typeModal: "service",
    });
    this.setState({ modalVisible: true });
  }

  async onSelectedFleets(value, index) {
    await this.setState({ indexFLeet: index, fleetId: value.id });
    this.getShippingCostWhenFocus();
  }
  getShippingCostWhenFocus() {
    if (
      this.state.fleetId != "" &&
      this.state.sender_address != null &&
      this.state.recieve_address != null &&
      this.state.dataItems[0].unit_id != "" &&
      this.state.dataItems[0].unit_total != ""
    ) {
      this.getShippingCost();
    }
  }

  getShippingCost() {
    console.log("getShippingCost");

    this.calculatePrice();
  }
  async calculatePrice() {
    var params = {
      items: this.state.dataItems,
      fleetId: this.state.fleetId,
      origin:
        this.state.sender_address == null ? "" : this.state.sender_address.city,
      destination:
        this.state.recieve_address == null
          ? ""
          : this.state.recieve_address.sender_address.city,
    };

    console.log("calculatePrice", params);
    await postData(BASE_URL + CALCULATE, params, this.state.token)
      .then((response) => {
        console.log("reg response", response);
        if (response.success == true) {
          console.log("response.success calculatePrice", response);
          this.setLoading(false);
          this.setState({ calculates: response.data.items });
          this.setState({ dataCalculates: response.data });
        } else {
          console.log("response.false", "false");
          this.setState({
            messageWarning: response.message,
            isModalWarning: true,
          });
          // this.setState({ modalVisible: true });
        }
      })
      .catch((error) => {
        this.setLoading(false);
      });
  }
  async onSelectPromo(data, index) {
    if (index === this.state.indexPromo) {
      await this.setState({ indexPromo: "", promoId: null });
    } else {
      await this.setState({ indexPromo: index, promoId: data.id });
      this.calculatePromo();
    }

    console.log("onSelectPromo", index);
    console.log("onSelectPromo2", this.state.indexPromo);
  }

  async calculatePromo(data) {
    this.setLoading(true);
    var params = {
      promoId: this.state.promoId,
      value:
        this.state.dataCalculates != ""
          ? this.state.dataCalculates.total_price
          : 0,
    };
    await postData(BASE_URL + SELECT_PROMO, params, this.state.token)
      .then((response) => {
        console.log("reg response", response);
        if (response.success == true) {
          console.log("response.success", "true");
          this.setLoading(false);
          this.setState({ valueDiskon: response.data.discount });
        } else {
          console.log("response.false", "false");
          this.setLoading(false);
          this.setState({
            messageWarning: response.message,
            isModalWarning: true,
          });
          // this.setState({ modalVisible: true });
        }
      })
      .catch((error) => {
        this.setLoading(false);
      });
  }

  async onPickUp() {
    // this.setLoading(true);
    this.props.navigation.navigate("PickupSuccess");
    // if (
    //   this.state.collector_address == null &&
    //   this.state.toReceiver == false &&
    //   this.state.toSender == false
    // ) {
    //   this.setState({
    //     messageWarning: "Harap lengkapi alamat data penagihan",
    //     isModalWarning: true,
    //   });
    // } else if (this.state.fleetId == "") {
    //   this.setState({
    //     messageWarning: "Harap pilih armada",
    //     isModalWarning: true,
    //   });
    // } else if (this.state.picktime == "") {
    //   this.setState({
    //     messageWarning: "Harap isi jadwal pickup",
    //     isModalWarning: true,
    //   });
    // } else if (this.state.name == "") {
    //   this.setState({
    //     messageWarning: "Harap masukkan nama",
    //     isModalWarning: true,
    //   });
    // } else if (this.state.phone == "") {
    //   this.setState({
    //     messageWarning: "Harap isi nomor handphone",
    //     isModalWarning: true,
    //   });
    // } else if (this.state.sender_address == null) {
    //   this.setState({
    //     messageWarning: "Harap lengkapi alamat data pengirim",
    //     isModalWarning: true,
    //   });
    // } else if (this.state.recieve_address == null) {
    //   this.setState({
    //     messageWarning: "Harap lengkapi alamat data penerima",
    //     isModalWarning: true,
    //   });
    // } else if (
    //   this.state.dataItems[this.state.index_selected].unit_total == "" &&
    //   this.state.dataItems[this.state.index_selected].unit_id == "" &&
    //   this.state.dataItems[this.state.index_selected].service_id == ""
    // ) {
    //   this.setState({
    //     messageWarning: "Harap lengkapi Data Barang",
    //     isModalWarning: true,
    //   });
    // } else if (
    //   this.state.collector_address == null &&
    //   this.state.toReceiver == false &&
    //   this.state.toSender == false
    // ) {
    //   this.setState({
    //     messageWarning: "Harap lengkapi alamat data penagihan",
    //     isModalWarning: true,
    //   });
    // } else {
    //   // this.calculatePrice();
    //   var items = [];
    //   this.state.dataItems.map((data) => {
    //     let d = {
    //       unit_id: data.unit_id,
    //       service_id: data.service_id,
    //       name: data.name,
    //       unit_total: data.unit_total,
    //       unit_count: data.unit_count,
    //     };
    //     items.push(d);
    //   });
    //   var params = {
    //     fleetId: this.state.fleetId,
    //     promoId: this.state.promoId,
    //     name: this.state.name,
    //     phone: this.state.phone,
    //     senderId:
    //       this.state.sender_address != null ? this.state.sender_address.id : "",
    //     receiverId:
    //       this.state.recieve_address != null
    //         ? this.state.recieve_address.sender_address.id
    //         : "",
    //     debtorId:
    //       this.state.collector_address != null
    //         ? this.state.collector_address.id
    //         : "",
    //     notes: this.state.notes,
    //     picktime: this.state.picktime,
    //     origin: this.state.sender_address.city,
    //     destination_city: this.state.recieve_address.sender_address.city,
    //     destination_district: this.state.recieve_address.sender_address
    //       .district,
    //     items: items,
    //   };
    //   console.log("Param = ", params);
    //   this.setLoading(true);
    //   await postData(BASE_URL + PICKUP, params, this.state.token)
    //     .then((response) => {
    //       console.log("reg response", response);
    //       if (response.success == true) {
    //         console.log("response.success", "true");
    //         this.setLoading(false);
    //         this.setState({ isModalSuccess: true });
    //       } else {
    //         console.log("response.false", "false");
    //         this.setLoading(false);
    //         this.setState({
    //           messageWarning: response.message,
    //           isModalWarning: true,
    //         });
    //       }
    //     })
    //     .catch((error) => {
    //       this.setLoading(false);
    //     });
    // }
  }

  onSuccess() {
    this.setState({ isModalSuccess: false });
    this.props.navigation.navigate("History");
  }

  onOpenBottomSheetHandler = (index) => {
    this.refs.BottomSheet.snapTo(index);
  };

  renderBottomSheet() {
    return (
      <BottomSheet
        bottomSheerColor="#F1F1F1"
        // backDropColor="red"
        ref={"BottomSheet"}
        initialPosition={"0%"}
        snapPoints={snapPoints}
        isBackDrop={true}
        isBackDropDismissByPress={true}
        isRoundBorderWithTipHeader={true}
        headerStyle={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: "#FBFAF8",
        }}
        header={
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                backgroundColor: "grey",
                height: moderateScale(5),
                width: moderateScale(35),
                borderRadius: moderateScale(5),
              }}
            ></View>

            <Text style={[styles.text_16, { marginTop: verticalScale(8) }]}>
              Masukkan Data Barang
            </Text>
          </View>
        }
        body={
          <View
            style={{
              padding: moderateScale(10),
              backgroundColor: "#FBFAF8",
              height: "1000%",
            }}
          >
            <Text style={styles.text_10}>Nama Barang</Text>
            <TextInput
              paddingLeft={moderateScale(12)}
              keyboardType="default"
              value={this.state.dataItemsTemporary.name}
              style={{
                backgroundColor: "#F1F1F1",
                borderRadius: moderateScale(12),
                fontSize: 12,
                marginTop: verticalScale(5),
              }}
              placeholder="Nama Barang"
              onChangeText={(phone) => this.onNameItemChange(phone)}
            ></TextInput>
            <Text style={styles.text_10}>Jumlah Barang</Text>
            <TextInput
              paddingLeft={moderateScale(12)}
              keyboardType="default"
              value={this.state.dataItemsTemporary.unit_count}
              style={{
                backgroundColor: "#F1F1F1",
                borderRadius: moderateScale(12),
                fontSize: 12,
                marginTop: verticalScale(5),
              }}
              placeholder="Jumlah Barang"
              onChangeText={(value) => this.onTotalItemChange(value)}
            ></TextInput>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, marginRight: moderateScale(5) }}>
                <Text style={styles.text_10}>Berat Total</Text>
                <TextInput
                  paddingLeft={moderateScale(12)}
                  keyboardType="number-pad"
                  value={this.state.dataItemsTemporary.unit_total}
                  style={{
                    backgroundColor: "#F1F1F1",
                    borderRadius: moderateScale(12),
                    fontSize: 12,
                  }}
                  placeholder="Berat Total"
                  onChangeText={(value) => this.onTotalUnitChange(value)}
                ></TextInput>
              </View>

              <View style={{ flex: 1, marginLeft: moderateScale(5) }}>
                <Text style={styles.text_10}>Satuan</Text>
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    alignItems: "center",
                    backgroundColor: "#F1F1F1",
                    width: moderateScale(90),
                    paddingHorizontal: moderateScale(5),
                    borderRadius: moderateScale(12),
                  }}
                >
                  <Text
                    style={[
                      styles.text_12,
                      {
                        marginTop: 0,
                        color: "#686868",
                        marginRight: moderateScale(5),
                      },
                    ]}
                  >
                    {this.state.dataItemsTemporary.unit_label == ""
                      ? "satuan"
                      : this.state.dataItemsTemporary.unit_label}
                  </Text>
                  <TouchableOpacity onPress={() => this.selectUnits(0)}>
                    <Image
                      style={{
                        height: verticalScale(16),
                        width: verticalScale(16),
                        resizeMode: "stretch",
                      }}
                      source={require("../../assets/image/ic_arrow_down.png")}
                    ></Image>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <Text style={styles.text_10}>Request Layanan</Text>
            <TouchableOpacity
              style={{ justifyContent: "center" }}
              onPress={() => this.selectService(0)}
            >
              <TextInput
                editable={false}
                paddingLeft={moderateScale(12)}
                keyboardType="default"
                value={this.state.dataItemsTemporary.service_label}
                style={{
                  backgroundColor: "#F1F1F1",
                  borderRadius: moderateScale(12),
                  fontSize: 12,
                  marginTop: verticalScale(5),
                }}
                placeholder="Request Layanan"
                // onChangeText={(phone) => this.setState({ phone })}
              ></TextInput>
              <Image
                style={{
                  position: "absolute",
                  height: verticalScale(16),
                  width: verticalScale(16),
                  resizeMode: "stretch",
                  right: moderateScale(10),
                }}
                source={require("../../assets/image/ic_arrow_down.png")}
              ></Image>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: verticalScale(40),
                width: width - moderateScale(20),
                backgroundColor: "#A80002",
                borderRadius: 20,
                marginTop: verticalScale(20),
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => this.onSaveItem()}
            >
              <Text style={styles.text_title_14}>Simpan</Text>
            </TouchableOpacity>
          </View>
        }
      />
    );
  }

  renderModal(type) {
    if (this.state.typeModal === "unit") {
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
              <View style={styles.modal_dropdown}>
                <Text style={styles.modalText}>Pilih Satuan</Text>
                {this.state.itemModal.map((data, key) => {
                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() => this.onSelectedUnit(data)}
                    >
                      <Text
                        style={[
                          styles.text_title_14,
                          { color: "#262F56", margin: moderateScale(5) },
                        ]}
                      >
                        {data.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </Modal>
        </View>
      );
    } else {
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
              <View style={styles.modal_dropdown}>
                <Text style={styles.modalText}>Pilih Service</Text>
                {this.state.itemModal.map((data, key) => {
                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() => this.onSelectedUnit(data)}
                    >
                      <Text
                        style={[
                          styles.text_title_14,
                          { color: "#262F56", margin: moderateScale(5) },
                        ]}
                      >
                        {data.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </Modal>
        </View>
      );
    }
  }
  renderdaftarBarang() {
    return (
      <View style={styles.content}>
        <Text
          style={[styles.text_title_12, { marginBottom: verticalScale(20) }]}
        >
          Daftar Barang
        </Text>
        <View style={{ backgroundColor: "#FFFFFF" }}>
          <View style={{ flexDirection: "row", backgroundColor: "white" }}>
            <Text
              style={{
                flex: 1,
                fontSize: 9,
                color: "#686868",
                marginLeft: moderateScale(9),
              }}
            >
              Nama Barang
            </Text>
            <Text
              style={{
                fontSize: 9,
                flex: 0.5,
                color: "#686868",
                marginHorizontal: moderateScale(2.5),
              }}
            >
              Jumlah
            </Text>
            <Text
              style={{
                fontSize: 9,
                flex: 0.8,
                color: "#686868",
                marginHorizontal: moderateScale(2.5),
              }}
            >
              Berat Total
            </Text>
            <Text
              style={{
                fontSize: 9,
                flex: 0.8,
                color: "#686868",
                marginHorizontal: moderateScale(2.5),
                // paddingLeft: moderateScale(9),
              }}
            >
              Req. Layanan
            </Text>
            <View
              style={{
                height: moderateScale(10),
                width: moderateScale(10),
              }}
            ></View>
          </View>

          {this.state.dataItems.map((data, key) => {
            return (
              <View
                key={key}
                style={{
                  flexDirection: "row",
                  backgroundColor: "white",
                  marginTop: verticalScale(10),
                }}
              >
                <TextInput
                  value={this.state.dataItems[key].name}
                  onChangeText={(event) => this.onNameItemChange(event, key)}
                  // onChange={(event) => this.getShippingCost(event, key)}
                  placeholder="Nama Barang"
                  style={{
                    flex: 1,
                    height: verticalScale(25),
                    fontSize: 9,
                    paddingVertical: verticalScale(1),
                    textAlignVertical: "top",
                    color: "#686868",
                    marginLeft: moderateScale(5),
                    marginRight: moderateScale(2.5),
                  }}
                ></TextInput>
                <TextInput
                  placeholder="Jumlah"
                  value={this.state.dataItems[key].unit_count}
                  onChangeText={(event) => this.onTotalItemChange(event, key)}
                  style={{
                    flex: 0.5,
                    height: verticalScale(25),
                    fontSize: 9,
                    paddingVertical: verticalScale(1),
                    textAlignVertical: "top",
                    color: "#686868",
                    marginHorizontal: 2.5,
                  }}
                ></TextInput>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginHorizontal: 2.5,
                  }}
                >
                  <TextInput
                    keyboardType="number-pad"
                    placeholder="Berat"
                    value={this.state.dataItems[key].unit_total}
                    onChangeText={(event) => this.onTotalUnitChange(event, key)}
                    style={{
                      flex: 0.8,
                      height: verticalScale(25),
                      fontSize: 9,
                      paddingVertical: verticalScale(1),
                      textAlignVertical: "top",
                      color: "#686868",
                    }}
                  ></TextInput>

                  <TouchableOpacity
                    style={{ flexDirection: "row" }}
                    // onPress={() => this.selectUnits(key)}
                  >
                    <Text
                      style={[
                        styles.text_10,
                        { marginTop: 0, color: "#262F56" },
                      ]}
                    >
                      {this.state.dataItems[key].unit_label}
                    </Text>
                    {/* <Image
                      style={styles.ic_arrow_down}
                      source={require("../../assets/image/ic_arrow_down.png")}
                    ></Image> */}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  // onPress={() => this.selectService(key)}
                  style={{ flexDirection: "row", flex: 0.8 }}
                >
                  <Text style={[styles.text_9, { color: "#262F56" }]}>
                    {this.state.dataItems[key].service_label}
                  </Text>

                  {this.state.dataItems[key].service_label == "" && (
                    <Image
                      style={styles.ic_arrow_down}
                      source={require("../../assets/image/ic_edit.png")}
                    ></Image>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => this.deleteUnit(key)}
                >
                  <Image
                    style={{
                      height: moderateScale(20),
                      width: moderateScale(20),
                    }}
                    source={require("../../assets/image/del.png")}
                  ></Image>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={() => this.addItems()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: verticalScale(10),
          }}
        >
          <Image
            style={styles.asset_icon_plus}
            source={require("../../assets/image/ic_plus.png")}
          ></Image>
          <Text style={styles.text_12}>tambah barang</Text>
        </TouchableOpacity>
      </View>
    );
  }
  renderBiayaPengiriman() {
    return (
      <View style={styles.content}>
        <Text
          style={[styles.text_title_12, { marginBottom: verticalScale(20) }]}
        >
          Biaya Pengiriman
        </Text>

        <View style={{ flexDirection: "row", backgroundColor: "white" }}>
          <Text
            style={{
              flex: 0.8,
              fontSize: 9,
              color: "#686868",
              marginHorizontal: 10,
            }}
          >
            Nama Barang
          </Text>
          <Text style={{ fontSize: 9, color: "#686868", marginHorizontal: 10 }}>
            Jumlah
          </Text>
          <Text style={{ fontSize: 9, color: "#686868", marginHorizontal: 10 }}>
            Berat Total
          </Text>
          <Text style={{ fontSize: 9, color: "#686868", marginHorizontal: 10 }}>
            Biaya
          </Text>
        </View>

        {this.state.calculates.map((data, key) => {
          return (
            <View
              key={key}
              style={{
                flexDirection: "row",
                backgroundColor: "white",
                paddingTop: verticalScale(10),
              }}
            >
              <Text
                style={{
                  flex: 0.9,
                  fontSize: 11,
                  color: "#262F56",
                  marginHorizontal: 10,
                }}
              >
                {this.state.dataItems[key].name}
              </Text>
              <Text
                style={{ fontSize: 11, color: "#262F56", marginHorizontal: 10 }}
              >
                {this.state.dataItems[key].unit_count}
              </Text>
              <Text
                style={{ fontSize: 11, color: "#262F56", marginHorizontal: 10 }}
              >
                {data.unit_total} {data.unit.slug}
              </Text>
              <Text
                style={{ fontSize: 11, color: "#262F56", marginHorizontal: 10 }}
              >
                {data.price}
              </Text>
            </View>
          );
        })}

        {this.state.calculates.length < 0 && (
          <View
            style={{
              height: verticalScale(76),
              backgroundColor: "#F2D0D0",
              borderRadius: 10,
              marginTop: verticalScale(10),
            }}
          >
            <Text
              style={[
                styles.text_10_bold,
                {
                  color: "#820002",
                  marginHorizontal: moderateScale(8),
                  marginTop: moderateScale(5),
                },
              ]}
            >
              Pengecekan Berat dan Biaya
            </Text>
            <Text
              style={[
                styles.text_10,
                { color: "#820002", margin: moderateScale(8) },
              ]}
            >
              Pengecekan Berat dan Biaya Barang akan ditimbang ulang oleh
              petugas dan berat yang digunakan adalah berat setelah dihitung
              oleh petugas Papandayan Cargo.
            </Text>
          </View>
        )}
      </View>
    );
  }
  renderTotalBiaya() {
    return (
      <View style={styles.content}>
        <Text
          style={[styles.text_title_12, { marginBottom: verticalScale(20) }]}
        >
          Total Biaya
        </Text>

        <View style={{ flexDirection: "row", backgroundColor: "white" }}>
          <Text
            style={{
              flex: 0.8,
              fontSize: 9,
              color: "#686868",
              marginHorizontal: 10,
            }}
          >
            Nama Barang
          </Text>

          <Text style={{ fontSize: 9, color: "#686868", marginHorizontal: 10 }}>
            Biaya
          </Text>
        </View>

        {this.state.calculates.map((data, key) => {
          return (
            <View
              key={key}
              style={{
                flexDirection: "row",
                backgroundColor: "white",
                paddingTop: verticalScale(10),
              }}
            >
              <Text
                style={{
                  flex: 0.9,
                  fontSize: 11,
                  color: "#262F56",
                  marginHorizontal: 10,
                }}
              >
                {this.state.dataItems[key].name}
              </Text>

              <Text
                style={{ fontSize: 11, color: "#262F56", marginHorizontal: 10 }}
              >
                {data.price}
              </Text>
            </View>
          );
        })}

        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            paddingTop: verticalScale(10),
          }}
        >
          <Text
            style={{
              flex: 0.9,
              fontSize: 10,
              fontWeight: "bold",
              color: "#262F56",
              marginHorizontal: 10,
            }}
          >
            Diskon
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: "#262F56",
              marginHorizontal: 10,
              fontWeight: "bold",
            }}
          >
            {this.state.valueDiskon}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            paddingTop: verticalScale(10),
          }}
        >
          <Text
            style={{
              flex: 0.9,
              fontSize: 13,
              fontWeight: "bold",
              color: "#262F56",
              marginHorizontal: 10,
            }}
          >
            Total
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: "#262F56",
              marginHorizontal: 10,
              fontWeight: "bold",
            }}
          >
            {this.state.dataCalculates != ""
              ? this.state.dataCalculates.total_price - this.state.valueDiskon
              : "Rp. -"}
          </Text>
        </View>
      </View>
    );
  }
  renderListPromo() {
    return (
      <View
        style={{
          width: "100%",
          backgroundColor: "#F2D0D0",
          marginTop: verticalScale(16),
        }}
      >
        <Text
          style={[
            styles.text_10,
            {
              marginHorizontal: moderateScale(16),
              marginBottom: verticalScale(16),
            },
          ]}
        >
          <Text>Kamu memiliki </Text>
          <Text style={styles.text_10_bold}>
            {this.state.promotions.length} Kode Promo
          </Text>
          <Text>yang bisa di gunakan. Cek kode promo.</Text>
        </Text>
        {this.state.promotions.map((data, key) => {
          return (
            <View key={key}>
              <TouchableOpacity
                onPress={() => this.onSelectPromo(data, key)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center",
                  paddingVertical: verticalScale(8),
                  backgroundColor:
                    this.state.indexPromo === key ? "#f5b3b3" : "#F2D0D0",
                }}
              >
                <Text
                  style={[
                    styles.text_10_bold,
                    { marginHorizontal: moderateScale(16), flex: 0.8 },
                  ]}
                >
                  {data.code}
                </Text>
                <Text style={[styles.text_10, { marginTop: 0, flex: 1 }]}>
                  {data.description}
                </Text>
              </TouchableOpacity>
              <View
                style={{ height: verticalScale(1), backgroundColor: "#FFFFFF" }}
              ></View>
            </View>
          );
        })}
      </View>
    );
  }
  renderCatatan() {
    return (
      <View style={styles.content}>
        <Text
          style={[styles.text_title_12, { marginBottom: verticalScale(9) }]}
        >
          Catatan
        </Text>
        <TextInput
          value={this.state.notes}
          onChangeText={(notes) => this.setState({ notes })}
          multiline={true}
          numberOfLines={4}
          style={styles.text_area}
        ></TextInput>
      </View>
    );
  }
  renderDataPenagihan() {
    return (
      <View style={styles.content}>
        <Text style={styles.text_title_12}>Data Penagihan</Text>
        <View style={styles.view_option_addres}>
          <View style={styles.view_row}>
            <TouchableOpacity onPress={() => this.actionToSender()}>
              <Image
                style={styles.icon_check_list}
                source={
                  this.state.toSender
                    ? require("../../assets/image/ic_check.png")
                    : require("../../assets/image/ic_uncheck.png")
                }
              ></Image>
            </TouchableOpacity>
            <Text style={styles.text_11}>Ke alamat Pengirim</Text>
          </View>
          <View style={styles.view_row}>
            <TouchableOpacity onPress={() => this.actionToReceiver()}>
              <Image
                style={styles.icon_check_list}
                source={
                  this.state.toReceiver
                    ? require("../../assets/image/ic_check.png")
                    : require("../../assets/image/ic_uncheck.png")
                }
              ></Image>
            </TouchableOpacity>
            <Text style={styles.text_11}>Ke alamat Penerima</Text>
          </View>
        </View>

        {this.state.collector_address != null &&
          this.state.toReceiver == false &&
          this.state.toSender == false && (
            <TouchableOpacity
              style={styles.view_options}
              onPress={() => this.goCollectorAddress()}
            >
              <Image
                style={styles.icon_location}
                source={require("../../assets/image/icon_location.png")}
              ></Image>
              <View style={{ flex: 1 }}>
                <Text style={styles.text_10_bold}>
                  {this.state.collector_address.title}
                </Text>
                <Text style={styles.text_10}>
                  {this.state.collector_address.street +
                    ", " +
                    this.state.collector_address.village +
                    ", " +
                    this.state.collector_address.district +
                    ", " +
                    this.state.collector_address.city +
                    ", " +
                    this.state.collector_address.province}
                </Text>
              </View>
              <View style={styles.view_options_right}>
                <Image
                  style={styles.icon_arrow}
                  source={require("../../assets/image/arrow_line_option.png")}
                ></Image>
              </View>
            </TouchableOpacity>
          )}

        {this.state.collector_address == null &&
          this.state.toReceiver == false &&
          this.state.toSender == false && (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: verticalScale(10),
              }}
              onPress={() => this.goCollectorAddress()}
            >
              <Image
                style={styles.asset_icon_plus}
                source={require("../../assets/image/ic_plus.png")}
              ></Image>
              <Text style={styles.text_12}>tambah data penagihan</Text>
            </TouchableOpacity>
          )}
      </View>
    );
  }

  renderDatePicker() {
    return (
      <DateTimePickerModal
        isVisible={this.state.isDatePickerVisible}
        mode="date"
        onConfirm={(date) => this.handleConfirmDate(date)}
        onCancel={() => this.setState({ isDatePickerVisible: false })}
      />
    );
  }

  renderFleets() {
    return this.state.fleets.map((data, key) => {
      var value = data.slug;
      var label = value.toUpperCase();
      var path = "";
      var on_selected_path = "";
      if (label === "REGULER") {
        this.state.indexFLeet === key
          ? (path = require("../../assets/image/icon_regular.png"))
          : (path = require("../../assets/image/icon_un_regular.png"));
      } else if (label === "EXPRESS") {
        this.state.indexFLeet === key
          ? (path = require("../../assets/image/icon_regular.png"))
          : (path = require("../../assets/image/icon_un_regular.png"));
      } else if (label === "UDARA") {
        this.state.indexFLeet === key
          ? (path = require("../../assets/image/icon_plane.png"))
          : (path = require("../../assets/image/icon_un_plane.png"));
      } else if (label === "DARAT") {
        this.state.indexFLeet === key
          ? (path = require("../../assets/image/icon_land.png"))
          : (path = require("../../assets/image/icon_un_land.png"));
      } else {
        this.state.indexFLeet === key
          ? (path = require("../../assets/image/icon_un_regular.png"))
          : (path = require("../../assets/image/icon_un_regular.png"));
      }
      return (
        <TouchableOpacity
          onPress={() => this.onSelectedFleets(data, key)}
          key={key}
          style={[
            styles.icon_armada,
            { borderWidth: this.state.indexFLeet === key ? 2 : 0 },
          ]}
        >
          <Image style={styles.asset_icon_armada} source={path}></Image>

          <Text
            style={[
              styles.asset_text_armada,
              { color: this.state.indexFLeet === key ? "#A80002" : "#C4C4C4" },
            ]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      );
    });
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
                source={require("../../assets/image/left-arrow-black.png")}
              ></Image>
            </TouchableOpacity>
            <Text style={styles.text_header}>Pick Up</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.text_pickup}>
              Untuk kelancaran proses pengiriman barang Anda, silahkan masukan
              data-data yang dibutuhkan kedalam formulir berikut ini:
            </Text>
            <Text style={styles.text_title_12}>Pilih Armada</Text>
            <View style={styles.view_armada}>{this.renderFleets()}</View>
          </View>
          <View style={styles.line_border}></View>
          <View style={styles.content}>
            <Text style={styles.text_title_12}>Pilih Jadwal Pick Up</Text>
            <View style={styles.view_input_text}>
              <TextInput
                editable={false}
                style={styles.input_text}
                placeholder={"Pilih Jadwal Pick Up"}
                value={this.state.picktime}
              ></TextInput>
              <TouchableOpacity onPress={() => this.showDatePicker()}>
                <Image
                  style={styles.icon_date}
                  source={require("../../assets/image/icon_date.png")}
                ></Image>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.line_border}></View>
          <View style={styles.content}>
            <Text style={styles.text_title_12}>Data Pengiriman</Text>
            <Text style={styles.title}>Nama Lengkap</Text>
            <View style={styles.view_input_text}>
              <TextInput
                value={this.state.name}
                style={styles.input_text}
                placeholder="Nama Lengkap"
                onChangeText={(name) => this.setState({ name })}
              ></TextInput>
            </View>
            <Text style={styles.title}>Nomor Handphone</Text>
            <View style={styles.view_input_text}>
              <TextInput
                keyboardType="number-pad"
                maxLength={13}
                value={this.state.phone}
                style={styles.input_text}
                placeholder="Nomor Handphone"
                onChangeText={(phone) => this.setState({ phone })}
              ></TextInput>
            </View>
            <Text style={styles.title}>Alamat</Text>
            {this.state.sender_address != null ? (
              <TouchableOpacity
                style={styles.view_options}
                onPress={() => this.goReturnAddress()}
              >
                <Image
                  style={styles.icon_location}
                  source={require("../../assets/image/icon_location.png")}
                ></Image>
                <View style={{ flex: 1 }}>
                  <Text style={styles.text_10_bold}>
                    {this.state.sender_address.title}
                  </Text>
                  <Text style={styles.text_10}>
                    {this.state.sender_address.street +
                      ", " +
                      this.state.sender_address.village +
                      ", " +
                      this.state.sender_address.district +
                      ", " +
                      this.state.sender_address.city +
                      ", " +
                      this.state.sender_address.province}
                  </Text>
                </View>
                <View style={styles.view_options_right}>
                  <Image
                    style={styles.icon_arrow}
                    source={require("../../assets/image/arrow_line_option.png")}
                  ></Image>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: verticalScale(10),
                }}
                onPress={() => this.goReturnAddress()}
              >
                <Image
                  style={styles.asset_icon_plus}
                  source={require("../../assets/image/ic_plus.png")}
                ></Image>
                <Text style={styles.text_12}>tambah data pengirim</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.line_border}></View>
          <View style={styles.content}>
            <Text style={styles.text_title_12}>Data Penerima</Text>
            {this.state.recieve_address != null ? (
              <TouchableOpacity
                style={styles.view_options}
                onPress={() => this.goReceiverAddress()}
              >
                <Image
                  style={styles.icon_location}
                  source={require("../../assets/image/icon_location.png")}
                ></Image>
                <View style={{ flex: 1 }}>
                  <Text style={styles.text_10_bold}>
                    {this.state.recieve_address.sender_address.title}
                  </Text>
                  <Text style={styles.text_10}>
                    {this.state.recieve_address.sender_address.street +
                      ", " +
                      this.state.recieve_address.sender_address.village +
                      ", " +
                      this.state.recieve_address.sender_address.district +
                      ", " +
                      this.state.recieve_address.sender_address.city +
                      ", " +
                      this.state.recieve_address.sender_address.province}
                  </Text>
                </View>
                <View style={styles.view_options_right}>
                  <Image
                    style={styles.icon_arrow}
                    source={require("../../assets/image/arrow_line_option.png")}
                  ></Image>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: verticalScale(10),
                }}
                onPress={() => this.goReceiverAddress()}
              >
                <Image
                  style={styles.asset_icon_plus}
                  source={require("../../assets/image/ic_plus.png")}
                ></Image>
                <Text style={styles.text_12}>tambah data penerima</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.line_border}></View>
          {this.renderDataPenagihan()}
          <View style={styles.line_border}></View>
          {this.renderdaftarBarang()}
          <View style={styles.line_border}></View>
          {this.renderBiayaPengiriman()}
          <View style={styles.line_border}></View>
          {this.renderListPromo()}
          <View style={styles.line_border}></View>
          {this.renderCatatan()}
          <View style={styles.line_border}></View>
          {this.renderTotalBiaya()}

          <TouchableOpacity
            style={styles.button_primary}
            onPress={() => this.onPickUp()}
          >
            <Text style={styles.text_title_14}>PROSES PICK UP</Text>
          </TouchableOpacity>
          <View style={styles.line_border}></View>
        </KeyboardAwareScrollView>
        {this.renderBottomSheet()}
        {this.renderDatePicker()}
        {this.renderModal()}
        <Loading visible={this.state.isLoading}></Loading>
        <ModalWarning
          visible={this.state.isModalWarning}
          message={this.state.messageWarning}
          onOk={() => this.setState({ isModalWarning: false })}
        ></ModalWarning>
        <ModalSuccess
          visible={this.state.isModalSuccess}
          message={"Pickup Berhasil"}
          onOk={() => this.onSuccess()}
        ></ModalSuccess>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  text_header: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
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
  icon_armada: {
    width: verticalScale(50),
    height: verticalScale(50),
    borderWidth: 2,
    borderColor: "#A80002",
    marginTop: verticalScale(8),
    borderRadius: 12,
    marginRight: verticalScale(8),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  asset_icon_armada: {
    height: verticalScale(20),
    width: verticalScale(30),
    resizeMode: "stretch",
  },
  asset_icon_plus: {
    height: verticalScale(12),
    width: verticalScale(12),
    resizeMode: "stretch",
    marginRight: 10,
  },
  icon_date: {
    height: verticalScale(20),
    width: verticalScale(20),
    resizeMode: "stretch",
  },
  icon_location: {
    height: verticalScale(19),
    width: verticalScale(21, 6),
    resizeMode: "stretch",
    marginHorizontal: moderateScale(10),
  },
  asset_text_armada: {
    fontSize: 7,
    fontFamily: "Montserrat-Bold",
    color: "#A80002",
  },
  line_border: {
    width: width,
    height: 1,
    backgroundColor: "#CFCFCF",
    marginTop: verticalScale(16),
  },
  text_title_12: {
    marginTop: 16,
    fontSize: 12,
    fontFamily: "Montserrat-Bold",
    color: "#686868",
  },
  text_12: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    color: "#686868",
  },
  text_16: {
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
    color: "#000000",
  },
  view_input_text: {
    height: verticalScale(46),
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    marginTop: verticalScale(10),
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  input_text: {
    flex: 1,
    fontSize: 12,
    color: "#8D8F92",
  },
  title: {
    marginTop: verticalScale(8),
    fontFamily: "Montserrat-Regular",
    fontSize: moderateScale(9),
    color: "#686868",
  },
  view_options: {
    flexDirection: "row",
    height: verticalScale(75),
    backgroundColor: "#FFFFFF",
    marginTop: verticalScale(8),
    alignItems: "center",
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
  text_9: {
    fontFamily: "Montserrat-Regular",
    fontSize: 10,
  },
  text_11: {
    fontFamily: "Montserrat-Regular",
    fontSize: 11,
    color: "#262F56",
  },
  icon_arrow: {
    height: verticalScale(5),
    width: verticalScale(10),
    resizeMode: "stretch",
  },
  view_options_right: {
    backgroundColor: "#A80002",
    width: moderateScale(24),
    height: verticalScale(75),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: moderateScale(5),
  },
  view_option_addres: {
    flexDirection: "row",
    marginTop: verticalScale(14),
    marginBottom: verticalScale(14),
  },
  view_unselected_round: {
    width: moderateScale(16),
    height: moderateScale(16),
    borderColor: "#262F56",
    borderWidth: 1,
    borderRadius: 50,
    marginRight: moderateScale(4),
  },

  view_selected_round: {
    width: moderateScale(16),
    height: moderateScale(16),
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 50,
    marginRight: moderateScale(4),
  },

  view_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: moderateScale(12),
  },
  icon_check_list: {
    width: moderateScale(15),
    height: moderateScale(15),
    resizeMode: "stretch",
    marginRight: moderateScale(5),
  },
  text_area: {
    height: verticalScale(75),
    backgroundColor: "white",
    fontSize: 10,
    fontFamily: "Montserrat-Regular",
    textAlignVertical: "top",
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
  button_primary: {
    height: verticalScale(40),
    width: width - moderateScale(40),
    backgroundColor: "#A80002",
    borderRadius: 20,
    marginTop: verticalScale(20),
    marginLeft: moderateScale(20),
    marginRight: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    alignItems: "center",
  },
  text_title_14: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "white",
  },
  txt_name_item: {
    flex: 1,
    height: verticalScale(30),
    fontSize: 9,
    paddingVertical: verticalScale(1),
    textAlignVertical: "top",
    color: "#686868",
    marginHorizontal: 10,
    backgroundColor: "#F0f0f0",
  },
  modal_dropdown: {
    width: moderateScale(200),
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
    right: 15,
    backgroundColor: "#A80002",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
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
  ic_arrow_down: {
    height: verticalScale(12),
    width: verticalScale(12),
    resizeMode: "stretch",
  },
});

const mapStateToProps = (state) => {
  const pushDataItems = dataPickup(state, "ADD_DATA_ITEMS");
  const resetDataItems = dataPickup(state, "RELOAD_DATA_ITEMS");
  // const todosLength = getLength(state);
  // console.log('mapStateToProps', todos.length);
  console.log("mapStateToProps", pushDataItems.dataPickup);
  return { pushDataItems, resetDataItems };
};
export default connect(mapStateToProps, { addDataItems })(PickUp);
