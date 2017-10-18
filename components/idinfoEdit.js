'use strict';

/**
 * 身份信息登记相关js
 *
 * @author cl
 * @since 1.0
 * @date 2017.09.25
 */

import React from 'react';
// import $ from 'jquery';
import 'rmc-picker/assets/index.css';
import 'rmc-date-picker/assets/index.css';
import locale from 'rmc-date-picker/lib/locale/zh_CN'
import DatePicker from 'rmc-date-picker';
import moment from 'moment';
import PopPicker from './form/popupPicker';
import 'weui';
import 'react-weui/build/packages/react-weui.css';
import {Select} from 'react-weui/build/packages';
import {format, request, convertErr} from '../common/util';
import * as constant from '../common/constant';
import PersonSelect from './personSelect';
import InputControl from './form/inputControl';
import WarnTip from './warnTip';
import BookingSuccessTip from './bookingSuccessTip';
import StepperControl from './form/stepperControl'

export default class IdInfoEditComponent extends React.PureComponent {
    constructor(props) {
        super(props);
        this._store = props.store;
        this.state = {
            data: null,
            keyPadHeight: 0,
            selCardTxt: '证件类型',
            date: null,
            now: moment(),
            belongMediaIds: [],
            flag: 0,//保存数组时，同时操作这个参数，使渲染成功（由于 PureComponent的特性
            error: "",
            submitFlag: 0,//0:未提交；1：提交中；2：提交完成
            fields: {
                au: constant.au_type_idcard,
                ai: "",
                bookingVisitDate: null,
                visitReason: "",
                contactNumber: "",
                visitPersonNum: 1,
                visiteeId: null,
                belongs: []
            },
            initStatus: 0,//初始化。0：未完成；1：已完成
            selFlag: 0,
            showOk: false
        };
        this.belongings = [];
    }

    componentWillMount() {
        this.initData();
    }

    componentDidUpdate() {
        this.initData();
    }

    initData() {
        const {initStatus} = this.state;
        const {data} = this.props;
        if (initStatus === 0) {
            if (data) {
                let {
                    visitor: name, authInfo: ai, domainID: d, visitDate: bookingVisitDate, contactNumber, gutInfoId,
                    personNum: visitPersonNum, visiteeId, visitee: visiteeName, belongs = [], reason: visitReason
                } = data;
                let belongMediaIds = [], _belongs = [];
                for (let i = 0; i < belongs.length; i++) {
                    belongMediaIds.push(constant.file_path + belongs[i].picUri);
                    _belongs.push({
                        id: belongs[i].id,
                        name: belongs[i].name,
                        state: 2
                    })
                }
                // alert(JSON.stringify(belongMediaIds))
                let fields = {
                    au: constant.au_type_idcard,
                    d,
                    name,
                    ai,
                    contactNumber,
                    visitPersonNum,
                    visiteeId,
                    visitReason,
                    bookingVisitDate,
                    gutInfoId,
                    belongs: _belongs
                };
                this.setState({
                    visiteeName,
                    date: moment(bookingVisitDate),
                    initStatus: 1,
                    data,
                    fields,
                    updateFields: {},
                    belongMediaIds//mediaid集合
                })
            } else {
                this.setState({
                    initStatus: 1
                })
            }
        }
    }
/*
    hdlAddImg(i, e) {//处理新增图片的按钮点击操作
        let loc = location.href;
        let {belongMediaIds, fields, updateFields} = this.state;
        let {belongs = []} = fields;
        let self = this;

        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                let i = 0, length = localIds.length;

                function upload() {
                    wx.getLocalImgData({
                        localId: localIds[i], // 图片的localID
                        success: function (res) {
                            let {flag} = self.state;
                            var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                            belongMediaIds.push(localData)
                            self.setState({
                                belongMediaIds,
                                flag: flag + 1
                            })
                            wx.uploadImage({
                                localId: localIds[i],
                                success: function (RES) {
                                    i++;
                                    let {flag} = self.state;
                                    // res.serverId 就是 media_id，根据它去微信服务器读取图片数据：
                                    belongs.push({
                                        picID: RES.serverId,
                                        name: "",
                                        state: 1,
                                        update: true
                                    });
                                    self.setState({
                                        fields: {
                                            ...fields,
                                            belongs
                                        },
                                        updateFields: {
                                            ...updateFields,
                                            belongs
                                        },
                                        flag: flag + 1
                                    })
                                },
                                fail: function (res) {
                                    // alert(JSON.stringify(res));
                                }
                            });
                        }
                    });
                }

                upload();
            }
        });
    }
*/
    hdlSelectPerson(item) {
        let {fields, updateFields} = this.state;
        this.setState({
            fields: {
                ...fields,
                d: item.domainId || "",
                visiteeId: item.id || ""
            },
            updateFields: {
                ...updateFields,
                d: item.domainId || "",
                visiteeId: item.id || ""

            },
            visiteeName: item.name || ""
        })
    }

