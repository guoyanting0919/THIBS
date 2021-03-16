import request from "@/utils/request";
export function upload(data) {
  return request({
    url: "/Files/Upload",
    method: "post",
    data,
  });
}
