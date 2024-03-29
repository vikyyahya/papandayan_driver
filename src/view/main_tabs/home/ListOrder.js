import React, { useState, useRef, useEffect } from "react";
import { moderateScale, verticalScale } from "../../../util/ModerateScale";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Header from "../../Header";
import { saveData } from "../../../util/AsyncStorage";
import {
  BASE_URL,
  GET_BY_PICKUP_PLANE,
  TOTAL_VOL_DRIVER,
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

export default function ListOrder({ navigation, route }) {
  const [data_pickup, setDataPickup] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [kg, setKg] = useState(0);
  const [volume, setVolume] = useState(0);
  const [searchPop, setSearchPop] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data_pickup_plan, number } = route.params;
  const [isRefresh, setIsRefresh] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getPickupPlan();
      getVolumeAndTotal();
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    getPickupPlan();
    getVolumeAndTotal();
  }, []);

  const goLogout = () => {
    saveData(TOKEN, "");
    saveData(LOGIN_STATUS, "0");
    navigation.replace("Login");
  };

  const getVolumeAndTotal = async () => {
    var token = await getValue(TOKEN);
    var params = {
      pickupPlanId: data_pickup_plan.id,
    };
    setIsLoading(true);
    await postData(BASE_URL + TOTAL_VOL_DRIVER, params, token)
      .then((response) => {
        setIsLoading(false);
        console.log("response getVolumeAndTotal", response);
        console.log("response getVolumeAndTotal", response);

        if (response.success == true) {
          setKg(response.data.kilo);
          setVolume(response.data.volume);
        } else {
        }
      })
      .catch((error) => {
        console.log("error TOTAL_VOL_DRIVER", error);
      });
  };

  const searchPickupPlan = async ()=>{
    var token = await getValue(TOKEN);
    var params = {
      perPage: 20,
      page: 1,
      id: "",
      name: searchPop,
      city: "",
      district: "",
      village: "",
      street: "",
      picktime: "",
      sort: "",
      pickupPlanId: data_pickup_plan.id,
    };
    console.log("Param", params);

    setIsLoading(true);
    await postData(BASE_URL + GET_BY_PICKUP_PLANE, params, token).then(
      (response) => {
        setIsLoading(false);
        if (response.success == true) {
          setDataPickup(response.data.data);
          console.log("response searchPickupPlan", response.data.data);
        } else if (response.message == "Unauthenticated.") {
          goLogout();
        }
      }
    );
  }

  const getPickupPlan = async () => {
    var token = await getValue(TOKEN);
    console.log("response token", token);
    var params = {
      perPage: 20,
      page: 1,
      id: "",
      name: "",
      city: "",
      district: "",
      village: "",
      street: "",
      picktime: "",
      sort: "",
      pickupPlanId: data_pickup_plan.id,
    };
    setIsLoading(true);
    console.log("Param", params);

    await postData(BASE_URL + GET_BY_PICKUP_PLANE, params, token).then(
      (response) => {
        console.log("response getPIckup1", response);
        setIsLoading(false);
        if (response.success == true) {
          setDataPickup(response.data.data);
          console.log("response getPIckup2", response.data.data);
        } else if (response.message == "Unauthenticated.") {
          goLogout();
        }
      }
    );
  };

  const _onRefresh = React.useCallback(async () => {
    setIsRefresh(true);
    var token = await getValue(TOKEN);
    console.log("response token", token);
    var date = moment("2021-03-03").format("YYYY-MM-DD");
    var parans = {
      perPage: 10,
      page: 1,
      id: "",
      name: "",
      city: "",
      district: "",
      village: "",
      street: "",
      picktime: "",
      sort: "",
      pickupPlanId: data_pickup_plan.id,
    };
    await postData(BASE_URL + GET_BY_PICKUP_PLANE, parans, token).then(
      (response) => {
        console.log("response getPIckup1", response);
        setIsLoading(false);
        setIsRefresh(false);
        if (response.success == true) {
          setDataPickup(response.data.data);
          console.log("response getPIckup2", response.data.data);
        } else if (response.message == "Unauthenticated.") {
          goLogout();
        }
      }
    );
  }, [isRefresh]);

  const renderIconStatus = (data) => {
    if (data.status_pick == "success") {
      return (
        <Image
          style={styles.icon_check}
          source={require("../../../assets/image/ic_check.png")}
        ></Image>
      );
    } else if (data.status_pick == "failed") {
      return (
        <Image
          style={styles.icon_check}
          source={require("../../../assets/image/ic_cross.png")}
        ></Image>
      );
    } else if (data.status_pick == "repickup") {
      return (
        <Image
          style={styles.icon_check}
          source={require("../../../assets/image/ic_reload.png")}
        ></Image>
      );
    } else {
      return (
        <Image
          style={styles.icon_check}
          source={require("../../../assets/image/ic_check_yellow.png")}
        ></Image>
      );
    }
  };

  const renderItem = ({ item, index }) => {
    console.log("renderItem ", item);

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("DetailOrder", {
            id_pickup: item.id,
            number: item.number,
            status_pickup:
              item.proof_of_pickup == null
                ? ""
                : item.proof_of_pickup.status_pick,
          })
        }
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: verticalScale(10),
          marginTop: verticalScale(5),
          borderBottomColor: "#DCDCDC",
          borderBottomWidth: 0.7,
          paddingBottom: verticalScale(10),
        }}
      >
        <View>
          <Text>{item.number}</Text>
          <Text style={[styles.text_title_12, { color: "#4A4A4A" }]}>
            {item.name} {item.phone}
          </Text>
          <Text style={[styles.text_title_12, { color: "#4A4A4A" }]}>
            {item.sender.street}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        ></View>
        {item.proof_of_pickup != null ? (
          renderIconStatus(item.proof_of_pickup)
        ) : (
          <Image
            style={styles.icon_check}
            source={require("../../../assets/image/ic_search_grey.png")}
          ></Image>
        )}
      </TouchableOpacity>
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
          style={styles.icon_left_arrow}
          onPress={() => navigation.goBack()}
        >
          <Image
            style={{
              height: moderateScale(12),
              width: moderateScale(20),
              resizeMode: "stretch",
            }}
            source={require("../../../assets/image/left_arrow_black.png")}
          ></Image>
        </TouchableOpacity>

        <Text style={styles.text_header}>{data_pickup_plan.number}</Text>
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

            <TextInput
              style={{ width: "100%" }}
              placeholder="Cari Order"
              value={searchPop}
              onChangeText={(value) => setSearchPop(value)}
              multiline={false}
              returnKeyType={"done"}
              onSubmitEditing={(event) => searchPickupPlan()}

            ></TextInput>
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
              marginBottom: verticalScale(20),
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
                <Text style={styles.text_18_bold}>{data_pickup.length}</Text>
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
                <Text style={styles.text_18_bold}>{volume}</Text>
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
                <Text style={styles.text_18_bold}>{kg}</Text>
              </View>
            </View>
          </View>

          <FlatList
            data={data_pickup}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            extraData={selectedId}
            refreshControl={
              <RefreshControl
                colors={["#9Bd35A", "#689F38"]}
                refreshing={isRefresh}
                onRefresh={_onRefresh}
              />
            }
          />
        </View>
      </View>
      <Loading visible={isLoading}></Loading>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F1F1F1",
  },
  content: {
    flex: 1,
    width: width,
    paddingRight: moderateScale(20),
    paddingLeft: moderateScale(20),
    paddingBottom: verticalScale(20),
    paddingTop: verticalScale(10),
  },
  icon_check: {
    width: moderateScale(17),
    height: moderateScale(17),
    resizeMode: "stretch",
    marginRight: moderateScale(5),
  },
  icon_left_arrow: {
    position: "absolute",
    left: moderateScale(20),
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
