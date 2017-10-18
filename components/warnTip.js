import React from 'react';

export default class warnTip extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        let {text,style}=this.props;
        if(text){
            return (
                <div className={"idinfo-warn-text"} style={style}>{text}</div>
            )
        }else{
            return (
                <div></div>
            )
        }
    }

}