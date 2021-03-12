import React, { useState, useRef, useEffect } from "react";
import { moderateScale, verticalScale } from "../../../util/ModerateScale";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Header from "../../Header";
import { getValue } from "../../../util/AsyncStorage";
import  moment  from "moment";
import { TOKEN } from "../../../util/StringConstans";
import { Picker } from "@react-native-picker/picker";
import { BASE_URL,DETAIL_PICKUP_DRIVER,SUBMIT_PICKUP_DRIVER,ALLUNIT,SERVICE,postData,getData} from "../../../network/ApiService";
import BottomSheet from 'react-native-bottomsheet-reanimated';
import {ModalWarning, ModalSuccess} from '../../../util/CustModal';
import {Loading} from '../../../util/Loading';


import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  Modal,
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

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
  },
];

export default function DetailOrder ({ navigation,route}) {
  const [reason, setReason] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [detail_pickup, setDataDetailPickup] = useState(null);
  const [sender_address, setSenderAddress] = useState(null);
  const [data_item, setDataItem] = useState([]);
  const [selectedId, setSeledtedId] = useState("");
  const [units, setUnits] = useState([]);
  const [dataItemsTemporary, setDataTemp] = useState({
    unit_id: '',
    unit_label: '',
    service_id: '',
    service_label: '',
    name: '',
    unit_total: '',
    unit_count: '',
  });
  
  const [isModalSuccess, setIsModalSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [driverPick, setDriverPIck] = useState(true);

  const {id_pickup} = route.params;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // getUrlVoice();
      getPickupPlan()
      getAllUnit()

    });
    return unsubscribe;
  }, []);

  useEffect(()=>{
    getPickupPlan()
    getAllUnit()
  },[]);

  const validationForm = ()=>{
    if(status == ""){

      return false ;
    }
  }

  const submitPickup = async () => {
    var token =  await getValue(TOKEN);
    var sts = "";
    if(status == "sukses"){
      sts = "success"
    }else if(status == "gagal"){
      sts = "failed"
    }else{
      sts = "updated"
    }
    var params = {
      "status": sts,
      "notes": notes,
      "driverPick": true,
      "pickupId": id_pickup
    }
    console.log("params", params)
    setIsLoading(true)
    await postData(BASE_URL + SUBMIT_PICKUP_DRIVER,params,token).then((response)=>{
      console.log("response succes", response)
      if(response.success == true){
        setIsLoading(false)
        setIsModalSuccess(true)
      }else{
        setIsLoading(false)
      }

    }).catch((error)=>[
      console.log("response error", error)

    ])
  }

  const getPickupPlan = async(id) =>{
    var token =  await getValue(TOKEN);
    console.log("response token", token)
    var date = moment("2021-03-03").format('YYYY-MM-DD');
    var parans= {
      "pickupId": id_pickup
    }
    await postData(BASE_URL+DETAIL_PICKUP_DRIVER,parans,token).then((response)=>{
      console.log("response getPIckup detail", response)
      if (response.success == true) {
        var sender = response.data.sender
        setDataDetailPickup(response.data)
        setSenderAddress(sender.street + " " + sender.village + " "+ sender.district + " " + sender.city + " " + sender.province)
        setDataItem(response.data.items)
        console.log("response getPIckup detail", response.data)

      }else if(response.message == "Unauthenticated."){
        goLogout()
      }

      })
  }

  const getAllUnit = async ()=> {
    var token =  await getValue(TOKEN);
    await getData(BASE_URL + ALLUNIT, token).then((response) => {
      console.log("response getAllUnit", response)
      if (response.success == true) {
        let value = response.data;
        setUnits(value)
        // this.setState({ picker: true });
      } else if (response.message == 'Unauthenticated.') {
        // this.props.navigation.replace("Login");
      }
    });
  }

  const getAllServices = async ()=> {
    var token =  await getValue(TOKEN);
    await getData(BASE_URL + SERVICE, token).then((response) => {
      console.log("response SERVICE", response)
      if (response.success == true) {
        let value = response.data;
        setUnits(value)
        // this.setState({ picker: true });
      } else if (response.message == 'Unauthenticated.') {
        // this.props.navigation.replace("Login");
      }
    });
  }


  const onValueStatus = (value,label)=>{
    setStatus(value)
   
  }

  const onSuccess = ()=>{
    setIsModalSuccess(false)
  }

  const renderModal =()=> {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={[styles.text_14, { color: "#A80002", fontWeight: "bold" }]}
            >
              Alasan Pembatalan
            </Text>

            <View
              style={{
                borderColor: "grey",
                borderRadius: 10,
                marginTop: verticalScale(10),
                backgroundColor: "#F0F0F0",
              }}
            >
              <TextInput
                multiline={true}
                numberOfLines={6}
                value={reason}
                onChangeText={(v) => setReason(v)}
              ></TextInput>
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: verticalScale(16),
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  backgroundColor: "#A80002",
                  paddingHorizontal: moderateScale(30),
                  paddingVertical: moderateScale(10),
                  borderRadius: moderateScale(50),
                }}
              >
                <Text
                  style={[
                    styles.text_14,
                    { color: "#FFFFFF", fontWeight: "bold" },
                  ]}
                >
                  SUBMIT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }



  const  renderItem = ({ item, index}) =>{
    console.log("data",item)
    return(
      <View>
        <View style={{ flexDirection: "row", marginTop: verticalScale(8) }}>
            <Text style={[styles.text_10, { flex: 1 }]}>{item.name}</Text>
            <Text style={[styles.text_10, { flex: 0.6 }]}>{item.unit_count}</Text>
            <Text style={[styles.text_10, { flex: 0.6 }]}>{item.unit_total}</Text>
            <Text style={[styles.text_10, { flex: 0.8 }]}>{item.service != null ? item.service.name : "-"}</Text>
            <TouchableOpacity>
            <Image
            style={{width: moderateScale(15),height:moderateScale(15)}}
            source={require("../../../assets/image/ic_edit.png")}
            ></Image>
            </TouchableOpacity>
          </View>
          <View style={styles.line}></View>
      </View>
    )
  }

  const renderBottomSheet = () => {
    return(
      <BottomSheet
      bottomSheerColor="#F1F1F1"
      // backDropColor="red"
      ref={'BottomSheet'}
      initialPosition={'0%'}
      snapPoints={snapPoints}
      isBackDrop={true}
      isBackDropDismissByPress={true}
      isRoundBorderWithTipHeader={true}
      headerStyle={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#FBFAF8',
      }}
      header={
        <View style={{alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: 'grey',
              height: moderateScale(5),
              width: moderateScale(35),
              borderRadius: moderateScale(5),
            }}></View>

          <Text style={[styles.text_16, {marginTop: verticalScale(8)}]}>
            Masukkan Data Barang
          </Text>
        </View>
      }
      body={
        <View
          style={{
            padding: moderateScale(10),
            backgroundColor: '#FBFAF8',
            height: '1000%',
          }}>
          <Text style={styles.text_10}>Nama Barang</Text>
          <TextInput
            paddingLeft={moderateScale(12)}
            keyboardType="default"
            value={dataItemsTemporary.name}
            style={{
              backgroundColor: '#F1F1F1',
              borderRadius: moderateScale(12),
              fontSize: 12,
              marginTop: verticalScale(5),
            }}
            placeholder="Nama Barang"
            onChangeText={(phone) =>
              onNameItemChange(phone)
            }></TextInput>
          <Text style={styles.text_10}>Jumlah Barang</Text>
          <TextInput
            paddingLeft={moderateScale(12)}
            keyboardType="default"
            value={dataItemsTemporary.unit_count}
            style={{
              backgroundColor: '#F1F1F1',
              borderRadius: moderateScale(12),
              fontSize: 12,
              marginTop: verticalScale(5),
            }}
            placeholder="Jumlah Barang"
            onChangeText={(value) =>
              onTotalItemChange(value)
            }></TextInput>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, marginRight: moderateScale(5)}}>
              <Text style={styles.text_10}>Berat Total</Text>
              <TextInput
                paddingLeft={moderateScale(12)}
                keyboardType="number-pad"
                value={dataItemsTemporary.unit_total}
                style={{
                  backgroundColor: '#F1F1F1',
                  borderRadius: moderateScale(12),
                  fontSize: 12,
                }}
                placeholder="Berat Total"
                onChangeText={(value) =>
                  onTotalUnitChange(value)
                }></TextInput>
            </View>

            <View style={{flex: 1, marginLeft: moderateScale(5)}}>
              <Text style={styles.text_10}>Satuan</Text>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  alignItems: 'center',
                  backgroundColor: '#F1F1F1',
                  width: moderateScale(90),
                  paddingHorizontal: moderateScale(5),
                  borderRadius: moderateScale(12),
                }}>
                <Text
                  style={[
                    styles.text_12,
                    {
                      marginTop: 0,
                      color: '#686868',
                      marginRight: moderateScale(5),
                    },
                  ]}>
                  {dataItemsTemporary.unit_label == ''
                    ? 'satuan'
                    : dataItemsTemporary.unit_label}
                </Text>
                <TouchableOpacity onPress={() => selectUnits(0)}>
                  <Image
                    style={{
                      height: verticalScale(16),
                      width: verticalScale(16),
                      resizeMode: 'stretch',
                    }}
                    source={require('../../../assets/image/ic_arrow_down.png')}></Image>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text style={styles.text_10}>Request Layanan</Text>
          <TouchableOpacity
            style={{justifyContent: 'center'}}
            onPress={() => selectService(0)}>
            <TextInput
              editable={false}
              paddingLeft={moderateScale(12)}
              keyboardType="default"
              value={dataItemsTemporary.service_label}
              style={{
                backgroundColor: '#F1F1F1',
                borderRadius: moderateScale(12),
                fontSize: 12,
                marginTop: verticalScale(5),
              }}
              placeholder="Request Layanan"
              // onChangeText={(phone) => this.setState({ phone })}
            ></TextInput>
            <Image
              style={{
                position: 'absolute',
                height: verticalScale(16),
                width: verticalScale(16),
                resizeMode: 'stretch',
                right: moderateScale(10),
              }}
              source={require('../../../assets/image/ic_arrow_down.png')}></Image>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              height: verticalScale(40),
              width: width - moderateScale(20),
              backgroundColor: '#A80002',
              borderRadius: 20,
              marginTop: verticalScale(20),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => onSaveItem()}>
            <Text style={styles.text_title_14}>Simpan</Text>
          </TouchableOpacity>
        </View>
      }
    />
    )
  }

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
            style={styles.icon_left_arrow}
            source={require("../../../assets/image/left_arrow_black.png")}
          ></Image>
        </TouchableOpacity>

        <Text style={styles.text_header}>{detail_pickup != null ? detail_pickup.id : "-"}</Text>
      </View>

      <View style={styles.container}>
        <View
          style={{
            width: width - moderateScale(40),
            padding: moderateScale(16),
            backgroundColor: "#FFFFFF",
            borderRadius: moderateScale(12),
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.text_10}>Nama Pelanggan</Text>
              <Text style={styles.text_16}>{detail_pickup != null ? detail_pickup.name : "-"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.text_10}>Nama Pelanggan</Text>
              <Text style={styles.text_16}>{detail_pickup != null ? detail_pickup.phone : "-"}</Text>
            </View>
          </View>
          <Text
            style={[
              styles.text_10,
              {
                marginTop: verticalScale(16),
                marginBottom: verticalScale(5),
              },
            ]}
          >
            Alamat Pengimputan
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[styles.text_16, { flex: 1 }]}>
              {sender_address}
              {/* Perum Suryadadi B13, Jl. Petogogan IX RT 002 RW 002, Kelurahan
              Genting Kalianak, Kecamatan Asemrowo, Surabaya */}
            </Text>
            <TouchableOpacity>
              <Image
                style={{
                  width: moderateScale(40),
                  height: moderateScale(40),
                  resizeMode: "stretch",
                }}
                source={require("../../../assets/image/ic_location_map.png")}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{ flexDirection: "row", marginTop: verticalScale(16) }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.text_10}>APD</Text>
              <Text style={styles.text_16}>{detail_pickup != null ? detail_pickup.picktime.substring(0,11) : "-"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.text_10}>Tujuan</Text>
              <Text style={styles.text_16}>{detail_pickup != null ? detail_pickup.receiver.city : "-"}</Text>
            </View>
          </View>
          <View
            style={{ flexDirection: "row", marginTop: verticalScale(16) }}
          >
            <Text style={[styles.text_10, { flex: 1 }]}>Nama barang</Text>
            <Text style={[styles.text_10, { flex: 0.6 }]}>Jumlah</Text>
            <Text style={[styles.text_10, { flex: 0.6 }]}>Berat Total</Text>
            <Text style={[styles.text_10, { flex: 0.8 }]}>Req Layanan</Text>
            <View
            style={{width: moderateScale(15),height:moderateScale(15)}}
            ></View>
          </View>

          <FlatList
            data={data_item}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            extraData={selectedId}
          />

        </View>
        <View 
        style={{width:width - moderateScale(40),marginTop: verticalScale(20),marginBottom:verticalScale(10)}}
        >
        <Text>Status Pickup</Text>
        </View>
        <View
         style={{
          width: width - moderateScale(40),
          paddingHorizontal: moderateScale(16),
          backgroundColor: "#FFFFFF",
          borderRadius: moderateScale(12),
        }}
        >
            <Picker
              style={styles.picker}
              itemStyle={{
                fontSize: moderateScale(3),
              }}
              mode="dropdown"
              placeholder="- Pilih -"
              selectedValue={status}
              onValueChange={(value, label) => onValueStatus(value, label)}
            >
              <Picker.Item label="- Pilih -" value="" />
                 <Picker.Item key={0} label="sukses" value="sukses" />
                 <Picker.Item key={1} label="gagal" value="gagal" />
                 <Picker.Item key={2} label="ada perubahan" value="ada perubahan" />
              
            </Picker>
        </View>
      </View>
      {renderModal()}
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: moderateScale(20),
          position: "absolute",
          bottom: 20,
        }}
      >
       
        <TouchableOpacity
          onPress={()=> submitPickup()}
          style={styles.button_primary}
        >
          <Text style={[styles.text_14, { color: "#FFFFFF" }]}>PICK UP</Text>
        </TouchableOpacity>
      </View>
      <Loading visible={isLoading}></Loading>
      <ModalSuccess
          visible={isModalSuccess}
          message={'Submit Pick Up Berhasil'}
          onOk={() => onSuccess()}>   
      </ModalSuccess>

    </SafeAreaView>
  );


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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(38, 47, 86, 0.9)",
  },
  modalView: {
    width: width - moderateScale(64),
    // height: moderateScale(180),
    backgroundColor: "white",
    borderRadius: 12,
    padding: verticalScale(15),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button_primary: {
    flex:1,
    height: verticalScale(40),
    width: width / 3,
    backgroundColor: "#A80002",
    borderRadius: 20,
    marginTop: verticalScale(8),
    justifyContent: "center",
    alignItems: "center",
  },
  icon_check: {
    width: moderateScale(17),
    height: moderateScale(17),
    resizeMode: "stretch",
    marginRight: moderateScale(5),
  },
  icon_left_arrow: {
    position: "absolute",
    left: moderateScale(10),
    width: moderateScale(20),
    height: moderateScale(12),
    resizeMode: "stretch",
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
  picker: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    color: "#8D8F92",
  },
  line: {
    width: "100%",
    height: 0.9,
    backgroundColor: "#DCDCDC",
    marginTop: verticalScale(7),
  },
  text_14: {
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

// renderModal(type) {
//   if (this.state.typeModal === 'unit') {
//     return (
//       <View style={styles.centeredView}>
//         <Modal
//           animationType="fade"
//           transparent={true}
//           visible={this.state.modalVisible}
//           onRequestClose={() => {
//             Alert.alert('Modal has been closed.');
//           }}>
//           <View style={styles.centeredView}>
//             <View style={styles.modal_dropdown}>
//               <Text style={styles.modalText}>Pilih Satuan</Text>
//               {this.state.itemModal.map((data, key) => {
//                 return (
//                   <TouchableOpacity
//                     key={key}
//                     onPress={() => this.onSelectedUnit(data)}>
//                     <Text
//                       style={[
//                         styles.text_title_14,
//                         {color: '#262F56', margin: moderateScale(5)},
//                       ]}>
//                       {data.name}
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>
//           </View>
//         </Modal>
//       </View>
//     );
//   } else {
//     return (
//       <View style={styles.centeredView}>
//         <Modal
//           animationType="fade"
//           transparent={true}
//           visible={this.state.modalVisible}
//           onRequestClose={() => {
//             Alert.alert('Modal has been closed.');
//           }}>
//           <View style={styles.centeredView}>
//             <View style={styles.modal_dropdown}>
//               <Text style={styles.modalText}>Pilih Service</Text>
//               {this.state.itemModal.map((data, key) => {
//                 return (
//                   <TouchableOpacity
//                     key={key}
//                     onPress={() => this.onSelectedUnit(data)}>
//                     <Text
//                       style={[
//                         styles.text_title_14,
//                         {color: '#262F56', margin: moderateScale(5)},
//                       ]}>
//                       {data.name}
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>
//           </View>
//         </Modal>
//       </View>
//     );
//   }
// }