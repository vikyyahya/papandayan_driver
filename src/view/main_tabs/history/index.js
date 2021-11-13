import React, { useState, useRef, useEffect } from "react";
import Header from "../../Header";
import { moderateScale, verticalScale } from "../../../util/ModerateScale";
import { postData, BASE_URL, HISTORY_POP } from "../../../network/ApiService";
import moment from "moment";
import { Loading } from "../../../util/Loading";
import { getValue } from "../../../util/AsyncStorage";
import { LOGIN_STATUS, TOKEN } from "../../../util/StringConstans";
import { Picker } from "@react-native-picker/picker";

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
  Modal,
  RefreshControl,
  KeyboardAvoidingView,
} from "react-native";
const { width, height } = Dimensions.get("window");
const filterType = [
  { id: 0, title: "Hari ini" },
  { id: 1, title: "Minggu ini" },
  { id: 2, title: "Bulan ini" },
];

export default function History({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [history, setHistory] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [modalVisible, setModalVisible] = useState(true);
  const [itemModal, setItemModal] = useState(filterType);
  const [filter, setFilter] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getHistory();
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    getHistory();
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
      startDate: moment().format("YYYY-MM-DD")
      // startDate: moment().startOf('day').subtract(1,'month').format("YYYY-MM-DD"),
    };

    console.log("params", params);
    await postData(BASE_URL + HISTORY_POP, params, token)
      .then((response) => {
        console.log("response HISTORY_POP", response);
        console.log("response HISTORY_POP", response.data.data);
        setIsLoading(false);
        setIsRefresh(false);
        if (response.success) {
          var data_response = [];
          data_response = response.data.data;
          data_response.map((data, index) => {
            data_response[index].isSelected = false;
          });
          setHistory(data_response);
        }
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const onRefresh = () => {
    setIsRefresh(true);
    getHistory();
  };

  const isSelectList = (item, index) => {
    var data_history = history;
    data_history[index].isSelected = !item.isSelected;
    // data_history.push(history[0])
    setHistory(data_history);
    if (item.id == selectedId) {
      setSelectedId(null);
    } else {
      setSelectedId(item.id);
    }
  };

  const onFilterSelected = async (value, label) => {
    setIsLoading(true);
    setFilter(value);
    let token = await getValue(TOKEN);

    var params = {};

    if (value == 0) {
      params = {
        startDate: moment().format("YYYY-MM-DD"),
        endDate: moment().format("YYYY-MM-DD"),
      };
    } else if (value == 1) {
      params = {
        startDate: moment().subtract(7, "d").format("YYYY-MM-DD"),
        endDate: moment().format("YYYY-MM-DD"),
      };
    } else {
      params = {
        startDate: moment().subtract(30, "d").format("YYYY-MM-DD"),
        endDate: moment().format("YYYY-MM-DD"),
      };
    }

    console.log("params", params);
    await postData(BASE_URL + HISTORY_POP, params, token)
      .then((response) => {
        console.log("response", response);
        setIsLoading(false);
        setIsRefresh(false);
        if (response.success) {
          var data_response = [];
          data_response = response.data.data;
          data_response.map((data, index) => {
            data_response[index].isSelected = false;
          });
          setHistory(data_response);
        }
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const renderListEmpty = () => {
    return (
      <View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            height: verticalScale(200),
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

  const renderItem = ({ item, index }) => {
    // const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
    // const color = item.id === selectedId ? "white" : "black";
    console.log("renderItem", item);

    return (
      <View>
        <TouchableOpacity
          onPress={() => isSelectList(item, index)}
          style={{
            flexDirection: "row",
            // alignItems: "center",
            // backgroundColor: "#FFFFFF",
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View
              style={{
                height: moderateScale(12),
                width: moderateScale(12),
                backgroundColor: "#A80002",
                borderRadius: 50,
              }}
            />
            <View
            style={{width: moderateScale(1),height:verticalScale(40),backgroundColor: "black"}}
            />
          </View>

          <View style={{ flex: 1,marginLeft: moderateScale(12) }}>
            <Text
              style={[styles.text_bold_14]}
            >
              #0930.14482340
            </Text>
            <Text
              style={[
                styles.text_title_12,
                { color: "#8D8F92", marginTop: verticalScale(5) },
              ]}
            >
              Total {item.total_pickup_order} order pelanggan di pickup
            </Text>
          </View>

          <Image
            style={{
              width: moderateScale(7),
              height: moderateScale(9),
              resizeMode: "stretch",
              marginRight: moderateScale(5),
              transform: [
                item.id === selectedId
                  ? { rotate: "90deg" }
                  : { rotate: "0deg" },
              ],
            }}
            source={require("../../../assets/image/ic_arrow_right.png")}
          />
        </TouchableOpacity>

        {item.id === selectedId && (
          <View
            style={{
              borderLeftWidth: moderateScale(0.5),
              borderBottomColor: "#8D8F92",
              marginLeft: moderateScale(5.5),
            }}
          >
            {item.pickups.map((data, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: verticalScale(10),
                    marginLeft: moderateScale(16),
                  }}
                >
                  <View>
                    <Text style={styles.text_title_14}>{data.number}</Text>
                    <Text
                      style={[
                        styles.text_title_12,
                        { color: "#8D8F92", marginTop: verticalScale(5) },
                      ]}
                    >
                      {data.name + " " + data.phone}
                    </Text>

                    <Text
                      style={[
                        styles.text_title_12,
                        { color: "#8D8F92", marginTop: verticalScale(5) },
                      ]}
                    >
                      {data.sender.street +
                        " " +
                        data.sender.district +
                        " " +
                        data.sender.city +
                        " " +
                        data.sender.province}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
                    }}
                  >
                    {renderIconStatus("success")}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  const renderIconStatus = (data) => {
    if (data == "success") {
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

  const renderModal = (type) => {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modal_dropdown}>
              <Text style={styles.modalText}>Pilih Filter</Text>
              {itemModal.map((data, key) => {
                return (
                  <TouchableOpacity
                    key={key}
                    // onPress={() => tonSelectedUnit(data)}
                  >
                    <Text
                      style={[
                        styles.text_title_14,
                        { color: "#000000", margin: moderateScale(5) },
                      ]}
                    >
                      {data.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Modal>
      </View>
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
          <Picker
            style={styles.picker}
            itemStyle={{
              fontSize: moderateScale(3),
            }}
            enabled={true}
            mode="dropdown"
            placeholder="- Pilih -"
            selectedValue={filter}
            onValueChange={(value, label) => onFilterSelected(value, label)}
          >
            <Picker.Item label="- Pilih -" value="" />

            <Picker.Item key={0} label={"Hari ini"} value={0} />
            <Picker.Item key={1} label={"Minggu ini"} value={1} />
            <Picker.Item key={2} label={"Bulan ini"} value={2} />
          </Picker>
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
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          extraData={selectedId}
          ListEmptyComponent={renderListEmpty}
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
      {/* {renderModal()} */}
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
    color: "#4A4A4A",
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

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52, 52, 52, 0.3)",
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
  picker: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    color: "#8D8F92",
  },
});

const dataDummy = {
  success: true,
  data: {
    current_page: 1,
    data: [
      {
        id: 4,
        number: "SP21062700003",
        total_pickup_order: 2,
        pickups: [
          {
            id: 9,
            shipment_plan_id: 4,
            number: "P21061900004",
            proof_of_delivery: null,
          },
          {
            id: 15,
            shipment_plan_id: 4,
            number: "P21062500006",
            proof_of_delivery: {
              status: "submitted",
              status_delivery: "re-delivery",
            },
          },
        ],
      },

      {
        id: 5,
        number: "SP21062700003",
        total_pickup_order: 2,
        pickups: [
          {
            id: 9,
            shipment_plan_id: 4,
            number: "P21061900004",
            proof_of_delivery: null,
          },
          {
            id: 15,
            shipment_plan_id: 4,
            number: "P21062500006",
            proof_of_delivery: {
              status: "submitted",
              status_delivery: "re-delivery",
            },
          },
        ],
      },

      {
        id: 6,
        number: "SP21062700003",
        total_pickup_order: 2,
        pickups: [
          {
            id: 9,
            shipment_plan_id: 4,
            number: "P21061900004",
            proof_of_delivery: null,
          },
          {
            id: 15,
            shipment_plan_id: 4,
            number: "P21062500006",
            proof_of_delivery: {
              status: "submitted",
              status_delivery: "re-delivery",
            },
          },
        ],
      },
    ],
    first_page_url:
      "https://cargo.test/api/driver/shipment-plan/history?page=1",
    from: 1,
    next_page_url: null,
    path: "https://cargo.test/api/driver/shipment-plan/history",
    per_page: 10,
    prev_page_url: null,
    to: 1,
  },
};
