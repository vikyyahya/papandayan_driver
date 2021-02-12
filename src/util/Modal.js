import React, { Component, useState } from "react";
import { moderateScale, verticalScale } from "./ModerateScale";

import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";

class Modals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalWarningVisible: false,
    };
  }

  componentDidMount() {
    this.props.onModal(this);
  }

  componentWillUnmount() {
    this.props.onModal(undefined);
  }

  setModalErrorVisible(value) {
    this.setState({ modalVisible: value });
    setTimeout(() => {
      this.setState({ modalVisible: false });
    }, 2000);
  }

  setModalWarning(value) {}

  renderError() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredViewError}>
          <View style={styles.modalViewError}>
            <Text style={styles.modalText}>Maaf terjadi kendala teknis</Text>
          </View>
        </View>
      </Modal>
    );
  }

  renderModalWarning() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalWarningVisible}
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
    );
  }

  render() {
    return (
      <View style={styles.centeredView}>
        {this.renderError()}

        {this.renderModalWarning}
      </View>
    );
  }
}

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

export default Modals;
