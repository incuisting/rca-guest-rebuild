'use strict';
import React from 'react';

import "../../styles/stepperControl/style.scss"

export default class stepperControl extends React.Component {

    constructor(prop) {
        super(prop);
        this.state = {
            value: 1,
            status: false//是否已修改
        };
    }

    hdlChange(v) {
        const {onChange} = this.props;
        let value = Math.max(1, v);
        this.setState({
            value,
            status: true
        });
        onChange && onChange(v);
    }

    hdlLower() {
        const {value} = this.state;
        this.hdlChange(value - 1);
    }

    hdlUpper() {
        const {value} = this.state;
        this.hdlChange(value + 1);
    }

    render() {
        const {defaultValue} = this.props;
        const {value, status} = this.state;
        return (
            <div className="flex flex-row stepper">
                <span className="stepper-btn" onClick={this.hdlLower.bind(this)}>-</span>
                <input className="form-control input" type="number"
                       value={status ? value : defaultValue}
                       onChange={(e) => this.hdlChange(+e.target.value)}/>
                <span className="stepper-btn" onClick={this.hdlUpper.bind(this)}>+</span>
            </div>
        )
    }
}
