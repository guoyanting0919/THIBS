import moment from "moment";

export default function(date, format) {
  let res = moment(date).format(format);
  return res;
}
