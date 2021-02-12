import React, { Component } from "react";
import Header from "../Header";
import moment from "moment";
import { moderateScale, verticalScale } from "../../util/ModerateScale";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CheckBox from "@react-native-community/checkbox";
import { Picker } from "@react-native-picker/picker";
import { getValue } from "../../util/AsyncStorage";
import { TOKEN } from "../../util/StringConstans";

import {
  postData,
  putData,
  getData,
  BASE_URL,
  PROVINCES,
  CITIES,
  DISTRICTS,
  VILLAGES,
  RECEIVER,
} from "../../network/ApiService";
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
} from "react-native";
const { width, height } = Dimensions.get("window");

class EditFormReceiverAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "",
      token: "",

      title: "",
      name: "",
      phone: "",
      street: "",
      province: "",
      city: "",
      district: "",
      village: "",
      postal_code: "",
      temporary: false,
      is_primary: false,
      id: "",

      item_province: [],
      item_city: [],
      item_district: [],
      item_village: [],

      province: "",
      city: "",
      district: "",
      village: "",

      pickerProv: false,
      pickerCity: false,
      pickerDistrict: false,
      pickerVillage: false,

      isForm: false,
      modalVisible: false,
      message: "",

      selected_address: {},
    };
  }

  async componentDidMount() {
    let token = await getValue(TOKEN);
    this.setState({ token: token });
    console.log("componentDidMount token", this.props.route.params);
    await this.setState({
      title: this.props.route.params.data.title,
      street: this.props.route.params.data.street,
      name: this.props.route.params.data.name,
      phone: this.props.route.params.data.phone,
      postal_code: this.props.route.params.data.postal_code.toString(),
      id: this.props.route.params.data.id,
    });

    await this.getProvinces();
  }

  goBack() {
    this.props.navigation.goBack();
  }

  async getProvinces() {
    await getData(BASE_URL + PROVINCES, this.state.token).then((response) => {
      if (response.success == true) {
        let value = response.data;
        this.setState({ item_province: value, pickerProv: true });
        // this.setState({ picker: true });
        value.map((data) => {
          if (data.name == this.props.route.params.data.province) {
            console.log("getProvinces response", "trueeeeee");
            this.setState({ province: data });
            this.getCities(data.id);
          }
        });
      } else if (response.message == "Unauthenticated.") {
        this.props.navigation.replace("Login");
      }
    });
  }

  async getCities(id) {
    await getData(BASE_URL + CITIES + "/" + id, this.state.token).then(
      (response) => {
        if (response.success == true) {
          let value = response.data;
          this.setState({ item_city: value, pickerCity: true });
          // this.setState({ picker: true });
          value.map((data) => {
            if (data.name == this.props.route.params.data.city) {
              console.log("getCities response", "trueeeeee");
              this.setState({ city: data });
              this.getDistrict(data.id);
            }
          });
        }
      }
    );
  }

  async getDistrict(id) {
    await getData(BASE_URL + DISTRICTS + "/" + id, this.state.token).then(
      (response) => {
        if (response.success == true) {
          let value = response.data;
          this.setState({ item_district: value, pickerDistrict: true });
          // this.setState({ picker: true });
          value.map((data) => {
            if (data.name == this.props.route.params.data.district) {
              console.log("getDistrict response", "trueeeeee");
              this.setState({ district: data });
              this.getVillage(data.id);
            }
          });
        }
      }
    );
  }

  async getVillage(id) {
    await getData(BASE_URL + VILLAGES + "/" + id, this.state.token).then(
      (response) => {
        console.log("getVillage id", id);
        console.log("getVillage response", response);
        if (response.success == true) {
          let value = response.data;
          this.setState({ item_village: value, pickerVillage: true });
          this.setState({ picker: true });
          value.map((data) => {
            if (data.name == this.props.route.params.data.village) {
              console.log("getVillage response", "trueeeeee");
              this.setState({ village: data });
            }
          });
        }
      }
    );
  }

  async onValueProvince(data, i) {
    await this.setState({
      province: data,
      item_city: [],
      item_district: [],
      item_village: [],
      pickerCity: false,
      pickerDistrict: false,
      pickerVillage: false,
    });
    if (data != "") {
      await this.getCities(this.state.province.id);
      // this.setState({ pickerCity: true });
    } else {
      this.setState({ item_city: [] });
      this.setState({ pickerCity: false });
      this.setState({ pickerDistrict: false });
    }
  }

  async onValueCity(data) {
    await this.setState({
      city: data,
      item_district: [],
      item_village: [],
      pickerDistrict: false,
      pickerVillage: false,
    });
    if (data != "") {
      this.getDistrict(this.state.city.id);
      // this.setState({ pickerDistrict: true });
    } else {
      this.setState({ item_district: [] });
      this.setState({ pickerDistrict: false });
    }
  }

  async onValueDistrict(data) {
    await this.setState({
      district: data,
      item_village: [],
      pickerVillage: false,
    });
    if (data != "") {
      this.getVillage(this.state.district.id);
      // this.setState({ pickerVillage: true });
    } else {
      this.setState({ item_district: [] });
    }
  }

  async onValueVillage(data) {
    await this.setState({ village: data });
    if (data != "") {
    } else {
    }
  }

  async validation() {
    if (this.state.title == "") {
      await this.setState({
        message: "Simpan sebagai harap diisi",
        modalVisible: true,
        isForm: false,
      });
      this.inputTitle.focus();
    } else if (this.state.street == "") {
      await this.setState({
        message: "Detil alamat harap diisi",
        modalVisible: true,
        isForm: false,
      });
      this.inputStreet.focus();
    } else if (this.state.name == "") {
      await this.setState({
        message: "Nama penerima harap diisi",
        modalVisible: true,
        isForm: false,
      });
      this.inputName.focus();
    } else if (this.state.phone == "") {
      await this.setState({
        message: "Nomor handphone harap diisi",
        modalVisible: true,
        isForm: false,
      });
      this.inputPhone.focus();
    } else if (this.state.province == "") {
      await this.setState({
        message: "Provisi harap di pilih",
        modalVisible: true,
        isForm: false,
      });
    } else if (this.state.city == "") {
      await this.setState({
        message: "Kota harap di pilih",
        modalVisible: true,
        isForm: false,
      });
    } else if (this.state.district == "") {
      await this.setState({
        message: "Kecamatan harap di pilih",
        modalVisible: true,
        isForm: false,
      });
    } else if (this.state.village == "") {
      await this.setState({
        message: "Kelurahan harap di pilih",
        modalVisible: true,
        isForm: false,
      });
    } else if (this.state.postal_code == "") {
      await this.setState({
        message: "Kode Pos harap di isi",
        modalVisible: true,
        isForm: false,
      });
    } else {
      this.setState({ isForm: true });
    }
  }

  async submitForm() {
    await this.validation();
    if (this.state.isForm == true) {
      var params = {
        is_primary: this.state.is_primary,
        temporary: !this.state.temporary,
        title: this.state.title,
        name: this.state.name,
        phone: this.state.phone,
        province: this.state.province.name,
        city: this.state.city.name,
        district: this.state.district.name,
        village: this.state.village.name,
        postal_code: this.state.postal_code,
        street: this.state.street,
        notes: "notes",
      };
      console.log("submitForm token", params);
      if (this.state.temporary == true) {
        await putData(
          BASE_URL + "api/receiver/" + this.state.id,
          params,
          this.state.token
        ).then((response) => {
          console.log("submitForm response", response);
          if (response.success == true) {
            let value = response.data;
            this.props.navigation.goBack();
          } else if (response.message == "Unauthenticated.") {
            this.props.navigation.replace("Login");
          }
        });
      } else {
        await saveData("RECEIVER_ADDRESS", params);
        this.props.navigation.navigate("PickUp");
      }
    }
  }

  async resetDataAddress() {
    await this.setState({
      item_city: [],
    });
  }

  renderProvices() {
    return (
      <View style={styles.vpicker}>
        <Picker
          style={styles.picker}
          itemStyle={{
            fontSize: moderateScale(3),
          }}
          enabled={this.state.pickerProv}
          mode="dropdown"
          placeholder="- Pilih -"
          selectedValue={this.state.province}
          onValueChange={(value, label) => this.onValueProvince(value, label)}
        >
          <Picker.Item label="- Pilih -" value="" />
          {this.state.item_province.map((data, key) => {
            return <Picker.Item key={key} label={data.name} value={data} />;
          })}
        </Picker>
      </View>
    );
  }

  renderCities() {
    return (
      <View style={styles.vpicker}>
        <Picker
          style={styles.picker}
          enabled={this.state.pickerCity}
          mode="dropdown"
          placeholder="- Pilih -"
          selectedValue={this.state.city}
          onValueChange={(value) => this.onValueCity(value)}
        >
          <Picker.Item label="- Pilih -" value="" />
          {this.state.item_city.map((data, key) => {
            return <Picker.Item key={key} label={data.name} value={data} />;
          })}
        </Picker>
      </View>
    );
  }

  renderDistrict() {
    return (
      <View style={styles.vpicker}>
        <Picker
          style={styles.picker}
          enabled={this.state.pickerDistrict}
          mode="dropdown"
          placeholder="- Pilih -"
          selectedValue={this.state.district}
          onValueChange={(value) => this.onValueDistrict(value)}
        >
          <Picker.Item label="- Pilih -" value="" />
          {this.state.item_district.map((data, key) => {
            return <Picker.Item key={key} label={data.name} value={data} />;
          })}
        </Picker>
      </View>
    );
  }

  renderVIllage() {
    return (
      <View style={styles.vpicker}>
        <Picker
          style={styles.picker}
          enabled={this.state.pickerVillage}
          mode="dropdown"
          placeholder="- Pilih -"
          selectedValue={this.state.village}
          onValueChange={(value) => this.onValueVillage(value)}
        >
          <Picker.Item label="- Pilih -" value="" />
          {this.state.item_village.map((data, key) => {
            return <Picker.Item key={key} label={data.name} value={data} />;
          })}
        </Picker>
      </View>
    );
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
              <Text style={styles.modalText}>Opps!</Text>
              <Text style={styles.modal_message}>{this.state.message}</Text>

              <TouchableOpacity
                style={{ ...styles.openButton }}
                onPress={() => {
                  this.setState({ modalVisible: false });
                }}
              >
                <Text style={styles.textStyle}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header></Header>

        <KeyboardAwareScrollView
          enableResetScrollToCoords={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {this.renderModal()}

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

            <Text style={styles.text_header}>
              {" "}
              Formulir Edit Alamat Penerima
            </Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>Simpan Sebagai</Text>
            <TextInput
              style={styles.text_input}
              placeholder="Simpan Sebagai"
              value={this.state.title}
              ref={(input) => {
                this.inputTitle = input;
              }}
              onChangeText={(title) => this.setState({ title })}
            ></TextInput>
            <Text style={styles.title}>Nama penerima</Text>
            <TextInput
              style={styles.text_input}
              placeholder="Nama penerima"
              value={this.state.name}
              ref={(input) => {
                this.inputName = input;
              }}
              onChangeText={(name) => this.setState({ name })}
            ></TextInput>
            <Text style={styles.title}>Detil Alamat</Text>
            <TextInput
              multiline={true}
              numberOfLines={4}
              style={styles.text_area}
              placeholder="Detil Alamat"
              value={this.state.street}
              ref={(input) => {
                this.inputStreet = input;
              }}
              onChangeText={(street) => this.setState({ street })}
            ></TextInput>
            <Text style={styles.title}>Nomor Handphone</Text>
            <TextInput
              style={styles.text_input}
              placeholder="Nomor Handphone"
              value={this.state.phone}
              maxLength={13}
              keyboardType="number-pad"
              ref={(input) => {
                this.inputPhone = input;
              }}
              onChangeText={(phone) => this.setState({ phone })}
            ></TextInput>

            <Text style={styles.title}>Provinsi</Text>
            {this.renderProvices()}
            <Text style={styles.title}>Kota</Text>
            {this.renderCities()}
            <Text style={styles.title}>Kecamatan</Text>
            {this.renderDistrict()}
            <Text style={styles.title}>Kelurahan</Text>
            {this.renderVIllage()}
            <Text style={styles.title}>Kode Pos</Text>
            <TextInput
              keyboardType="number-pad"
              style={styles.text_input}
              placeholder="Kode Pos"
              maxLength={5}
              value={this.state.postal_code}
              onChangeText={(postal_code) => this.setState({ postal_code })}
            ></TextInput>

            <View
              style={{
                flexDirection: "row",
                marginTop: verticalScale(10),
                alignItems: "center",
              }}
            >
              <CheckBox
                disabled={false}
                value={this.state.temporary}
                onValueChange={(temporary) => this.setState({ temporary })}
                tintColors={{ true: "#E21C1C" }}
              />
              <Text
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: 12,
                }}
              >
                Simpan ke daftar alamat pengirim
              </Text>
            </View>

            {this.state.temporary && (
              <View
                style={{
                  flexDirection: "row",
                  marginTop: verticalScale(10),
                  alignItems: "center",
                }}
              >
                <CheckBox
                  disabled={false}
                  value={this.state.is_primary}
                  onValueChange={(is_primary) => this.setState({ is_primary })}
                  tintColors={{ true: "#E21C1C" }}
                />
                <Text
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: 12,
                  }}
                >
                  Simpan sebagai alamat utama
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.button_primary}
              onPress={() => this.submitForm()}
            >
              <Text style={styles.text_title_14}>SIMPAN</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
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
    fontSize: moderateScale(14),
  },
  title: {
    marginTop: verticalScale(10),
    fontFamily: "Montserrat-Regular",
    fontSize: moderateScale(9),
    color: "#686868",
  },
  text_input: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(12),
    marginTop: verticalScale(8),
    fontSize: moderateScale(12),
    paddingStart: moderateScale(16),
    fontFamily: "Montserrat-Regular",
    height: verticalScale(46),
  },
  text_area: {
    backgroundColor: "#FFFFFF",
    borderRadius: moderateScale(12),
    marginTop: verticalScale(8),
    fontSize: moderateScale(12),
    paddingStart: moderateScale(16),
    fontFamily: "Montserrat-Regular",
    height: verticalScale(86),
    textAlign: "left",
    textAlignVertical: "top",
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
    paddingBottom: verticalScale(20),
  },
  text_pickup: {
    marginTop: 24,
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
  },
  view_armada: {
    flexDirection: "row",
  },
  icon_check_list: {
    width: moderateScale(15),
    height: moderateScale(10),
    resizeMode: "stretch",
  },
  picker: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    color: "#8D8F92",
  },

  vpicker: {
    height: verticalScale(46),
    marginTop: verticalScale(8),
    backgroundColor: "white",
    paddingStart: moderateScale(16),
    borderRadius: 12,
    shadowColor: "#000",
  },
  button_primary: {
    height: verticalScale(40),
    width: width - moderateScale(40),
    backgroundColor: "#A80002",
    borderRadius: 20,
    marginTop: verticalScale(20),
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
});
export default EditFormReceiverAddress;
