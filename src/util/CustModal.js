import React, { useState, useRef, useEffect } from "react";
import { moderateScale, verticalScale } from "./ModerateScale";
import {
  Dimensions,
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
const { width, height } = Dimensions.get("window");

export const ModalWarning = ({ visible, message, onOk }) => {
  if (visible) {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={styles.ic_alert}
              source={require("../assets/image/ic_alert.png")}
            ></Image>
            <Text style={styles.modal_message}>{message}</Text>

            <TouchableOpacity
              style={{ ...styles.openButton }}
              onPress={() => {
                onOk();
              }}
            >
              <Text style={styles.textStyle}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  } else {
    return <View></View>;
  }
};

export const ModalSuccess = ({ visible, message, onOk }) => {
  if (visible) {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={styles.ic_alert}
              source={require("../assets/image/ic_check_success.png")}
            ></Image>
            <Text style={styles.modal_message}>{message}</Text>

            <TouchableOpacity
              style={{ ...styles.openButton }}
              onPress={() => {
                onOk();
              }}
            >
              <Text style={styles.textStyle}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  } else {
    return <View></View>;
  }
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52, 52, 52, 0.3)",
  },
  centeredViewError: {
    alignItems: "center",
  },
  modalViewError: {
    width: "95%",
    height: 50,
    marginTop: 5,
    backgroundColor: "rgba(245, 66, 84,0.5)",
    borderRadius: 10,
    padding: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(38, 47, 86, 0.8)",
  },
  modalView: {
    width: width - moderateScale(64),
    // height: moderateScale(180),
    backgroundColor: "white",
    borderRadius: 12,
    padding: verticalScale(15),
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
    height: verticalScale(40),
    width: width - moderateScale(96),
    backgroundColor: "#A80002",
    borderRadius: moderateScale(20),
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
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
    marginTop: verticalScale(25),
    marginBottom: verticalScale(25),
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Montserrat-Regular",
  },
  ic_alert: {
    width: moderateScale(50),
    height: moderateScale(50),
    resizeMode: "stretch",
  },
});
