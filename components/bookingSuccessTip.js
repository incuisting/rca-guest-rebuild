import React from 'react';
import AlertTip from './alertTip'

export default class bookingSuccessTip extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    hdlOk() {
        const {onOk} = this.props;
        onOk && onOk()
    }

    render() {
        const {show=false,text} = this.props;
        if (show) {
            return (
                <AlertTip show={show} onOk={this.hdlOk.bind(this)} >
                    <div className="ok-icon"></div>
                    <div className="ok-content">{text}</div>
                </AlertTip>)
        } else {
            return <div></div>
        }
    }
}