import React from 'react';
import {request, convertErr} from '../common/util'
// import $ from 'jquery';

class personSelect extends React.Component {

    constructor(prop) {
        let {defaultText, defaultValue} = prop;
        super(prop);
        this.state = {
            data: [],
            inputValue: defaultText || null,
            selValue: defaultValue || null,
            initStatus: 0

        }
    }

    onSelect(v) {
        this.setState({
            inputValue: v.name,
            selValue: v.id,
        })
        this.onValueChange(v);
    }

    onInputChange(v) {
        this.onValueChange(v);
        this.onFetch();
    }

    onValueChange(v) {
        let {onSelect} = this.props;
        this.setState({
            inputValue: v.name || "",
            selValue: v.id || ""
        })
        this.hldHide();
        onSelect && onSelect(v);
    }

    onFetch() {
        let self = this;
        let {inputValue} = this.state;
        let {wxConfig} = this.state;
        self.setState({
            show: false
        });
        if (inputValue && inputValue.match(/([\u4E00-\u9FFF]{1,})|(\d{11})/)) {
            request("/api/visitee/search?s=" + inputValue).then((response) => {
                if (convertErr(wxConfig, response.errcode)) {
                    self.setState({
                        data: response.data,
                        show: true
                    })
                }
            })
        }
    }

    hldHide() {
        this.setState({
            show: false
        });
    }

    renderOne(item, i, isSelected) {
        const {inputValue: value} = this.state;
        let str = [], v, si = 0;
        if (isSelected) {
            str.push(item.name);
            str.push(",");
            str.push(item.phone);
        } else {
            v = item.name;
            si = v.indexOf(value);
            if (si === -1) {
                str.push(v);
            } else {
                str.push(v.substr(0, si - 1));
                str.push(<span className="found" key={"name" + i}>{v.substr(si, value.length)}</span>);
                str.push(v.substring(si + value.length))
            }
            str.push(",");
            v = item.phone;
            si = v.indexOf(value);
            if (si === -1) {
                str.push(v);
            } else {
                str.push(v.substr(0, si - 1));
                str.push(<span className="found" key={"phone" + i}>{v.substr(si, value.length)}</span>);
                str.push(v.substring(si + value.length))
            }
        }
        return str;
    }

    componentDidUpdate() {
        // let self = this;
        // let {show} = this.state;
        // show && $("body").one("click", function (e) {
        //     var target = $(e.target);
        //     if (!target.is(".icon-search")) {
        //         self.hldHide();
        //     }
        // })
    }

    render() {
        let {data = [], show, inputValue, selValue} = this.state;
        let {className, defaultValue, defaultText} = this.props;
        let self = this;
        let arr = [];
        let sel = selValue !== null ? selValue : defaultValue;
        for (let i = 0; i < data.length; i++) {
            arr.push(<li key={i} onClick={self.onSelect.bind(self, data[i])}
                         className={sel === data[i].id ? "selected" : ""}>{self.renderOne(data[i], i, sel === data[i].id)}</li>)
        }
        return (
            <span>
                <input type="text" className="form-control input"
                       placeholder="至少两个汉字/手机号" value={inputValue != null ? inputValue : defaultText}
                       required ref={(node) => this.personSelectInput = node}
                       onChange={(e) => this.onInputChange({name: e.target.value, id: ""})}/>
                 <ul className={className} style={{display: show ? "block" : "none"}}>
                {arr}
                </ul>
                <a className="icon-search" onClick={this.onFetch.bind(this)}></a>
            </span>
        )
    }
}

export default personSelect;
