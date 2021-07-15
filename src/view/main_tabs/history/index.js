import React, { useState, useRef, useEffect } from "react";
import Header from "../../Header";
import { moderateScale, verticalScale } from "../../../util/ModerateScale";
import { postData, BASE_URL, HISTORY_POP } from "../../../network/ApiService";
import moment from "moment";
import { Loading } from "../../../util/Loading";
import { getValue } from "../../../util/AsyncStorage";
import { LOGIN_STATUS, TOKEN } from "../../../util/StringConstans";

import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  KeyboardAvoidingView,
} from "react-native";
const { width, height } = Dimensions.get("window");

export default function History({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getHistory();
    });
    return unsubscribe;
  }, []);

  const goBack = () => {
    navigation.goBack();
  };

  const getHistory = async () => {
    setIsLoading(true);
    let token = await getValue(TOKEN);
    var params = {
      // startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      startDate: moment("2021-03-03").format("YYYY-MM-DD"),
    };

    console.log("params", params);
    await postData(BASE_URL + HISTORY_POP, params, token)
      .then((response) => {
        console.log("response", response);
        setIsLoading(false);
        if (response.success) {
          var data_response = [];
          data_response = response.data.data;
          data_response.map((data,index)=>{
            data_response[index].isSelected = false;
          })
          setHistory(data_response);
        }
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const onRefresh = () => {
    setIsRefresh(true);
  };

  const isSelectList = (item, index) => {
    console.log("data", item);
    console.log("data", item.isSelected);
    var data_history = history;
    data_history[index].isSelected = !data_history[index].isSelected;
    setHistory(data_history);
  };

  const renderListEmpty = () => {
    return (
      <View>
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
          <Text>History Kosong</Text>
        </View>
      </View>
    );
  };

  const renderItemHistory = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => isSelectList(item, index)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: verticalScale(10),
        }}
      >
        <View>
          <Text style={styles.text_bold_14}>#0930.14482340</Text>
          <Text style={[styles.text_title_12, { color: "#8D8F92" }]}>
            Surabaya - Pontianak
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        ></View>
        <Image
          style={{
            width: moderateScale(8),
            height: moderateScale(8),
            resizeMode: "stretch",
            marginRight: moderateScale(5),
          }}
          source={require("../../../assets/image/ic_arrow_right.png")}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header></Header>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.view_icon_left_arrow}
          onPress={() => goBack()}
        >
          <Image
            style={styles.icon_left_arrow}
            source={require("../../../assets/image/left-arrow-black.png")}
          ></Image>
        </TouchableOpacity>
        <Text style={styles.text_header}>History</Text>
      </View>
      <View style={styles.content}>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            width: width - moderateScale(40),
            borderRadius: 12,
            paddingHorizontal: moderateScale(10),
            marginBottom: verticalScale(20),
          }}
        >
          <TextInput placeholder="Hari Ini"></TextInput>
        </View>

        <Text
          style={{
            fontSize: 16,
            fontFamily: "Montserrat-Regular",
            fontWeight: "bold",
            color: "#A80002",
          }}
        >
          Hari Ini
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: verticalScale(16),
          }}
        >
          <View>
            <Text>PRK 1365 8834 FDE8</Text>
            <Text style={[styles.text_title_12, { color: "#8D8F92" }]}>
              Surabaya - Medan
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          ></View>
          <View style={styles.view_circle}></View>
          <Text
            style={[
              styles.text_title_14,
              {
                color: "#717171",
              },
            ]}
          ></Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: verticalScale(10),
          }}
        >
          <View>
            <Text>GRK 0923 5411 HGP1</Text>
            <Text style={[styles.text_title_12, { color: "#8D8F92" }]}>
              Surabaya - Pontianak
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          ></View>
          <Image
            style={styles.icon_check}
            source={require("../../../assets/image/ic_check.png")}
          />
          <Text
            style={[
              styles.text_title_14,
              {
                color: "#717171",
              },
            ]}
          ></Text>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          width: width,
          paddingHorizontal: moderateScale(20),
          marginTop: verticalScale(20),
        }}
      >
        <FlatList
          data={history}
          renderItem={renderItemHistory}
          keyExtractor={(item, index) => index.toString()}
          extraData={selectedId}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              colors={["#9Bd35A", "#689F38"]}
              refreshing={isRefresh}
              onRefresh={onRefresh}
            />
          }
        />
      </View>
      <Loading visible={isLoading}></Loading>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: verticalScale(24),
    width: width,
    paddingRight: moderateScale(20),
    paddingLeft: moderateScale(20),
    backgroundColor: "#F1F1F1",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: verticalScale(18),
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
  text_header: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
  },
  text_12: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  text_bold_12: {
    fontSize: 12,
    fontFamily: "Montserrat-Bold",
  },

  text_bold_14: {
    fontSize: 14,
    fontFamily: "Montserrat-Bold",
  },
  text_title_12: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
  },
  text_title_14: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
  icon_check: {
    width: moderateScale(17),
    height: moderateScale(17),
    resizeMode: "stretch",
    marginRight: moderateScale(5),
  },
  view_circle: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: 6,
    backgroundColor: "#FED43B",
    marginRight: moderateScale(10),
  },
});
