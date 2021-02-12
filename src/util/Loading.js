import React, { useState, useRef, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export const Loading = ({ visible }) => {
  if (visible) {
    return (
      <ActivityIndicator
        style={{
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          position: "absolute",
          backgroundColor: "rgba(52, 52, 52, 0.3)",
        }}
        size="large"
        color="#A80002"
      />
    );
  } else {
    return <View></View>;
  }
};
