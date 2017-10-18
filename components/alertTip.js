import React from 'react';
// import $ from 'jquery';

export default class alertTip extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {}
    }

    hdlOk() {
        const {onOk} = this.props;
        onOk && onOk();
    }

    componentWillMount() {
        // const {show} = this.state;
        // const {clientHeight} = document.documentElement;
        // if (show) {
        //     $(document.body).css({
        //         height: clientHeight,
        //         overflow: "hidden"
        //     })
        // } else {
        //     $(document.body).css({
        //         height: "auto",
        //         overflow: "auto"
        //     })
        // }
    }

    render() {
        const {children, okText = "确定", show} = this.props;
        return (
            <div className="idinfo-alert" style={{display: show ? "block" : "none"}}>
                <div className="mask"></div>
                <div className={"idinfo-alert-box"}>
                    <div className="idinfo-alert-content">{children}</div>
                    <div className="idinfo-alert-btn" onClick={this.hdlOk.bind(this)}>{okText}</div>
                </div>
            </div>
        )
    }
}
