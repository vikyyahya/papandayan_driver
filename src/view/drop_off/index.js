import React, { Component } from "react";
import Header from "../Header";
import { moderateScale, verticalScale } from "../../util/ModerateScale";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

class DropOff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data_teacher: "",
      data_my_course: "",
    };
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header></Header>
        <View style={styles.header}>
          <Text style={styles.text_header}>Drop Off </Text>
        </View>
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
    fontSize: 18,
  },
});
export default DropOff;
