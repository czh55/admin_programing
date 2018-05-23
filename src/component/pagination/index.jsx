
'use strict';

import React        from 'react';
import ReactDOM     from 'react-dom';

import RcPagination from 'rc-pagination';

import './index.scss';

// 通用分页组件
const Pagination = React.createClass({
    getInitialState() {
        return {
            
        };
    },
    render() {
        return (
            <RcPagination {...this.props}/>
        )           
    }
});

export default Pagination;