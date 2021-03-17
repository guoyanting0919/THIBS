import request from "@/utils/request";

export function load(params) {
  return request({
    url: "/BusStationLines/load",
    method: "get",
    params,
  });
}

export function get(params) {
  return request({
    url: "/BusStationLines/get",
    method: "get",
    params,
  });
}

export function add(data) {
  return request({
    url: "/BusStationLines/add",
    method: "post",
    data,
  });
}

export function update(data) {
  return request({
    url: "/BusStationLines/update",
    method: "post",
    data,
  });
}

export function remove(data) {
  return request({
    url: "/BusStationLines/delete",
    method: "post",
    data,
  });
}
