import axios from "axios";

export const BASE_URL = "https://cargo.ivalpha.com/public/";
export const LOGIN = "api/login-driver";
export const PICKUP_DRIVER = "api/driver/pickup-plan/list";
export const LIST_POD = "api/driver/shipment-plan/list";
export const TOTAL_POD = "api/driver/pod/dashboard";
export const TOTAL_POP = "api/driver/pop/dashboard";
export const GET_BY_PICKUP_PLANE = "api/driver/pickup/get-by-pickup-plan";
export const GET_SHIPMENT_PLANE = "api/driver/shipment-plan/pickup";
export const DETAIL_PICKUP_DRIVER = "api/driver/pickup/detail";
export const SUBMIT_PICKUP_DRIVER = "api/driver/pop/create";
export const SUBMIT_POD = "api/driver/pod/submit";
export const TOTAL_VOL_DRIVER = "api/driver/pickup/total-volume-kilo";
export const DASHBOARD_POD = "api/driver/shipment-plan/dashboard";
export const EDIT_ITEM_DRIVER = "api/driver/item/update";
export const DELETE_ITEM_DRIVER = "api/driver/item/delete";
export const CREATE_ITEM_DRIVER = "api/driver/item/create";
export const UPLOAD_PICTURE_POP = "api/tracking/upload-picture";

export const REGISTER = "api/register";
export const PROVINCES = "api/get-provinces";
export const CITIES = "api/get-cities";
export const DISTRICTS = "api/get-districts";
export const VILLAGES = "api/get-villages";
export const SENDER = "api/sender";
export const RECEIVER = "api/receiver";
export const DEPTOR = "api/debtor";
export const ALLUNIT = "api/unit";
export const SERVICE = "api/service";
export const PROFILE = "api/user-by-id";
export const FLEET = "api/fleet";
export const PICKUP = "api/pickup";
export const PROMO = "api/promo/user";
export const SELECT_PROMO = "api/promo/select";
export const CALCULATE = "api/bill/calculate";

export const postData = async (url, data, token) => {
  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });
    let json = await response.json();
    return json;
  } catch (error) {
    console.error("error postData", error);
  }
};

export const putData = async (url, data, token) => {
  try {
    let response = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });
    let json = await response.json();
    return json;
  } catch (error) {
    console.error("error puttData", error);
  }
};

export const getData = async (url, token) => {
  try {
    // console.log("postData url", url);
    let response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    let json = await response.json();
    return json;
  } catch (error) {
    console.error("error gettData", error);
  }
};

export const deleteData = async (url, token) => {
  try {
    // console.log("postData param", data);
    let response = await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    let json = await response.json();
    return json;
  } catch (error) {
    console.error("error deleteData", error);
  }
};

export const postFormData = async (url, data, token) => {
  console.log("postFormData", url);
  console.log("postFormData", data);
  console.log("postFormData", token);

  try {
    // getToken();
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };
    return new Promise((resolve, reject) => {
      axios
        .post(url, data, { headers: headers })
        .then((res) => {
          resolve(res.data);
          console.log("postFormData", res);
        })
        .catch((err) => {
          reject(err);
          console.log("postFormData", err.response);
        });
    });
  } catch (error) {
    console.error("postFormData error", error);
  }
};
