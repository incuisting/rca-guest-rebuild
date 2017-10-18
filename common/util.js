import 'whatwg-fetch'
import * as constant from './constant'

export function format(date) {
    let year = date.getFullYear();
    let mday = date.getDate();
    let month = date.getMonth() + 1;
    let hour=date.getHours();
    let minutes=date.getMinutes();

    month = month < 10 ? `0${month}` : month;
    mday = mday < 10 ? `0${mday}` : mday;
    hour = hour < 10 ? `0${hour}` : hour;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${year}-${month}-${mday} ${hour}:${minutes}`;
}

export function urlParam(href = window.location.href) {
    let query, querys, data = {}, d, indexQ, i, v;
    indexQ = href.indexOf("?");
    if (indexQ !== -1) {
        query = href.substr(indexQ + 1);
        querys = query.split("&");
        for (i = 0; i < querys.length; i++) {
            d = querys[i].split("=");
            if (d.length === 1) {
                v = "";
            } else {
                v = decodeURIComponent(d[1]).replace(/\+/g, ' ');
            }
            if (v !== "undefined") {
                if (typeof data[d[0]] !== 'undefined') {
                    if (data[d[0]].constructor === Array) {
                        data[d[0]].push(v);
                    } else {
                        data[d[0]] = new Array([data[d[0]], v]);
                    }
                } else {
                    data[d[0]] = v;
                }
            }
        }
    }
    return data
}

export function authUrl(appId) {
    let uri = "";
    if (window.location.href.indexOf("qrbooking.html") !== -1) {
        uri = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" + encodeURIComponent(constant.redirect_uri) +
            "&response_type=code&scope=snsapi_userinfo&state=qr#wechat_redirect"
    } else {
        uri = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId + "&redirect_uri=" + encodeURIComponent(constant.redirect_uri) +
            "&response_type=code&scope=snsapi_userinfo&state=bd#wechat_redirect"
    }
    return uri;
}

 export function convertErr(wxConfig, errcode) {
//     if (errcode === 401) {
//         location.href = authUrl(wxConfig.appId);
//         return false;
//     } else if (errcode === 2000) {
//         alert("系统错误");
//         return false;
//     } else if (errcode === 2001) {
//         alert("系统错误");
//         return false;
//     }
//     return true;
 }

export async function request(url, options) {
    const __options = Object.assign({}, {
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'same-origin'
    }, options);
    const response = await fetch(url, __options);
    const data = await response.json();
    return data;
}
