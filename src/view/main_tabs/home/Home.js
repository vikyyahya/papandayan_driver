import React, { useState, useRef, useEffect } from "react";
import { moderateScale, verticalScale } from "../../../util/ModerateScale";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Header from "../../Header";
import { saveData } from "../../../util/AsyncStorage";
import { BASE_URL,PICKUP_DRIVER,getData,postData } from "../../../network/ApiService";
import { getValue } from "../../../util/AsyncStorage";
import { LOGIN_STATUS,TOKEN } from "../../../util/StringConstans";
import  moment  from "moment";
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
} from "react-native";
import { Icon } from "native-base";
const { width, height } = Dimensions.get("window");

export default function Home({ navigation }) {
    const [data_pickup, setDataPickup] = useState([]);
    const [selectedId, setSelectedId] = useState(0);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
          // getUrlVoice();
         getPickupPlan()
        });
        return unsubscribe;
      }, []);

    const goLogout = ()=> {
        saveData(TOKEN, "");
        saveData(LOGIN_STATUS, "0");
        navigation.replace("Login");
      }

    const getPickupPlan = async() =>{
        var token =  await getValue(TOKEN);
        console.log("response token", token)
        var date = moment("2021-03-03").format('YYYY-MM-DD');
        var parans= {
          "perPage": 10,
          "id": "",
          "page": 1,
          "startDate": "",
          "endDate": "",
          "licenseNumber": "",
          "status": "",
          "vehicleType": "",
          "sort": {
              "field": "",
              "order": ""
          }
      }
        await postData(BASE_URL+PICKUP_DRIVER,parans,token).then((response)=>{
          console.log("response getPIckup home", response)
          if (response.success == true) {
            setDataPickup(response.data.data)
            console.log("response getPIckup home", response.data.data)

          }else if(response.message == "Unauthenticated."){
            goLogout()
          }
    
          })
      }


    const  renderItem = ({ item, index}) =>{
      console.log("data",item)
        return(
                <TouchableOpacity
                    onPress={()=> navigation.navigate("ListOrder",{data_pickup_plan: item})}
                      style={{
                        flexDirection: "row",
                        height: verticalScale(90),
                        backgroundColor: "#FFFFFF",
                        width: width - moderateScale(40),
                        borderRadius: moderateScale(12),
                        alignItems: "center",
                        marginTop: verticalScale(16),
                      }}
                    >
                      <View
                        style={{
                          width: moderateScale(4),
                          height: verticalScale(16),
                          backgroundColor: "#A80002",
                        }}
                      ></View>
                      <Image
                        style={{
                          width: moderateScale(48),
                          height: moderateScale(48),
                          marginHorizontal: moderateScale(12),
                        }}
                        source={require("../../../assets/image/ic_box_red.png")}
                      ></Image>
                      <View>
                        <Text style={styles.text_14_bold}>{item.id}</Text>
                        <Text style={[styles.text_11, { color: "#262F56" }]}>
                          Total {item.total_pickup_order} order pelanggan
                        </Text>
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
                          <Text style={[styles.text_12_bold, { color: "#A80002" }]}>
                            1
                          </Text>
                          / {item.total_pickup_order}
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
        )
      }


    return(
        <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={"light-content"} backgroundColor="#A80002" />
        <Header></Header>

        <KeyboardAwareScrollView
          enableResetScrollToCoords={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.container}>
            <View style={styles.content}>
              <Text style={[styles.text_16]}>
                Selamat pagi
                <Text style={styles.text_16_bold}> Rahmadi</Text>{" "}
              </Text>
              <Text style={[styles.text_12, { marginTop: verticalScale(5) }]}>
                Hari ini ada 3 Pickup Plan untuk kamu
              </Text>

              <View>

                <FlatList
                    data={data_pickup}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={selectedId}
                />
            </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>

    )

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
  