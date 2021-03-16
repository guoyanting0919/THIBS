import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/CaseUserDiscounts/Load",
    method: "get",
    params,
  });
}

export function get(params) {
  return request({
    url: "/CaseUserDiscounts/GetDiscountData",
    method: "get",
    params,
  });
}

export function add(data) {
  return request({
    url: "/CaseUserDiscounts/add",
    method: "post",
    data,
  });
}

// 修改B單位
export function updateUnitB(data) {
  return request({
    url: "/caseusers/updateorgb",
    method: "post",
    data,
  });
}
