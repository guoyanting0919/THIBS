import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/selfpayusers/load",
    method: "get",
    params,
  });
}

export function get(params) {
  return request({
    url: "/selfpayusers/get",
    method: "get",
    params,
  });
}

export function add(data) {
  return request({
    url: "/selfpayusers/add",
    method: "post",
    data,
  });
}


export function update(data) {
  return request({
    url: "/selfpayusers/update",
    method: "post",
    data,
  });
}
