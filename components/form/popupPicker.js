import React from 'react';
import PopupPicker from 'rmc-date-picker/lib/Popup'
import 'rmc-picker/assets/popup.css';
import {format} from "../../common/util";

export default class popupPicker extends React.PureComponent {
    onOk(v) {
        const {onChange, onOk} = this.props;
        if (onChange) {
            onChange(v);
        }
        if (onOk) {
            onOk(v);
        }
    }

    render() {
        let {validStatus = true,date} = this.props;
        return (<PopupPicker
            picker={this.props.datePicker}
            value={this.props.date}
            {...this.props}
            className={validStatus ? "" : "error-input"}
            onOk={this.onOk.bind(this)}
        >
            <div>
                <input type="text" className="input" readOnly
                       value={date ? format(date.toDate()) : ""}/>
                <i className={"icon-right"}></i>
            </div>
        </PopupPicker>);
    }
}