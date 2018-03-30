const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

function isVehicleNumber(vehicleNumber) {
  var result = false;
  if (vehicleNumber.length == 7 || vehicleNumber.length == 8) {
    var express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9]?[A-Z0-9挂学警港澳]{1}$/;
    result = express.test(vehicleNumber);
  }
  return result;
}

//邮箱以及手机和身份证的正则表达式
function regexConfig() {
  var reg = {
    phone: /^1(3|4|5|7|8)\d{9}$/,
    card: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  }
  return reg;
}


module.exports = {
	formatTime: formatTime,
   isVehicleNumber: isVehicleNumber,
   regexConfig: regexConfig,
}