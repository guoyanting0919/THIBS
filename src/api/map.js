import request from "@/utils/request";

export function placeDetail(data) {
  return request({
    url: "/Maps/placeDetail",
    method: "post",
    data,
  });
}
export function geocode(params) {
  return request({
    url: "/Maps/Geocode",
    method: "get",
    params,
  });
}

export function route(data) {
  return request({
    url: "/Maps/route",
    method: "post",
    data,
  });
}
