import React from 'react';
import BookingListItem from './bookingListItem';

export default class bookingList extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {};
    }

    onClick(v) {
        const {onClick} = this.props;
        onClick && onClick(v);
    }

    render() {
        const {data = [],loading} = this.props;
        const self = this;
        return (
            <div className={"container-fluid "}>
                <div className="row borderBottom">
                    <div className="col-xs-12">
                        <div className="head">预约登记列表</div>
                    </div>
                </div>
                {
                    data.map(function (item, i) {
                        return (
                            <BookingListItem data={item} key={i}
                                             isLast={i == data.length - 1 || i == 0}
                                             onClick={self.onClick.bind(self)}>
                            </BookingListItem>
                        )
                    })
                }

                {
                    loading == 1 ? (
                        <div className="loading-mask">
                            <div className="loading-box">
                                <div className={"loading"}></div>
                            </div>
                        </div>
                    ) : null
                }
                {
                    loading == 2 ? (
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="list-end">加载完毕</div>
                            </div>
                        </div>
                    ) : null
                }
            </div>
        )
    }
}