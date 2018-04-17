import UUID from 'uuid-js'

export const generateUUID = () => UUID.create().toString();

Date.prototype.format = function (format = 'yyyy-MM-dd hh:mm:ss') {
  return formatDate(this, format);
};

export function formatTimestamp(timestamp, format = 'yyyy-MM-dd hh:mm:ss') {
  return formatDate(new Date(timestamp), format);
}

function formatDate(date, format = 'yyyy-MM-dd hh:mm:ss') {
  let o = {
    "M+" : date.getMonth() + 1,// month
    "d+" : date.getDate(),// day
    "h+" : date.getHours(),// hour
    "m+" : date.getMinutes(),// minute
    "s+" : date.getSeconds(),// second
    "q+" : Math.floor((date.getMonth() + 3) / 3),// quarter
    "S" : date.getMilliseconds() // millisecond
  };
  if (/(y+)/.test(format) || /(Y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}