    renderImgs() {//显示选择的图片缩略图
        let {fields, belongMediaIds} = this.state;
        let {belongs = []} = fields;
        let dom = [];
        const self = this;
        for (let i = 0; i < belongs.length; i++) {
            dom.push(<li key={i + "img"} className="idInfo-list-item ">
                <div className="idInfo-belongings-img" style={{"backgroundImage": "url(" + belongMediaIds[i] + ")"}}/>
                <div className="idInfo-input">
                    <InputControl inputCls="form-control input" placeholder="名称"
                                  defaultValue={belongs[i].name}
                                  onChange={(v) => self.hdlChangeForm(v, {name: "belongNames", i})}/>
                </div>
            </li>)
        }
        return dom
    }

    hdlValidForm(arr = []) {//验证表单合法性
        let valid = true, result = null;
        const {updateFields, date} = this.state;
        const self = this;
        for (let i = 0; i < arr.length; i++) {
            if (valid && updateFields[arr[i]] !== undefined) {
                if (arr[i] === "bookingVisitDate") {
                    result = self.hdlValidFormItem(arr[i], date);
                } else {
                    result = self.hdlValidFormItem(arr[i], updateFields[arr[i]]);
                }
                if (result.msg) {
                    self.setState({
                        error: result
                    });
                    valid = false;
                }
            }
        }
        return valid;
    }
/*
    hdlPreSubmit(fields) {//验证后，准备提交之前的工作
        let isDebug = location.href.indexOf("debug") !== -1;
        let {visiteeId, d, belongs = []} = fields;
        if (visiteeId) {
            fields.visiteeId = visiteeId.replace(/-/g, '');
        }
        if (d) {
            fields.d = d.replace(/-/g, '');
        }
        if (belongs.length) {
            for (let i = 0; i < belongs.length; i++) {
                delete belongs[i].update;
            }
            fields.belongs = belongs;
        } else {
            delete fields.belongs
        }
        this.setState({
            error: "",
            submitFlag: 1
        })

        return fields;
    }
*/
/*
    hdlSubmit() {
        const {fields, updateFields, data} = this.state;
        const {wxConfig, submitCB} = this.props;
        const valid = this.hdlValidForm(["name", "ai", "bookingVisitDate", "visiteeId"]);
        const self = this,
            isDebug = location.href.indexOf("debug") !== -1;
        let url = "";
        let _fields = updateFields;

        if (valid) {
            _fields = this.hdlPreSubmit(_fields);
            url = constant.api_submit_booking_arrival_edit;
            if (!$.isEmptyObject(_fields)) {
                _fields.bookingID = data.id;
                _fields.d = _fields.d || data.domainID;
                _fields.ai = _fields.ai || data.authInfo;
                let newFields = {
                    ai: _fields.ai || fields.ai,
                    d: _fields.d || fields.d,
                    name: _fields.name || fields.name,
                    bookingID: data.id,
                    belongs: _fields.belongs || undefined,
                    detail: {
                        contactNumber: _fields.contactNumber,
                        visitPersonNum: _fields.visitPersonNum,
                        visiteeId: _fields.visiteeId,
                        visitReason: _fields.visitReason,
                        bookingVisitDate: _fields.bookingVisitDate
                    }
                }
                // alert("参数：" + JSON.stringify(newFields))
                request(url, {
                    method: "post",
                    body: JSON.stringify(newFields)
                }).then((response) => {
                    // alert("返回：" + JSON.stringify(response))
                    if (convertErr(wxConfig, response.errcode)) {
                        self.setState({
                            submitFlag: 2,
                            showOk: true
                        });
                    } else {
                        self.setState({
                            submitFlag: 0,
                            showOk: false
                        })
                    }
                }).catch(function (e) {
                    // alert("错误:" + alert(JSON.stringify(e)))
                })
            } else {
                self.setState({
                    submitFlag: 2,
                    showOk: true
                });
                submitCB && submitCB();
            }
        }
    }
*/
    hdlValidFormItem(name, v) {
        let msg = "";
        if (name === "name") {
            if (!v || !v.replace(/^\s*|\s*$/g, "")) {
                msg = constant.error_name_empty;
            }
        }
        else if (name === "ai") {
            if (v) {
                if (v.replace(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/g, "") === v) {
                    msg = constant.error_sfzh_fail;

                }
            } else {
                msg = constant.error_sfzh_empty;
            }
        }
        else if (name === "visiteeId") {
            if (!v) {
                msg = constant.error_visiteeId_empty;
            }
        }
        else if (name === "bookingVisitDate") {
            console.log(v.isAfter(moment()), v, moment().toDate())
            if (!v) {
                msg = constant.error_bookingVisitDate_empty;
            } else if (!v.isAfter(moment())) {
                msg = constant.error_bookingVisitDate_not_future;
            }
        }
        return {
            name,
            msg
        }
    }
/*
    hdlChangeForm(v, validMsg) {
        let {fields, updateFields} = this.state;
        let {belongs} = fields;
        if (validMsg) {
            if (validMsg.msg) {
                this.setState({
                    error: validMsg,
                    fields: {
                        ...fields,
                        [validMsg.name]: v
                    },
                    updateFields: {
                        ...updateFields,
                        [validMsg.name]: v
                    }
                })
            } else if (validMsg.name === "bookingVisitDate") {
                this.setState({
                    fields: {
                        ...fields,
                        bookingVisitDate: v.toDate()
                    },
                    updateFields: {
                        ...updateFields,
                        bookingVisitDate: v.toDate()
                    },
                    date: v
                });
            } else if (validMsg.name === "belongNames") {
                belongs[validMsg.i].name = v;
                belongs[validMsg.i].update = true;
                this.setState({
                    fields: {
                        ...fields,
                        belongs
                    },
                    updateFields: {
                        ...updateFields,
                        belongs
                    },
                    flag: flag + 1
                });
            } else {
                this.setState({
                    error: {},
                    fields: {
                        ...fields,
                        [validMsg.name]: v
                    },
                    updateFields: {
                        ...updateFields,
                        [validMsg.name]: v
                    }
                })

            }
        } else {
            this.setState({
                error: {},
                fields: {
                    ...fields,
                    [validMsg.name]: v
                }
            })
        }
    }
  */
    hdlChangeDate(v) {
        this.hdlChangeForm(v, this.hdlValidFormItem("bookingVisitDate", v));
    }

