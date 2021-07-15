import React, { useState, useRef, useEffect } from "react";
import { moderateScale, verticalScale } from "../../../util/ModerateScale";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Header from "../../Header";
import { saveData } from "../../../util/AsyncStorage";
import {
  BASE_URL,
  PICKUP_DRIVER,
  TOTAL_POP,
  TOTAL_POD,
  PROFILE,
  getData,
  postData,
} from "../../../network/ApiService";
import { getValue } from "../../../util/AsyncStorage";
import { LOGIN_STATUS, TOKEN } from "../../../util/StringConstans";
import moment from "moment";
import { Loading } from "../../../util/Loading";
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
  RefreshControl,
} from "react-native";
const { width, height } = Dimensions.get("window");

export default function HomeOne({ navigation }) {
  const [data_pickup, setDataPickup] = useState([]);
  const [data_pod, setDataPod] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [name, setName] = useState("");
  const [data_time, setDataTime] = useState("");
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataDashboard, setdataDashboard] = useState([
    { label: "Total Selesai Pickup", totalSuccess: 0, totalData: 0 },
    { label: "Total Selesai Delivery", totalSuccess: 0, totalData: 0 },
    { label: "Total Pembatalan Pickup", totalSuccess: 0, totalData: 0 },
    { label: "Total Pembatalan Delivery", totalSuccess: 0, totalData: 0 },
  ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // getUrlVoice();
      // getPickupPlan();
      getDataProfile();
      getDataTotalPOP();
      getDataTotalPOD();
      handleTime();
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    setIsLoading(true);
    // getPickupPlan();
    getDataProfile();
    getDataTotalPOP();
    getDataTotalPOD();
    handleTime();
  }, []);

  const handleTime = () => {
    var time = moment().format("HH");
    if (time <= 10) {
      setDataTime("pagi");
    } else if (time >= 11 && time <= 14) {
      setDataTime("siang");
    } else if (time >= 15 && time <= 17) {
      setDataTime("sore");
    } else if (time >= 18) {
      setDataTime("malam");
    }
  };

  const goLogout = () => {
    saveData(TOKEN, "");
    saveData(LOGIN_STATUS, "0");
    navigation.replace("Login");
  };

  const resetDataDashboard = () => {
    setdataDashboard([
      { label: "Total Selesai Pickup", totalSuccess: 0, totalData: 0 },
      { label: "Total Selesai Delivery", totalSuccess: 0, totalData: 0 },
      { label: "Total Pembatalan Pickup", totalSuccess: 0, totalData: 0 },
      { label: "Total Pembatalan Delivery", totalSuccess: 0, totalData: 0 },
    ]);
  };

  const getDataTotalPOP = async () => {
    let token = await getValue(TOKEN);
    var params = {
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
    };

    console.log("params", params);

    await postData(BASE_URL + TOTAL_POP, params, token).then((response) => {
      console.log("response getDataTotalPOP", response);
      if (response.success == true) {
        var tmpLength = 0;
        var tmpSuccess = 0;
        var tmpCancelled = 0;
        var tmpDataDashboard = dataDashboard;
        response.data.map((data) => {
          tmpLength += data.total_order;
          tmpSuccess += data.total_draft_pop;
          tmpCancelled += data.total_cancelled_pop;
        });
        tmpDataDashboard[0].totalData = tmpLength;
        tmpDataDashboard[0].totalSuccess = tmpSuccess;
        tmpDataDashboard[2].totalSuccess = tmpCancelled;
        setdataDashboard(tmpDataDashboard);
      } else if (response.message == "Unauthenticated.") {
        goLogout();
      }
    });
  };

  const getDataTotalPOD = async () => {
    let token = await getValue(TOKEN);
    var params = {
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      // startDate:"",
      // endDate: "",
    };
    console.log("response getDataTotalPOD", params);

    await postData(BASE_URL + TOTAL_POD, params, token).then((response) => {
      console.log("response getDataTotalPOD", response);
      if (response.success == true) {
        var tmpLength = 0;
        var tmpSuccess = 0;
        var tmpCancelled = 0;
        var tmpDataDashboard = dataDashboard;
        response.data.map((data) => {
          tmpLength += data.total_order;
          tmpSuccess += data.total_draft_pod;
        });
        tmpDataDashboard[1].totalData = tmpLength;
        tmpDataDashboard[1].totalSuccess = tmpSuccess;
        tmpDataDashboard[3].totalSuccess = tmpCancelled;
        setdataDashboard(tmpDataDashboard);
        setIsRefresh(false);
        setIsLoading(false);
      } else if (response.message == "Unauthenticated.") {
        goLogout();
      }
    });
  };

  const getDataProfile = async () => {
    let token = await getValue(TOKEN);
    await getData(BASE_URL + PROFILE, token).then((response) => {
      console.log("getDataProfile ", response);
      if (response.success == true) {
        let value = response.data;
        setName(response.data.username);
      } else if (response.code == 4001) {
      } else if (response.message == "Unauthenticated.") {
        saveData(TOKEN, "");
        saveData(LOGIN_STATUS, "0");
        navigation.replace("Login");
      }
    });
  };

  const getPickupPlan = async () => {
    var token = await getValue(TOKEN);
    var parans = {
      perPage: 10,
      id: "",
      page: 1,
      startDate: "",
      endDate: "",
      licenseNumber: "",
      status: "",
      vehicleType: "",
      sort: {
        field: "",
        order: "",
      },
    };
    await postData(BASE_URL + PICKUP_DRIVER, parans, token).then((response) => {
      console.log("response getPIckup home", response);
      setIsLoading(false);
      if (response.success == true) {
        setDataPickup(response.data.data);
        console.log("response getPIckup home", response.data.data);
      } else if (response.message == "Unauthenticated.") {
        goLogout();
      }
    });
  };

  const _onRefresh = React.useCallback(async () => {
    setIsRefresh(true);
    var token = await getValue(TOKEN);
    var date = moment("2021-03-03").format("YYYY-MM-DD");
    var parans = {
      perPage: 10,
      id: "",
      page: 1,
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      licenseNumber: "",
      status: "",
      vehicleType: "",
      sort: {
        field: "",
        order: "",
      },
    };
    await resetDataDashboard();
    await getDataTotalPOP();
    await getDataTotalPOD();
    // await postData(BASE_URL + PICKUP_DRIVER, parans, token).then((response) => {
    //   console.log("response getPIckup home", response);
    //   if (response.success == true) {
    //     setDataPickup(response.data.data);
    //     setIsRefresh(false);
    //   } else if (response.message == "Unauthenticated.") {
    //     goLogout();
    //   }
    // });
  }, [isRefresh]);

  const onSelectDashboard = (index) => {
    if (index == 0) {
      navigation.navigate("POP", {
        status: true,
      });
    }
  };

  const renderListEmpty = () => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          height: verticalScale(300),
        }}
      >
        <Image
          style={{ width: moderateScale(80), height: moderateScale(80) }}
          source={require("../../../assets/image/empty.png")}
        ></Image>
        <Text>Pickup Plane Kosong</Text>
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => onSelectDashboard(index)}
        style={{
          flexDirection: "row",
          height: verticalScale(90),
          backgroundColor: "#FFFFFF",
          width: width - moderateScale(40),
          borderRadius: moderateScale(12),
          alignItems: "center",
          marginVertical: verticalScale(5),
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 5,
          elevation: 2,
        }}
      >
        <View
          style={{
            width: moderateScale(4),
            height: verticalScale(16),
            backgroundColor: "#A80002",
            marginRight: moderateScale(30),
          }}
        ></View>

        <View
          style={{
            flex: 1,
          }}
        >
          <Text style={styles.text_14_bold}>{item.label}</Text>
        </View>
        <View
          style={{
            width: moderateScale(48),
            height: moderateScale(48),
            backgroundColor: "#E5E5E5",
            borderRadius: moderateScale(50),
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: moderateScale(12),
          }}
        >
          <Text style={styles.text_12}>
            <Text style={[styles.text_14_bold, { color: "#000000" }]}>
              {item.totalSuccess}
            </Text>
            /{item.totalData}
          </Text>
        </View>
        <Image
          style={{
            width: moderateScale(10),
            height: moderateScale(15),
            marginHorizontal: moderateScale(12),
          }}
          source={require("../../../assets/image/ic_arrow_right.png")}
        ></Image>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle={"light-content"} backgroundColor="#A80002" />
      <Header></Header>

      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={[styles.text_16]}>
            Selamat {data_time}
            <Text style={styles.text_16_bold}> {name}</Text>
          </Text>
          <Text style={[styles.text_12, { marginTop: verticalScale(5) }]}>
            Hari ini anda sudah menyelesaikan{" "}
            <Text style={[styles.text_14_bold, { color: "#1EB448" }]}>
              {dataDashboard[0].totalSuccess} Pickup Plan{" "}
            </Text>
            dan sisa{" "}
            <Text style={[styles.text_14_bold, { color: "#A80002" }]}>
              {" "}
              {dataDashboard[3].totalSuccess} Delivery Plan{" "}
            </Text>{" "}
            yang belum diselesaikan.
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: moderateScale(20),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("POP")}
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            width: moderateScale(164),
            height: moderateScale(164),
            marginRight: moderateScale(7),
            borderRadius: moderateScale(20),
            justifyContent: "center",
            alignItems: "center",
            padding: moderateScale(7),
          }}
        >
          <Image
            source={require("../../../assets/image/ic_pickup_green.png")}
            style={{
              width: moderateScale(80),
              height: moderateScale(80),
              resizeMode: "stretch",
            }}
          ></Image>
          <Text style={styles.text_14_bold}>Proof of Pickup</Text>
          <Text style={[styles.text_12, { textAlign: "center" }]}>
            Pilih menu ini untuk melihat Pickup Plan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("HomePOD")}
          style={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            width: moderateScale(164),
            height: moderateScale(164),
            marginLeft: moderateScale(7),
            borderRadius: moderateScale(20),
            justifyContent: "center",
            alignItems: "center",
            padding: moderateScale(7),
          }}
        >
          <Image
            source={require("../../../assets/image/ic_delivery_green.png")}
            style={{
              width: moderateScale(80),
              height: moderateScale(80),
              resizeMode: "stretch",
            }}
          ></Image>
          <Text style={styles.text_14_bold}>Proof of Delivery</Text>
          <Text style={[styles.text_12, { textAlign: "center" }]}>
            Pilih menu ini untuk melihat Delivery Plan
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 1,
          width: width,
          paddingHorizontal: moderateScale(20),
          marginTop: verticalScale(20),
        }}
      >
        <Text style={styles.text_14_bold}>Hari Ini</Text>
        <FlatList
          data={dataDashboard}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          extraData={selectedId}
          ListEmptyComponent={renderListEmpty}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              colors={["#9Bd35A", "#689F38"]}
              refreshing={isRefresh}
              onRefresh={_onRefresh}
            />
          }
        />
      </View>
      <Loading visible={isLoading}></Loading>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F1F1F1",
  },
  content: {
    width: width,
    paddingRight: moderateScale(20),
    paddingLeft: moderateScale(20),
    paddingBottom: verticalScale(20),
    paddingTop: verticalScale(20),
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
  text_11: {
    fontFamily: "Montserrat-Regular",
    fontSize: 11,
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
