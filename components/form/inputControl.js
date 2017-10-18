import React from 'react';

export default class inputControl extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            value: null,
            isFocus: false
        };
    }

    onChange(e) {
        let {onChange, hdlValid} = this.props;
        let v = e.target.value;
        this.setState({
            value: v
        });
        if (hdlValid) {
            onChange && onChange(v, hdlValid(v));
        } else {
            onChange && onChange(v);
        }
    }

    hdlFocus(e) {
        this.setState({
            isFocus: true
        });
    }

    hdlBlur(e) {
        this.setState({
            isFocus: false
        });
    }

    hdlClear() {
        let {onChange, validStatus = true} = this.props;
        if (validStatus) {
            this.setState({
                value: ""
            })
            onChange && onChange("");
            this.input.focus()
        }
    }

    render() {
        let {placeholder, inputCls, defaultValue = "", validStatus = true} = this.props;
        let {value, isFocus} = this.state;
        return (
            <div tabIndex={"0"} onFocus={this.hdlFocus.bind(this)} onBlur={this.hdlBlur.bind(this)}>
                <input type="text" className={inputCls + (validStatus ? "" : " error-input")} placeholder={placeholder}
                       ref={(node) => this.input = node}
                       required value={value !== null ? value : defaultValue}
                       onChange={this.onChange.bind(this)}/>
                <a className={validStatus ? (isFocus ? "clear" : "") : "error"} onClick={this.hdlClear.bind(this)}></a>
            </div>
        )
    }
}
