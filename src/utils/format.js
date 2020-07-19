/**
 * Created by Joker on 2017/4/19.
 */
let formatJs = {
  //时间转化
  FParseToDate:function (value) {
    if (value == null || value == '') {
        return undefined;
    }
    var dt;
    if (value instanceof Date) {
        dt = value;
    }
    else {
        if (!isNaN(value)) {
            dt = new Date(value);
        }
        else if (value.indexOf('/Date') > -1) {
            value = value.replace(/\/Date\((-?\d+)\)\//, '$1');
            dt = new Date();
            dt.setTime(value);
        } else if (value.indexOf('-') > -1) {
            //dt = new Date(Date.parse(value.replace(/-/g, '/')));
            dt = new Date(value.replace(/-/g, '/'));
        } else {
            dt = new Date(value);
        }
    }
    return dt;
  },
  //补0操作
  getzf: function (num) {
    if (parseInt(num) < 10) {
      num = '0' + num
    }
    return num
  },
  //秒数转日期
  dateFormat: function (str) {
    let oDate = new Date(str),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMin = oDate.getMinutes(),
      oSen = oDate.getSeconds(),
      oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin) + ':' + this.getzf(oSen)//最后拼接时间
    return oTime
  },

  onlyDateFormat: function (str) {
    if (str===null||typeof str === 'undefined'||str === '') {
      return undefined
    } else {
      let oDate = new Date(str),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay)
      return oTime
    }
  },
  getYearMonth: function(str) {
    if (str===null||typeof str === 'undefined'||str === '') {
      return undefined
    } else {
      let oDate = new Date(str),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oTime = oYear + '-' + this.getzf(oMonth)
      return oTime
    }
  },
  MDHMFormat: function (str) {
    let oDate = new Date(str),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMin = oDate.getMinutes(),
      oSen = oDate.getSeconds(),
      oTime = this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin)//最后拼接时间
    return oTime
  },
  dayDifferenceFormat: function (str) {
    let date = str,
        // 计算出相差天数
        days = Math.floor(date/(24*3600*1000)),
        // 拼接
        duration = days + "天";
        if (duration == '0天') {
          duration = '不到1天';
        }
    return duration;
  },

  // 时间差格式“天时分秒”
  timeDifferenceFormat: function (str) {
    let date = str,
        // 计算出相差天数
        days = Math.floor(date/(24*3600*1000)),
        // 计算出小时数
        leave1 = date%(24*3600*1000), //计算天数后剩余的毫秒数
        hours = Math.floor(leave1/(3600*1000)),
        // 计算出相差分钟数
        leave2 = leave1%(3600*1000), //计算小时数后剩余的毫秒数
        minutes = Math.floor(leave2/(60*1000)),
        // 计算出相差秒数
        leave3 = leave2%(60*1000),  //计算分钟数后剩余的毫秒数
        seconds = Math.round(leave3/1000),
        // 拼接
        duration = days + "天" + hours + "小时" + minutes + "分钟" + seconds + "秒";
    return duration;
  },

  // 计算两个时间相差“几个月几天”
  computeDate(date1,date2){
      var obj = {};
      var beginDate = new Date(date1);
      var beginYear = beginDate.getFullYear();
      var beginMonth = beginDate.getMonth() + 1;
      var beginDay = beginDate.getDate();
      var endDate = new Date(date2);
      var endYear = endDate.getFullYear();
      var endMonth = endDate.getMonth() + 1;
      var endDay = endDate.getDate();
      //计算日期整月差
      var monthNum = (endYear*12+endMonth)-(beginYear*12+beginMonth);
      //判断天数大小
      if(endDay<beginDay){
          monthNum = monthNum - 1;
      }
      var month = beginMonth+monthNum;
      if(month>12){
          beginYear = beginYear +  Math.floor(month/12);
          beginMonth = month % 12;
      }else{
          beginMonth = month;
      }
      var newDate = beginYear+'-'+beginMonth+'-'+beginDay;
      var days = this.datedifference(newDate,date2);
      // alert(days)
      obj.month = monthNum;
      obj.days = days;
      // alert(monthNum+'---'+days)
      return obj;
  },
  //两个时间相差天数 兼容firefox chrome
  datedifference(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式
    var dateSpan,
    tempDate,
    iDays;
    sDate1 = Date.parse(sDate1);
    sDate2 = Date.parse(sDate2);
    dateSpan = sDate2 - sDate1;
    dateSpan = Math.abs(dateSpan);
    iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
    return iDays
  },
  // 复杂对象深拷贝
  deepClone(obj){
    let objClone = Array.isArray(obj)?[]:{};
    if(obj && typeof obj==="object"){
        for(let key in obj){
            if(obj.hasOwnProperty(key)){
                //判断ojb子元素是否为对象，如果是，递归复制
                if(obj[key]&&typeof obj[key] ==="object"){
                    objClone[key] = this.deepClone(obj[key]);
                }else{
                    //如果不是，简单复制
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
  }
}
export default formatJs
