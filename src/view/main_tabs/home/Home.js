import React, { useState, useRef, useEffect } from "react";
import { moderateScale, verticalScale } from "../../../util/ModerateScale";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Header from "../../Header";
import { saveData } from "../../../util/AsyncStorage";
import {
  BASE_URL,
  PICKUP_DRIVER,
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
import { Icon } from "native-base";
const { width, height } = Dimensions.get("window");

export default function Home({ navigation, route }) {
  const { status } = route.params;

  const [data_pickup, setDataPickup] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [name, setName] = useState("");
  const [data_time, setDataTime] = useState("");
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // getUrlVoice();
      if (route.params != undefined) {
        getPickupPlan(status);
      } else {
        getPickupPlan(false);
      }
      getDataProfile();
      handleTime();
    });
    return unsubscribe;
  }, []);
  useEffect(() => {
    setIsLoading(true);
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

  const customSort = (a, b) => {
    console.log("customSort");
    // return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return moment(b.created_at) - moment(a.created_at);
  };

  const getPickupPlan = async (isDate) => {
    var token = await getValue(TOKEN);
    var date = moment().format("YYYY-MM-DD");
    var startDate = moment().subtract(5, "d").format("YYYY-MM-DD");
    var params = {
      perPage: 20,
      id: "",
      page: 1,
      startDate: status == true ? date : startDate,
      endDate: date,
      licenseNumber: "",
      status: "",
      vehicleType: "",
      sort: {
        field: "",
        order: "",
      },
    };

    console.log("params ", params);
    await postData(BASE_URL + PICKUP_DRIVER, params, token).then((response) => {
      console.log("response getPIckup home", response);
      setIsRefresh(false);
      setIsLoading(false);
      if (response.success == true) {
        var dataPickup = [];
        dataPickup = response.data.data;
        dataPickup.sort(customSort);
        setDataPickup(dataPickup);
        console.log("response getPIckup home", response.data.data);
      } else if (response.message == "Unauthenticated.") {
        goLogout();
      }
    });
  };

  const _onRefresh = React.useCallback(async () => {
    setIsRefresh(true);
    getPickupPlan(status);
  }, [isRefresh]);

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
    console.log("renderItem", item);
    var date = moment(item.created_at).format("YYYY-MM-DD");
    var data_pickup = [];
    var applied = 0;
    var updated = 0;
    var failed = 0;
    var success = 0;
    data_pickup = item.pickups;

    if (data_pickup.length > 0) {
      for (var i = 0; i < data_pickup.length; i++) {
        var tmp = [];
        tmp = item.pickups[i].proof_of_pickups;
        console.log("data------", tmp);
        if (tmp.length > 0) {
          if (item.pickups[i].proof_of_pickups[0].status_pick == "success") {
            applied += 1;
            success += 1;
          } else if (
            item.pickups[i].proof_of_pickups[0].status_pick == "failed"
          ) {
            applied += 1;
          }
        }
      }
    }

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ListOrder", {
            data_pickup_plan: item,
            number: item.number,
          })
        }
        style={{
          flexDirection: "row",
          height: verticalScale(90),
          backgroundColor: "#FFFFFF",
          width: width - moderateScale(40),
          borderRadius: moderateScale(12),
          alignItems: "center",
          justifyContent: "center",
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
            backgroundColor:
              applied == success && applied != 0 ? "#1EB448" : "#A80002",
          }}
        ></View>
        <Image
          style={{
            width: moderateScale(48),
            height: moderateScale(48),
            marginHorizontal: moderateScale(12),
          }}
          source={
            applied == success && applied != 0
              ? require("../../../assets/image/ic_box_green.png")
              : require("../../../assets/image/ic_box_red.png")
          }
        ></Image>
        <View>
          <Text style={styles.text_14_bold}>{item.number}</Text>
          <Text style={[styles.text_11, { color: "#262F56" }]}>
            Total {item.total_pickup_order} order pelanggan
          </Text>
          <Text style={[styles.text_11, { color: "#262F56" }]}>{date}</Text>
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
          {applied == success && applied != 0 ? (
            <Image
              style={{
                width: moderateScale(30),
                height: moderateScale(30),
                marginHorizontal: moderateScale(12),
              }}
              source={require("../../../assets/image/ic_check_success.png")}
            ></Image>
          ) : (
            <Text style={styles.text_12}>
              <Text style={[styles.text_12_bold, { color: "#A80002" }]}>
                {applied}{" "}
              </Text>
              / {item.total_pickup_order}
            </Text>
          )}
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
            Ada {data_pickup.length} Pickup Plan untuk kamu
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          width: width,
          paddingHorizontal: moderateScale(20),
        }}
      >
        <FlatList
          data={data_pickup}
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
