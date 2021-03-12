export const BASE_URL = "https://papandayan.ival.online/public/";
export const LOGIN = "api/login-driver";
export const PICKUP_DRIVER = "api/driver/pickup-plan/list";
export const GET_BY_PICKUP_PLANE = "api/driver/pickup/get-by-pickup-plan";
export const DETAIL_PICKUP_DRIVER = "api/driver/pickup/detail";
export const SUBMIT_PICKUP_DRIVER = "api/driver/pop/create";
export const TOTAL_VOL_DRIVER = "api/driver/pickup/total-volume-kilo";

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
    console.error("error postData", error);
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
    console.error("error postData", error);
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
    console.error("error postData", error);
  }
};
