import React, { useState, useRef, useEffect } from "react";
import { moderateScale, verticalScale } from "../../../util/ModerateScale";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Header from "../../Header";
import { getValue } from "../../../util/AsyncStorage";
import moment from "moment";
import { TOKEN } from "../../../util/StringConstans";
import { Picker } from "@react-native-picker/picker";
import {
  BASE_URL,
  DETAIL_PICKUP_DRIVER,
  SUBMIT_PICKUP_DRIVER,
  ALLUNIT,
  SERVICE,
  EDIT_ITEM_DRIVER,
  DELETE_ITEM_DRIVER,
  CREATE_ITEM_DRIVER,
  UPLOAD_PICTURE_POP,
  postData,
  getData,
  GET_ROUTE,
  GET_PRICE,
  postFormData,
} from "../../../network/ApiService";
import BottomSheet from "react-native-bottomsheet-reanimated";
import {
  ModalWarning,
  ModalSuccess,
  ModalOptions,
} from "../../../util/CustModal";
import { Loading } from "../../../util/Loading";
import { CustomCamera } from "../../../util/CustomCamera";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";
import {
  BLEPrinter,
  NetPrinter,
  USBPrinter,
  IUSBPrinter,
  IBLEPrinter,
  INetPrinter,
} from "react-native-thermal-receipt-printer";

const printerList: Record<string, any> = {
  ble: BLEPrinter,
  net: NetPrinter,
  usb: USBPrinter,
};

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
  PermissionsAndroid,
  Platform,
  TouchableWithoutFeedback,
  ToastAndroid,
} from "react-native";

const { width, height } = Dimensions.get("window");
const snapPoints = [0, height / 2, "70%", "100%"];

