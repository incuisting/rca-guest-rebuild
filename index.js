import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Switch, Route, BrowserRouter, Link} from 'react-router-dom';
import asyncComponent from "components/AsyncComponent";

import IdInfoComponent from './components/idinfo';
import IdInfoEditComponent from './components/idinfoEdit';
import BookingList from './components/bookingList';
import {request, urlParam, convertErr} from './common/util'
import * as constant from './common/constant';


// 导入 css
import './styles/booking.css';

// 全局状态
import store from './store';

// 组件
import App from 'containers/App';

// 样式
import './index.css';
import logo from './logo.svg';

// 异步分割打包组件
const AsyncNotFound = asyncComponent(() => import("containers/NotFound"));
const AsyncMockApiRequest = asyncComponent(() => import("containers/MockApiRequest"));
const AsyncStyledButton = asyncComponent(() => import("containers/StyledButton"));





class Booking extends React.PureComponent {
  constructor(props) {
    let from = "bd";
    // if (window.location.href.indexOf("qrbooking.html") !== -1) {
    //   from = "qr";
    // }
    super(props);
    this.state = {
      from,
      keyFlag: 0,
      loadingConfig: 0,//0:未加载；1:加载中；2:加载完毕
      loadingList: 0//0:未加载；1:加载中；2:加载完毕
    };
  }

  componentWillMount() {
    //对url 的判断，判断是来二维码还是直接打开，以及isMock的检查
    /*
    const self = this;
    const {loadingConfig, from, loadingList} = this.state;
    let loc = location.href;
    let urlData = urlParam();
    let uri = constant.bd_uri;
    if (loc.indexOf("qrbooking") !== -1) {
      uri = constant.qr_uri;
    }
    if (loadingConfig === 0) {
      self.setState({
        loadingConfig: 1
      })
      if (loc.indexOf("isMock") === -1) {
        this.fetchWxConfig(this.fetchData())
      } else {
        this.fetchData();
        // this.fetchDetail("CE6A09E8-B221-11E7-B91A-A55306083773")
      }
    }
    */
  }

  componentDidUpdate() {
    this.fetchData();
  }

    //获取微信接口信息
  fetchWxConfig(cb) {
/*
    let loc = location.href;
    const self = this;
    request(constant.api_fetch_auth_config, {
      method: "post",
      body: JSON.stringify({
        url: loc.split("#")[0]
      })
    }).then((response) => {
      let {data} = response;
      self.setState({
        wxConfig: data,
        loadingConfig: 2
      })
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature,// 必填，签名，见附录1
        jsApiList: ["chooseImage", "uploadImage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      cb()
    })
  */
  }

  //获取数据

  fetchData() {
    const self = this;
    const {wxConfig = {}, loadingList, from} = this.state;
    let url = constant.api_fetch_booking_list;
    let urlData = urlParam();
    if (from === "qr") {
      if (loadingList == 0) {
        self.setState({
          loadingList: 1
        });
        if (url.indexOf("?") === -1) {
          url = url + "?";
        }
        url = url + "&ec=" + urlData.d + "&t=true"
        request(url, {
          method: "get"
        }).then((result) => {
          let list = null, data = null;
          if (convertErr(wxConfig, result.errcode)) {
            self.setState({
              loadingList: 2
            })
            if (result.data) {
              list = result.data;
              if (list.length > 1) {
                self.setState({
                  data:null,
                  list
                })
              } else {
                data = list[0];
                self.fetchDetail(data.id, wxConfig)
              }
            }
          }
        })
      }
    }
  }

  fetchDetail(id, wxConfig) {
    const self = this;
    let _id = id.replace(/-/g, '');
    let url = constant.api_fetch_booking_detail.replace(/\{0\}/, _id);
    request(url, {
      method: "get"
    }).then((response) => {
      let {data, errcode} = response;
      if (convertErr(wxConfig, errcode)) {
        self.setState({
          data,
          loadingList: 2
        })
      }
    })
  }

  hdlSelList(id) {
    const {wxConfig} = this.state;
    this.fetchDetail(id, wxConfig)
  }

  hdlEditCB() {//确认预约成功后的操作
    let {keyFlag} = this.state;
    this.setState({
      loadingList: 0,
      list: [],
      data: null,
      keyFlag: keyFlag + 1
    });
  }

  render() {
    let {wxConfig = null, list = [], loadingList, data, from, keyFlag} = this.state;
    let urlData = urlParam();
    let dom = null;
    if (from === "qr") {
      if (data) {
        dom = (<IdInfoEditComponent wxConfig={wxConfig} qrSecret={urlData.d} data={data}
                                    submitCB={this.hdlEditCB.bind(this)} key={keyFlag}/>);
      } else {
        dom = (<BookingList data={list} loading={loadingList} onClick={this.hdlSelList.bind(this)}
                            key={keyFlag}/>);
      }
    } else {
      dom = (<IdInfoComponent wxConfig={wxConfig} key={keyFlag}/>);
    }
    return dom;
  }
}








ReactDOM.render(
  <div className="App">
    <Provider store={store}>
      <Booking/>
    </Provider>
  </div>,
  document.getElementById('root')
);
