import React from 'react';
import {format} from '../common/util'

export default class bookingList extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isSelected: false
        };
    }

    onClick() {
        const {onClick, data} = this.props;
        onClick && onClick(data.id);
    }

    onPressBtn(v) {
        this.setState({
            isSelected: true
        });
    }

    render() {
        const {data, isLast = false} = this.props;
        const {isSelected} = this.state;
        const {visitee, reason, visitDate} = data;
        const date = format(new Date(visitDate));
        const self = this;
        return (
            <div className={"row idinfo-row" + (isLast ? " borderBottom" : "")}
                 onClick={self.onClick.bind(this)}>
                <div className="col-xs-12">
                    <div className={(!isLast ? "borderBottom " : "") + "flex flex-row idinfo-item"}>
                        <div className="idInfo-photo-img"></div>
                        <div className="flex flex-column flex-1">
                            <div className="idinfo-name ellipsis">{visitee}</div>
                            <div className="idinfo-visitDate">{date}</div>
                        </div>
                        <div className="flex flex-column flex-end">
                            <div className={"idinfo-btn" + (isSelected ? " selected" : "")}
                                 onTouchStart={self.onPressBtn.bind(this)}>查看详情
                            </div>
                            <div className="idinfo-reason ellipsis">{reason}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}