import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/cars/load",
    method: "get",
    params,
  });
}
export function get(params) {
  return request({
    url: "/cars/get",
    method: "get",
    params,
  });
}
 
export function add(data) {
  return request({
    url: "/cars/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/cars/update",
    method: "post",
    data,
  });
}

export function deleteCar(data) {
  return request({
    url: "/cars/delete",
    method: "post",
    data,
  });
}

