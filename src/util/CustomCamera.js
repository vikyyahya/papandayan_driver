import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Text,
  Image,
  Platform,
} from "react-native";
//eslint-disable-next-line
import { RNCamera } from "react-native-camera";
import { useCamera } from "react-native-camera-hooks";
import { moderateScale, verticalScale } from "../util/ModerateScale";

export const CustomCamera = ({
  initialProps,
  modalVisible,
  onPicture,
  onCapture,
}) => {
  const [dataImage, setDataImage] = useState("");
  const [modalPrev, setModalPrev] = useState(false);
  const [
    { cameraRef, type, ratio, autoFocus, autoFocusPoint, isRecording },
    {
      toggleFacing,
      touchToFocus,
      textRecognized,
      facesDetected,
      recordVideo,
      setIsRecording,
      takePicture,
      resumePreview,
    },
  ] = useCamera(initialProps);

  const takePictureFromCamera = async () => {
    const options = { quality: 0.3, base64: true, fixOrientation: true };
    const data = await takePicture(options);
    setDataImage(data);
    setModalPrev(true);
    onCapture(data);
  };

  const onAcceptPicture = () => {
    onPicture(dataImage);
    setModalPrev(false);
  };

  return (
    <View>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View
          style={{
            flex: 1,
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RNCamera
            ref={cameraRef}
            autoFocusPointOfInterest={autoFocusPoint.normalized}
            type={type}
            ratio={ratio}
            style={{
              flex: 1,
              width: "100%",
              height: "70%",
              alignItems: "center",
            }}
            autoFocus={autoFocus}
            onTextRecognized={textRecognized}
            onFacesDetected={facesDetected}
          >
            <TouchableOpacity
              style={{
                flex: 1,
              }}
              onPress={touchToFocus}
            />

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
                height: 50,
                width: "100%",
              }}
            >
              <TouchableOpacity
                testID="button"
                onPress={toggleFacing}
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  left: 30,
                }}
              >
                <Image
                  style={{ width: 40, height: 40, resizeMode: "stretch" }}
                  source={require("../assets/image/switch.png")}
                ></Image>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => takePictureFromCamera()}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "red",
                  position: "absolute",
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderColor: "#FFFFFF",
                    borderRadius: 50,
                    borderWidth: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "red",
                  }}
                ></View>
              </TouchableOpacity>
            </View>
          </RNCamera>
        </View>
      </Modal>

      <Modal animationType="fade" transparent={true} visible={modalPrev}>
        <View
          style={{
            flex: 1,
            height: "100%",
            width: "100%",
            backgroundColor: "#000000",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: "100%", height: "70%", resizeMode: "stretch" }}
            source={{ uri: dataImage.uri }}
          ></Image>
          <View style={{ flexDirection: "row", marginTop: verticalScale(20) }}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <TouchableOpacity onPress={() => setModalPrev(false)}>
                <Text
                  style={{
                    fontFamily: "Montserrat-Bold",
                    fontSize: 20,
                    color: "#FFFFFF",
                  }}
                >
                  Retry
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, alignItems: "center" }}>
              <TouchableOpacity onPress={() => onAcceptPicture()}>
                <Text
                  style={{
                    fontFamily: "Montserrat-Bold",
                    fontSize: 20,
                    color: "#FFFFFF",
                  }}
                >
                  Ok
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};