    hdlOkClick() {
        const {submitCB} = this.props;
        submitCB && submitCB();
    }

    render() {
        let {now, date, error, selFlag, wxConfig, showOk, visiteeName = "", submitFlag, fields} = this.state;
        let {name = "", ai = "", visitReason = "", contactNumber = "", visiteeId = null, visitPersonNum = 1} = fields;
        let datePicker = <DatePicker
            defaultDate={date || now}
            mode={'datetime'}
            locale={locale}
            use24Hours
        />
        let okDom = (
            <BookingSuccessTip show={showOk} onOk={this.hdlOkClick.bind(this)} text={"确认预约成功"}/>);
        return (
            <div className={"container-fluid "} style={{overflow: submitFlag === 1 ? "hidden" : "auto"}}>
                <WarnTip text={error.msg}/>
                {okDom}
                <div className="row borderBottom">
                    <div className="col-xs-12">
                        <div className="head">预约登记</div>
                    </div>
                </div>
                <div className="row form-row">
                    <div className="col-xs-12">
                        <div className="borderBottom">
                            <div className="idInfo-label">姓名</div>
                            <div className="idInfo-input">
                                <InputControl inputCls="form-control input" placeholder="请输入姓名"
                                              key={selFlag + "name"}
                                              hdlValid={(v) => this.hdlValidFormItem("name", v)}
                                              defaultValue={name}
                                              validStatus={!(error.name && error.name === "name")}
                                              onChange={(v) => this.hdlChangeForm(v, {name: "name"})}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row form-row">
                    <div className="col-xs-12">
                        <div className="borderBottom">
                            <div className="idInfo-label">身份证</div>
                            <div className="idInfo-input">
                                <InputControl inputCls={"form-control input"} placeholder="请输入身份证号" key={selFlag + "ai"}
                                              hdlValid={(v) => this.hdlValidFormItem("ai", v)} defaultValue={ai}
                                              validStatus={!(error.name && error.name === "ai")}
                                              onChange={this.hdlChangeForm.bind(this)}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row form-row borderBottom">
                    <div className="col-xs-12 ">
                        <div className="idInfo-label">手机</div>
                        <div className="idInfo-input flex flex-row">
                            <span className="flex-item">+86</span>
                            <InputControl inputCls="form-control input flex-item" placeholder="请输入您的手机号"
                                          key={selFlag + "contactNumber"} defaultValue={contactNumber}
                                          onChange={(v) => this.hdlChangeForm(v, {name: "contactNumber"})}/>
                        </div>
                    </div>
                </div>
                <div className="row form-row">
                    <div className="col-xs-12 ">
                        <div className="borderBottom">
                            <div className="idInfo-label">被访人</div>
                            <div className="idInfo-input">
                                <PersonSelect className="dropdownList" defaultValue={visiteeId}
                                              defaultText={visiteeName} key={selFlag + "visitee"}
                                              wxConfig={wxConfig}
                                              onSelect={this.hdlSelectPerson.bind(this)}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row form-row">
                    <div className="col-xs-12">
                        <div className="borderBottom">
                            <div className="idInfo-label">来访事由</div>
                            <div className="idInfo-input">
                                <InputControl inputCls="form-control input" placeholder="请输入来访事由"
                                              key={selFlag + "visitReason"} defaultValue={visitReason}
                                              onChange={(v) => this.hdlChangeForm(v, {name: "visitReason"})}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row form-row">
                    <div className="col-xs-12">
                        <div className="idInfo-label">来访人数</div>
                        <div className="idInfo-input">
                            <StepperControl
                                defaultValue={visitPersonNum}
                                onChange={(v) => this.hdlChangeForm(v, {name: "visitPersonNum"})}/>
                        </div>
                    </div>
                </div>
                <div className="row form-row borderBottom">
                    <div className="col-xs-12">
                        <div className="idInfo-label">来访时间</div>
                        <div className="idInfo-input">
                            <PopPicker
                                datePicker={datePicker}
                                dismissText={"取消"}
                                okText={"确定"}
                                transitionName="rmc-picker-popup-slide-fade"
                                maskTransitionName="rmc-picker-popup-fade"
                                title="选择时间"
                                date={date}
                                validStatus={!(error.name && error.name === "bookingVisitDate")}
                                onOk={(v) => this.hdlChangeDate(v)}
                            >
                            </PopPicker>
                        </div>
                    </div>
                </div>
                <div className="row idInfo-belongings">
                    <div className="col-xs-12 borderBottom">
                        <div className="idInfo-label">随身物品</div>
                        <ul className="idInfo-list-group">
                            {this.renderImgs()}
                            <li className="idInfo-list-item ">
                                <div className="idInfo-belongings-img add" onClick={this.hdlAddImg.bind(this)}/>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="idInfo-layout-row">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="idInfo-layout">
                                <span className="idInfo-layout-label">访客</span>
                                <span
                                    className="idInfo-layout-content">{name}</span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="idInfo-layout">
                                <span className="idInfo-layout-label">被访人</span>
                                <span
                                    className="idInfo-layout-content">{visiteeName}</span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="idInfo-layout">
                                <span className="idInfo-layout-label">事由</span>
                                <span
                                    className="idInfo-layout-content">{visitReason} </span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="idInfo-layout">
                                <span
                                    className="idInfo-layout-content">{date ? format(date.toDate()) : ""}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    submitFlag === 1 ? (
                        <div className="loading-mask">
                            <div className="loading-box">
                                <div className={"loading"}></div>
                            </div>
                        </div>
                    ) : null
                }
                <div className="row">
                    <div className="col-xs-12">
                        <div className="booking-btn"
                             onClick={this.hdlSubmit.bind(this)}>确&nbsp;&nbsp;认&nbsp;&nbsp;预&nbsp;&nbsp;约
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