export default function DetailOrder({ navigation, route, props }) {
  const { id_pickup, status_pickup } = route.params;

  const [reason, setReason] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [detail_pickup, setDataDetailPickup] = useState(null);
  const [sender_address, setSenderAddress] = useState(null);
  const [data_item, setDataItem] = useState([]);
  const [selectedId, setSeledtedId] = useState("");
  const [units, setUnits] = useState([]);
  const [item_type, setItemType] = useState([]);
  const [service, setService] = useState([]);
  const [data_picture, setDataPicture] = useState();
  const [dataImage, setDataImage] = useState("");
  const [uriImage, setUriImage] = useState("");
  const [id_route, setIdRoute] = useState("");

  const [dataItemsTemporary, setDataTemp] = useState({
    id: "",
    unit_id: "",
    unit_label: "",
    service_id: "",
    service_label: "",
    name: "",
    unit_total: "",
    unit_count: "",
    unit: "",
    weight: "",
    volume: "",
    type: "",
    type_id: "",
  });
  const [typeForm, setTypeForm] = useState("");

  const [isModalSuccess, setIsModalSuccess] = useState(false);
  const [isModalWarning, setIsModalWarning] = useState(false);
  const [isModalOptions, setIsModalOptions] = useState(false);
  const [messageModalWarning, setMessageModalWarning] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomCamera, setIsCustomCamera] = useState(false);
  const [isEditPhoto, setIsEditPhoto] = useState(false);

  const [status, setStatus] = useState(status_pickup);
  const [notes, setNotes] = useState("");
  const [driverPick, setDriverPIck] = useState(true);

  const [index_selected, setIndexSelected] = useState("");
  const [itemModal, setItemModal] = useState([]);
  const [typeModal, setTypeModal] = useState("");
  const [modalUnitVisible, setModalUnitVisible] = useState(false);
  const [modalPrintVisible, setModalPrintVisible] = useState(false);

  const [devices, setDevices] = React.useState([]);
  const [selectedValue, setSelectedValue] = React.useState("ble");
  const [isBluetooth, setIsBluetooth] = React.useState(false);

  const refBottomSheet = useRef(null);

  useEffect(() => {
    const getListDevices = async () => {
      const Printer = printerList[selectedValue];
      // get list device for net printers is support scanning in local ip but not recommended
      try {
        setIsLoading(true);
        await Printer.init();
        const results = await Printer.getDeviceList();
        // console.log("getListDevices", results);
        setIsBluetooth(true);
        setDevices(
          results.map((item: any) => ({ ...item, printerType: selectedValue }))
        );
      } catch (err) {
        console.warn("getListDevices", err);
        setIsBluetooth(false);
        ToastAndroid.show("Harap hidupkan bluetooth anda", ToastAndroid.SHORT);
      } finally {
        setIsLoading(false);
      }
    };
    getListDevices();
  }, [modalPrintVisible]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.warn("onFocus", "focus");
      // The screen is focused
      // Call any action
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // getUrlVoice();
      getPickupPlan();
      getAllUnit();
      getAllServices();
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    getPickupPlan();
    getAllUnit();
    getAllServices();
  }, []);

  const validationForm = () => {
    if (status == "") {
      return false;
    }
  };

  const onSaveItem = async () => {
    var token = await getValue(TOKEN);
    refBottomSheet.current.snapTo(0);
    setIsLoading(true);
    var params = {
      itemId: dataItemsTemporary.id,
      name: dataItemsTemporary.name,
      total: dataItemsTemporary.unit_total,
      count: dataItemsTemporary.unit_count,
      serviceId: dataItemsTemporary.service_id,
      weight: dataItemsTemporary.weight,
      volume: dataItemsTemporary.volume,
      type: dataItemsTemporary.type_id,
      unit: dataItemsTemporary.unit,
      routePriceId: dataItemsTemporary.type_id,
    };
    if (typeForm == "add") {
      params = {
        pickupId: id_pickup,
        name: dataItemsTemporary.name,
        weight: dataItemsTemporary.weight,
        volume: dataItemsTemporary.volume,
        count: dataItemsTemporary.unit_count,
        unit: dataItemsTemporary.unit,
        serviceId: dataItemsTemporary.service_id,
        routePriceId: dataItemsTemporary.type_id,
        type: dataItemsTemporary.type_id,
      };
      console.log("Params  onSaveItem", params);

      await postData(BASE_URL + CREATE_ITEM_DRIVER, params, token)
        .then((response) => {
          console.log("response CREATE_ITEM_DRIVER", response);
          if (response.success == true) {
            setIsLoading(false);
            // setIsModalSuccess(true)
            getPickupPlan();
          } else {
            setIsLoading(false);
            setIsModalWarning(true);
            setMessageModalWarning(response.message);
          }
        })
        .catch((error) => {
          console.log("response error", error);
        });
    } else {
      await postData(BASE_URL + EDIT_ITEM_DRIVER, params, token)
        .then((response) => {
          console.log("response  onSaveItem", response);
          if (response.success == true) {
            setIsLoading(false);
            // setIsModalSuccess(true)
            getPickupPlan();
          } else {
            setIsLoading(false);
            setIsModalWarning(true);
            setMessageModalWarning(response.message);
          }
        })
        .catch((error) => {
          console.log("response error", error);
        });
    }
  };

  const submitInReason = () => {
    if (reason != "") {
      submitPickup();
      setModalVisible(false);
    }
  };

  const submitPickup = async (value) => {
    var token = await getValue(TOKEN);
    var sts = "";
    if (status == "success") {
      sts = "success";
    } else if (status == "failed") {
      sts = "failed";
    } else {
      sts = "updated";
    }
    var params = {
      statusPick: sts,
      notes: notes,
      driverPick: true,
      pickupId: id_pickup,
      picture: dataImage,
    };
    console.log("params", params);
    setIsLoading(true);
    await postData(BASE_URL + SUBMIT_PICKUP_DRIVER, params, token)
      .then((response) => {
        console.log("response succes", response);
        if (response.success == true) {
          setIsLoading(false);
          setIsModalSuccess(true);
        } else {
          setIsLoading(false);
          setIsModalWarning(true);
          setMessageModalWarning(response.message);
        }
      })
      .catch((error) => {
        console.log("response error", error);
      });
  };

  const uploadPhoto = async (value) => {
    var token = await getValue(TOKEN);
    const data_img = value;

    const form = new FormData();
    console.log("uploadPhoto", data_img);
    form.append("picture", {
      uri: data_img.uri,
      name: data_img.name,
      type: "image/jpeg",
    });

    await postFormData(BASE_URL + UPLOAD_PICTURE_POP, form, token)
      .then((response) => {
        console.log("uploadPhoto Picture", response);
        if (response.success == true) {
          console.log("uploadPhoto Picture", "true");
          setDataImage(response.data.path);
          // submitPickup
        }
      })
      .catch((error) => {
        console.error("uploadPhoto error", error);
      });
  };

  const getPickupPlan = async (id) => {
    var token = await getValue(TOKEN);
    setIsLoading(true);
    var params = {
      pickupId: id_pickup,
    };

    await postData(BASE_URL + DETAIL_PICKUP_DRIVER, params, token).then(
      (response) => {
        setIsLoading(false);
        console.log("response getPIckup detail 1", response);
        if (response.success == true) {
          var sender = response.data.sender;
          setDataDetailPickup(response.data);
          setSenderAddress(
            sender.street +
              " " +
              sender.village +
              " " +
              sender.district +
              " " +
              sender.city +
              " " +
              sender.province
          );
          setDataItem(response.data.items);
          console.log("response getPIckup detail 2", response.data);
          getRoute(
            response.data.sender.city,
            response.data.receiver.district,
            response.data.fleet_id,
            response.data.receiver.city
          );
        } else if (response.message == "Unauthenticated.") {
          goLogout();
        }
      }
    );
  };

  const getRoute = async (
    origin,
    destination_district,
    fleetId,
    destination_city
  ) => {
    var token = await getValue(TOKEN);
    setIsLoading(true);
    var params = {
      origin: origin,
      destination_district: destination_district,
      fleetId: fleetId,
      destination_city: destination_city,
    };

    await postData(BASE_URL + GET_ROUTE, params, token)
      .then((response) => {
        setIsLoading(false);
        console.log("response getRoute", response);
        if (response.success == true) {
          var data_route = response.data;
          setIdRoute(data_route.id);
          getPrice(data_route.id);
        } else if (response.message == "Unauthenticated.") {
          goLogout();
        }
      })
      .catch((error) => {
        console.log("error getRoute", error);
      });
  };

  const getPrice = async (id) => {
    var token = await getValue(TOKEN);
    setIsLoading(true);
    var params = {
      routeId: id,
    };

    await postData(BASE_URL + GET_PRICE, params, token)
      .then((response) => {
        setIsLoading(false);
        console.log("response getPrice", response);
        if (response.success == true) {
          var data_route = response.data;
          setItemType(data_route);
        } else if (response.message == "Unauthenticated.") {
          goLogout();
        }
      })
      .catch((error) => {
        console.log("error getPrice", error);
      });
  };

  const getAllUnit = async () => {
    var units = [
      { id: "barang", name: "barang" },
      { id: "motor", name: "motor" },
      { id: "mobil", name: "mobil" },
    ];
    setUnits(units);

    var token = await getValue(TOKEN);
    await getData(BASE_URL + ALLUNIT, token)
      .then((response) => {
        if (response.success == true) {
          let value = response.data;
          setUnits(value);
          var data = { ...dataItemsTemporary };
          data = { ...data, unit_label: value[0] };
          data = { ...data, unit: value[0] };
          // data = { ...data, type: value.name };
          setDataTemp(data);

          // this.setState({ picker: true });
        } else if (response.message == "Unauthenticated.") {
          // this.props.navigation.replace("Login");
        }
      })
      .catch((error) => {
        console.warn("error getAllUnit", error);
      });
  };

  const getAllServices = async () => {
    var token = await getValue(TOKEN);
    await getData(BASE_URL + SERVICE, token).then((response) => {
      console.log("response SERVICE", response);
      if (response.success == true) {
        let value = response.data;
        setService(value);
        // this.setState({ picker: true });
      } else if (response.message == "Unauthenticated.") {
        // this.props.navigation.replace("Login");
      }
    });
  };

  const onValueStatus = (value, label) => {
    setStatus(value);
  };

  const onSuccess = () => {
    setIsModalSuccess(false);
    navigation.goBack();
  };

  const onEdit = (index, data) => {
    refBottomSheet.current.snapTo(index);
    console.log("data onEdit", data);
    setTypeForm("edit");
    var type = "";

    item_type.map((data_price) => {
      if (data_price.id == data.route_price_id) {
        type = data_price.type;
      }
    });
    setDataTemp({
      id: data.id,
      unit_id: "",
      unit_label: "",
      service_id: data.service_id,
      service_label: data.service == null ? "" : data.service.name,
      name: data.name,
      unit_total: data.unit_total,
      unit_count: data.unit_count,
      unit: data.unit,
      weight: data.weight,
      type: type,
      type_id: data.route_price_id,
      volume: data.volume,
    });
  };

  const onAddItem = () => {
    refBottomSheet.current.snapTo(2);
    setTypeForm("add");
    setDataTemp({
      id: "",
      unit_id: "",
      unit_label: "",
      service_id: "",
      service_label: "",
      name: "",
      unit_total: "",
      unit_count: "",
      unit: units[0],
      weight: "",
      type: "",
      type_id: "",
      volume: "",
    });
  };

  const onSelectDeleted = (index, data) => {
    console.log("onSelectDeleted", data);
    setDataTemp({
      id: data.id,
      unit_id: "",
      unit_label: "",
      service_id: data.service_id,
      service_label: data.service == null ? "" : data.service.name,
      name: data.name,
      unit_total: data.unit_total,
      unit_count: data.unit_count,
      unit: data.unit,
      weight: data.weight,
      type: data.type,
      type_id: data.type,
      volume: data.volume,
    });
    setIsModalOptions(true);
  };

  const onDeleted = async (index, data) => {
    var token = await getValue(TOKEN);
    var params = { itemId: dataItemsTemporary.id };
    console.log("onDeleted params", params);

    await postData(BASE_URL + DELETE_ITEM_DRIVER, params, token)
      .then((response) => {
        setIsModalOptions(false);
        getPickupPlan();
      })
      .catch((error) => {
        console.log("onDeleted error", error);
      });
  };

  // const onSaveItem = ()=>{
  //   var token =  await getValue(TOKEN);
  //   refBottomSheet.current.snapTo(0)
  //   setIsLoading(true)

  // }

  const selectUnits = (i) => {
    setIndexSelected(i);
    setItemModal(units);
    setTypeModal("unit");
    setModalUnitVisible(true);
  };

  const selectType = (i) => {
    setIndexSelected(i);
    setItemModal(item_type);
    setTypeModal("item_type");
    setModalUnitVisible(true);
  };

  const selectService = (i) => {
    setIndexSelected(i);
    setItemModal(service);
    setTypeModal("service");
    setModalUnitVisible(true);
  };

  const onSelectedUnit = (value) => {
    if (typeModal == "unit") {
      var data = { ...dataItemsTemporary };
      data = { ...data, unit_label: value };
      data = { ...data, unit: value };
      // data = { ...data, type: value.name };
      setDataTemp(data);
      setModalUnitVisible(false);
    } else if (typeModal == "item_type") {
      var data = { ...dataItemsTemporary };
      data = { ...data, type: value.type };
      data = { ...data, type_id: value.id };
      setDataTemp(data);
      setModalUnitVisible(false);
    } else {
      var data = { ...dataItemsTemporary };
      data = { ...data, service_label: value.name };
      data = { ...data, service_id: value.id };
      setDataTemp(data);
      setModalUnitVisible(false);
    }
  };

  const onSelectedPrint = async (printer) => {
    // const connect = async () => {
    try {
      BLEPrinter.connectPrinter(printer.inner_mac_address)
        .then((response) => {
          console.warn("onselect res", response);
          actionPrint();
          setModalPrintVisible(false);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    } finally {
      console.warn("finally");
    }
    // };
    // connect();
  };

  const actionPrint = async () => {
    console.warn("actionPrint");
    try {
      const Printer = printerList[selectedValue];
      await Printer.printText(
        "<C><B>Papandayan Cargo</B></C>\n <C>Jl. Kalimas Baru No.58, Perak Utara, Pabean Cantian, Kota SBY, Jawa Timur 61615</C> \n "
      );
    } catch (err) {
      console.warn(err);
    }
  };

  const onNameItemChange = (value) => {
    var data = { ...dataItemsTemporary };
    data = { ...data, name: value };
    setDataTemp(data);
  };

  const onTotalItemChange = (value) => {
    var data = { ...dataItemsTemporary };
    data = { ...data, unit_count: value };
    setDataTemp(data);
  };

  const onTotalUnitChange = (value) => {
    var data = { ...dataItemsTemporary };
    data = { ...data, weight: value };
    setDataTemp(data);
  };

  const onUnitChange = (value) => {
    var data = { ...dataItemsTemporary };
    data = { ...data, unit: value };
    setDataTemp(data);
  };

  const onVolumeChange = (value) => {
    var data = { ...dataItemsTemporary };
    data = { ...data, volume: value };
    setDataTemp(data);
  };

  const onOkEdit = () => {
    setIsModalWarning(false);
  };

  const onPicture = async (value) => {
    await setIsCustomCamera(false);
    await setUriImage(value.uri);
    var dataTmpImage = value;

    for (var i = 0; i < 10; i++) {
      await ImageResizer.createResizedImage(
        dataTmpImage.uri,
        500,
        500,
        "JPEG",
        50,
        0,
        undefined,
        false
      )
        .then((response) => {
          console.log("onPicture=>>>>>>>>", response);
          dataTmpImage = response;
          if (response.size < 10000) {
            i = 10;
            console.log("onPicture upload=>>>>>>>>", response);
            uploadPhoto(dataTmpImage);
          }
          // response.uri is the URI of the new image that can now be displayed, uploaded...
          // response.path is the path of the new image
          // response.name is the name of the new image with the extension
          // response.size is the size of the new image
        })
        .catch((err) => {
          console.log("onPicture error=>>>>>>>>", err);

          // Oops, something went wrong. Check that the filename is correct and
          // inspect err to get more details.
        });
    }
    console.log("onPicture", value);
  };

  const onCapture = () => {};

  const onChooseImage = async () => {
    let options = {
      mediaType: "photo",
      maxWidth: 300,
      maxHeight: 300,
      includeBase64: false,
      quality: 0.5,
    };
    launchImageLibrary(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        setIsEditPhoto(false);
        // dispatch(onDataForShowAlertDefault("Your cancel"));
        return;
      } else if (response.errorCode == "camera_unavailable") {
        setIsEditPhoto(false);
        // dispatch(onDataForShowAlertDefault("Camera not available on device"));
        return;
      } else if (response.errorCode == "permission") {
        setIsEditPhoto(false);
        // dispatch(onDataForShowAlertDefault("Permission not satisfied"));
        return;
      } else if (response.errorCode == "others") {
        setIsEditPhoto(false);
        // dispatch(onDataForShowAlertDefault(response.errorMessage));
        return;
      }

      if ((response.fileSize / (1024 * 1024)).toFixed(2) > 2) {
        setIsEditPhoto(false);
        // dispatch(onDataForShowAlertDefault("Photo size minimal 2 mb"));
      } else {
        setIsEditPhoto(false);
        onPicture(response);
        // uploadFileToServer(response);
      }
      // console.log('base64 -> ', response.base64);
      // console.log('uri -> ', response.uri);
      // console.log('width -> ', response.width);
      // console.log('height -> ', response.height);
      // console.log('fileSize -> ', response.fileSize);
      // console.log('type -> ', response.type);
      // console.log('fileName -> ', response.fileName);
    });
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        var isPermissionGranted = false;
        const granted = await PermissionsAndroid.requestMultiple(
          [
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          ],
          {
            title: "Perizinan Aplikasi",
            message: "Aplikasi ini membutuhkan akses kamera ",
            buttonNeutral: "Tanyakan nanti",
            buttonNegative: "Batal",
            buttonPositive: "OK",
          }
        );
        for (var propName in granted) {
          if (granted.hasOwnProperty(propName)) {
            var propValue = granted[propName];
            isPermissionGranted = true;
            // do something with each element here
          } else {
            isPermissionGranted = false;
          }
        }

        if (isPermissionGranted) {
          lounchCamera();
        } else {
          console.log("Camera permission denied", granted);
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      lounchCamera();
    }
  };
  const lounchCamera = async () => {
    setIsEditPhoto(false);
    setIsCustomCamera(true);
  };

  const onPickup = (value) => {
    if (status == "failed") {
      setModalVisible(true);
      // submitPickup();
    } else {
      submitPickup(value);
    }
  };

  const onPrint = () => {
    if (!isBluetooth) {
      ToastAndroid.show("Harap hidupkan bluetooth anda", ToastAndroid.SHORT);
      setModalPrintVisible(false);
      return;
    }

    setModalPrintVisible(true);
  };

  const renderModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert("Modal has been closed.");
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
                value={reason}
                onChangeText={(v) => setReason(v)}
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
                onPress={() => submitInReason()}
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
  };

  const renderModalUnit = (type) => {
    if (typeModal === "unit") {
      return (
        <TouchableOpacity style={styles.centeredView}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalUnitVisible}
          >
            <TouchableOpacity
              onPress={() => setModalUnitVisible(false)}
              style={styles.centeredView}
            >
              <TouchableWithoutFeedback>
                <View style={styles.modal_dropdown}>
                  <Text style={[styles.modalText, { fontSize: 14 }]}>
                    Pilih Satuan
                  </Text>
                  {itemModal.map((data, key) => {
                    return (
                      <TouchableOpacity
                        key={key}
                        onPress={() => onSelectedUnit(data)}
                      >
                        <Text
                          style={[
                            styles.text_14,
                            { color: "#262F56", margin: moderateScale(5) },
                          ]}
                        >
                          {data}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </Modal>
        </TouchableOpacity>
      );
    } else if (typeModal === "item_type") {
      return (
        <TouchableOpacity style={styles.centeredView}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalUnitVisible}
          >
            <TouchableOpacity
              onPress={() => setModalUnitVisible(false)}
              style={styles.centeredView}
            >
              <TouchableWithoutFeedback>
                <View style={styles.modal_dropdown}>
                  <Text style={[styles.modalText, { fontSize: 14 }]}>
                    Pilih Jenis Barang
                  </Text>
                  {itemModal.map((data, key) => {
                    return (
                      <TouchableOpacity
                        key={key}
                        onPress={() => onSelectedUnit(data)}
                      >
                        <Text
                          style={[
                            styles.text_14,
                            { color: "#262F56", margin: moderateScale(5) },
                          ]}
                        >
                          {data.type}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </Modal>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.centeredView}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalUnitVisible}
          >
            <TouchableOpacity
              onPress={() => setModalUnitVisible(false)}
              style={styles.centeredView}
            >
              <TouchableWithoutFeedback>
                <View style={styles.modal_dropdown}>
                  <Text style={styles.modalText}>Pilih Service</Text>
                  {itemModal.map((data, key) => {
                    return (
                      <TouchableOpacity
                        key={key}
                        onPress={() => onSelectedUnit(data)}
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
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </Modal>
        </View>
      );
    }
  };

  const renderModalPrint = (type) => {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalPrintVisible}
        >
          <TouchableOpacity
            onPress={() => setModalPrintVisible(false)}
            style={styles.centeredView}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 12,
                  padding: 15,
                  marginHorizontal: moderateScale(20),
                }}
              >
                <Text
                  style={[
                    styles.modalText,
                    { marginBottom: verticalScale(20) },
                  ]}
                >
                  Pilih Device
                </Text>

                {devices.map((data) => {
                  return (
                    <TouchableOpacity onPress={() => onSelectedPrint(data)}>
                      <Text
                        style={[
                          styles.text_16,
                          { color: "#262F56", margin: moderateScale(5) },
                        ]}
                      >
                        {data.device_name}
                      </Text>
                      <View style={styles.line}></View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    console.log("data", item);
    return (
      <View>
        <View style={{ flexDirection: "row", marginTop: verticalScale(8) }}>
          <Text style={[styles.text_10, { flex: 1 }]}>{item.name}</Text>
          <Text style={[styles.text_10, { flex: 0.6 }]}>{item.unit_count}</Text>
          <Text
            style={[
              styles.text_10,
              { flex: 0.6, marginLeft: moderateScale(5) },
            ]}
          >
            {item.weight + " " + item.weight_unit}
          </Text>
          <Text
            style={[
              styles.text_10,
              { flex: 0.5, marginLeft: moderateScale(5) },
            ]}
          >
            {item.volume}
          </Text>
          <Text style={[styles.text_10, { flex: 0.8 }]}>
            {item.service != null ? item.service.name : "-"}
          </Text>
          {status_pickup != "success" && (
            <TouchableOpacity onPress={() => onEdit(2, item)}>
              <Image
                style={{ width: moderateScale(15), height: moderateScale(15) }}
                source={require("../../../assets/image/ic_edit.png")}
              ></Image>
            </TouchableOpacity>
          )}

          {status_pickup != "success" && (
            <TouchableOpacity onPress={() => onSelectDeleted(index, item)}>
              <Image
                style={{ width: moderateScale(25), height: moderateScale(20) }}
                source={require("../../../assets/image/del.png")}
              ></Image>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.line}></View>
      </View>
    );
  };

  const renderFooter = () => {
    if (status_pickup == "success") {
      return <View></View>;
    } else {
      return (
        <TouchableOpacity
          style={{ flexDirection: "row", marginTop: moderateScale(10) }}
          onPress={() => onAddItem()}
        >
          <Image
            style={{
              height: moderateScale(15),
              width: moderateScale(15),
              marginRight: moderateScale(8),
            }}
            source={require("../../../assets/image/ic_plus.png")}
          ></Image>
          <Text>Tambah Item</Text>
        </TouchableOpacity>
      );
    }
  };

  const renderBottomSheet = () => {
    return (
      <BottomSheet
        bottomSheerColor="#F1F1F1"
        // backDropColor="red"
        ref={refBottomSheet}
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
              Ubah Data Barang
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
              value={dataItemsTemporary.name}
              style={{
                backgroundColor: "#F1F1F1",
                borderRadius: moderateScale(12),
                fontSize: 12,
                marginTop: verticalScale(5),
              }}
              placeholder="Nama Barang"
              onChangeText={(v) => onNameItemChange(v)}
            ></TextInput>

            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, marginRight: moderateScale(5) }}>
                <Text style={styles.text_10}>Jumlah Barang</Text>
                <TextInput
                  paddingLeft={moderateScale(12)}
                  keyboardType="default"
                  value={dataItemsTemporary.unit_count}
                  style={{
                    backgroundColor: "#F1F1F1",
                    borderRadius: moderateScale(12),
                    fontSize: 12,
                    marginTop: verticalScale(5),
                  }}
                  placeholder="Jumlah Barang"
                  onChangeText={(value) => onTotalItemChange(value)}
                ></TextInput>
              </View>

              <View style={{ flex: 1, marginLeft: moderateScale(5) }}>
                <Text style={styles.text_10}>Satuan</Text>
                {/* <TextInput
                  paddingLeft={moderateScale(12)}
                  value={dataItemsTemporary.unit}
                  style={{
                    backgroundColor: "#F1F1F1",
                    borderRadius: moderateScale(12),
                    fontSize: 12,
                    marginTop: verticalScale(5),
                  }}
                  placeholder="satuan"
                  onChangeText={(value) => onUnitChange(value)}
                ></TextInput> */}
                <TouchableOpacity
                  onPress={() => selectUnits(0)}
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    alignItems: "center",
                    backgroundColor: "#F1F1F1",
                    paddingHorizontal: moderateScale(10),
                    borderRadius: moderateScale(12),
                    marginTop: verticalScale(5),
                    marginRight: moderateScale(10),
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
                    {dataItemsTemporary.unit == ""
                      ? "Satuan"
                      : dataItemsTemporary.unit}
                  </Text>
                  <View style={{ position: "absolute", right: 10 }}>
                    <Image
                      style={{
                        height: verticalScale(16),
                        width: verticalScale(16),
                        resizeMode: "stretch",
                      }}
                      source={require("../../../assets/image/ic_arrow_down.png")}
                    ></Image>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, marginRight: moderateScale(5) }}>
                <Text style={styles.text_10}>Berat Total (Kg)</Text>
                <TextInput
                  paddingLeft={moderateScale(12)}
                  keyboardType="number-pad"
                  value={dataItemsTemporary.weight}
                  style={{
                    backgroundColor: "#F1F1F1",
                    borderRadius: moderateScale(12),
                    fontSize: 12,
                  }}
                  placeholder="Berat Total"
                  onChangeText={(value) => onTotalUnitChange(value)}
                ></TextInput>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.text_10}>Jenis Barang</Text>
                <TouchableOpacity
                  onPress={() => selectType(0)}
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    alignItems: "center",
                    backgroundColor: "#F1F1F1",
                    paddingHorizontal: moderateScale(10),
                    borderRadius: moderateScale(12),
                    marginTop: verticalScale(5),
                    marginRight: moderateScale(10),
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
                    {dataItemsTemporary.type == ""
                      ? "Jenis Barang"
                      : dataItemsTemporary.type}
                  </Text>
                  <View style={{ position: "absolute", right: 10 }}>
                    <Image
                      style={{
                        height: verticalScale(16),
                        width: verticalScale(16),
                        resizeMode: "stretch",
                      }}
                      source={require("../../../assets/image/ic_arrow_down.png")}
                    ></Image>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.text_10}>Volume</Text>
                <TextInput
                  paddingLeft={moderateScale(12)}
                  keyboardType="default"
                  value={dataItemsTemporary.volume}
                  style={{
                    backgroundColor: "#F1F1F1",
                    borderRadius: moderateScale(12),
                    fontSize: 12,
                    marginTop: verticalScale(5),
                  }}
                  placeholder="Volume Barang"
                  onChangeText={(value) => onVolumeChange(value)}
                ></TextInput>
              </View>
            </View>

            <Text style={styles.text_10}>Request Layanan</Text>
            <TouchableOpacity
              style={{ justifyContent: "center" }}
              onPress={() => selectService(0)}
            >
              <TextInput
                editable={false}
                paddingLeft={moderateScale(12)}
                keyboardType="default"
                value={dataItemsTemporary.service_label}
                style={{
                  backgroundColor: "#F1F1F1",
                  borderRadius: moderateScale(12),
                  fontSize: 12,
                  marginTop: verticalScale(5),
                  color: "#000000",
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
                source={require("../../../assets/image/ic_arrow_down.png")}
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
              onPress={() => onSaveItem()}
            >
              <Text style={[styles.text_14, { color: "#FFFFFF" }]}>Simpan</Text>
            </TouchableOpacity>
          </View>
        }
      />
    );
  };

  const RenderAddImage = () => {
    return (
      <Modal animationType="fade" transparent={true} visible={isEditPhoto}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(42, 42, 42, 0.8)",
          }}
        >
          <TouchableOpacity
            style={{
              top: 0,
              left: 0,
              width: width,
              height: height,
              position: "absolute",
              backgroundColor: "transparent",
            }}
            onPress={() => setIsEditPhoto(false)}
          />
          <View
            style={{
              zIndex: 10,
              padding: moderateScale(18),
              backgroundColor: "#ffffff",
              borderRadius: moderateScale(3),
              width: width - moderateScale(48),
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "Montserrat-Bold",
                  textTransform: "capitalize",
                  fontSize: moderateScale(18),
                }}
              >
                Tambah gambar
              </Text>
            </View>
            <TouchableOpacity
              style={{ marginTop: verticalScale(16) }}
              onPress={() => onChooseImage()}
            >
              <Text
                style={{
                  fontFamily: "Montserrat-Regular",
                  textTransform: "capitalize",
                  fontSize: moderateScale(14),
                }}
              >
                Galeri
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: verticalScale(16),
                marginBottom: verticalScale(4),
              }}
              onPress={() => requestCameraPermission()}
            >
              <Text
                style={{
                  fontFamily: "Montserrat-Regular",
                  textTransform: "capitalize",
                  fontSize: moderateScale(14),
                }}
              >
                Kamera
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

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
          style={styles.view_icon_left_arrow}
          onPress={() => navigation.goBack()}
        >
          <Image
            style={styles.icon_left_arrow}
            source={require("../../../assets/image/left_arrow_black.png")}
          ></Image>
        </TouchableOpacity>

        <Text style={styles.text_header}>
          {detail_pickup != null ? detail_pickup.id : "-"}
        </Text>
      </View>
      <ScrollView>
        <View style={styles.container}>
          {renderModalUnit()}
          {renderModalPrint()}
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
                <Text style={styles.text_16}>
                  {detail_pickup != null ? detail_pickup.name : "-"}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.text_10}>Nama Pelanggan</Text>
                <Text style={styles.text_16}>
                  {detail_pickup != null ? detail_pickup.phone : "-"}
                </Text>
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
                {sender_address}
                {/* Perum Suryadadi B13, Jl. Petogogan IX RT 002 RW 002, Kelurahan
              Genting Kalianak, Kecamatan Asemrowo, Surabaya */}
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
                <Text style={styles.text_16}>
                  {detail_pickup != null
                    ? detail_pickup.picktime.substring(0, 11)
                    : "-"}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.text_10}>Tujuan</Text>
                <Text style={styles.text_16}>
                  {detail_pickup != null ? detail_pickup.receiver.city : "-"}
                </Text>
              </View>
            </View>
            <View
              style={{ flexDirection: "row", marginTop: verticalScale(16) }}
            >
              <Text style={[styles.text_10, { flex: 1 }]}>Nama barang</Text>
              <Text style={[styles.text_10, { flex: 0.6 }]}>Jumlah</Text>
              <Text style={[styles.text_10, { flex: 0.6 }]}>Berat</Text>
              <Text style={[styles.text_10, { flex: 0.5 }]}>Volume</Text>
              <Text
                style={[
                  styles.text_10,
                  { flex: 0.8, marginLeft: moderateScale(5) },
                ]}
              >
                Layanan
              </Text>
              {status_pickup != "success" && (
                <View
                  style={{
                    width: moderateScale(15),
                    height: moderateScale(15),
                  }}
                ></View>
              )}
              {status_pickup != "success" && (
                <View
                  style={{
                    width: moderateScale(25),
                    height: moderateScale(15),
                  }}
                ></View>
              )}
            </View>

            <FlatList
              data={data_item}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              extraData={selectedId}
              ListFooterComponent={() => renderFooter()}
            />
          </View>
          <View
            style={{
              width: width - moderateScale(40),
              marginTop: verticalScale(20),
              marginBottom: verticalScale(10),
            }}
          >
            <Text>Status Pickup</Text>
          </View>
          <View
            style={{
              width: width - moderateScale(40),
              paddingHorizontal: moderateScale(16),
              backgroundColor: "#FFFFFF",
              borderRadius: moderateScale(12),
            }}
          >
            {status_pickup == "success" ? (
              <Text
                style={[styles.text_12, { marginVertical: verticalScale(10) }]}
              >
                Sukses
              </Text>
            ) : (
              <Picker
                style={styles.picker}
                itemStyle={{
                  fontSize: moderateScale(3),
                }}
                mode="dropdown"
                placeholder="- Pilih -"
                selectedValue={status}
                onValueChange={(value, label) => onValueStatus(value, label)}
              >
                <Picker.Item label="- Pilih -" value="" />
                <Picker.Item key={0} label="sukses" value="success" />
                <Picker.Item key={1} label="gagal" value="failed" />
                <Picker.Item key={2} label="ada perubahan" value="updated" />
              </Picker>
            )}
          </View>

          <View
            style={{
              width: width - moderateScale(40),
              marginTop: verticalScale(20),
              marginBottom: verticalScale(10),
            }}
          >
            {status_pickup != "success" && (
              <View>
                <Text>Gambar</Text>
                <View
                  style={{
                    width: width - moderateScale(40),
                    height: verticalScale(200),
                    marginVertical: verticalScale(8),
                    borderRadius: moderateScale(20),
                    backgroundColor: "#d5dedc",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity onPress={() => setIsEditPhoto(true)}>
                    {uriImage != "" ? (
                      <Image
                        style={{
                          width: width - moderateScale(40),
                          height: verticalScale(200),
                          borderRadius: moderateScale(20),
                        }}
                        source={{ uri: uriImage }}
                      ></Image>
                    ) : (
                      <Image
                        style={{
                          width: moderateScale(100),
                          height: moderateScale(100),
                          resizeMode: "stretch",
                        }}
                        source={require("../../../assets/image/photo_camera.png")}
                      ></Image>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {status_pickup == "success"  ? (
              <TouchableOpacity
                onPress={() => onPrint()}
                style={[styles.button_primary, { backgroundColor: "#FFFFFF" }]}
              >
                <Text style={[styles.text_14, { color: "#000000" }]}>
                  Cetak
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => onPickup()}
                style={styles.button_primary}
              >
                <Text style={[styles.text_14, { color: "#FFFFFF" }]}>
                  PICK UP
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {renderModal()}
      {renderBottomSheet()}
      <Loading visible={isLoading}></Loading>
      <ModalSuccess
        visible={isModalSuccess}
        message={"Submit Pick Up Berhasil"}
        onOk={() => onSuccess()}
      ></ModalSuccess>

      <ModalWarning
        visible={isModalWarning}
        message={messageModalWarning}
        onOk={() => onOkEdit()}
      ></ModalWarning>

      <ModalOptions
        visible={isModalOptions}
        message={"Yakin ingin menghapus item ini?"}
        onOk={() => onDeleted()}
        onNo={() => setIsModalOptions(false)}
      ></ModalOptions>

      <CustomCamera
        modalVisible={isCustomCamera}
        initialProps={props}
        onPicture={(value) => onPicture(value)}
        onCapture={(v) => onCapture(v)}
      ></CustomCamera>
      <RenderAddImage />
    </SafeAreaView>
  );
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
  modalText: {
    marginBottom: 10,
    fontSize: 20,
    textAlign: "center",
    fontFamily: "Montserrat-Bold",
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
    flex: 1,
    height: verticalScale(40),
    width: width - moderateScale(40),
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
  view_icon_left_arrow: {
    position: "absolute",
    left: moderateScale(10),
    width: moderateScale(30),
    height: moderateScale(30),
    justifyContent: "center",
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
  picker: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    color: "#8D8F92",
  },
  line: {
    width: "100%",
    height: 0.9,
    backgroundColor: "#DCDCDC",
    marginTop: verticalScale(7),
  },
  text_14: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
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
