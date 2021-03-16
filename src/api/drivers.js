import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/driverInfos/load",
    method: "get",
    params,
  });
}
export function get(params) {
  return request({
    url: "/driverInfos/get",
    method: "get",
    params,
  });
}
 
export function add(data) {
  return request({
    url: "/driverInfos/add",
    method: "post",
    data,
  });
}
export function update(data) {
  return request({
    url: "/driverInfos/update",
    method: "post",
    data,
  });
}

export function deleteDriver(data) {
  return request({
    url: "/driverInfos/delete",
    method: "post",
    data,
  });
}


