'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

import { Link, IndexLink } from 'react-router';

import MMUtile  from 'util/mm.jsx';

const _mm       = new MMUtile();

const SideNav = React.createClass({
    getInitialState() {
        return {
            id : ''
        };
    },
    componentDidMount(){
        let userInfo = _mm.getStorage('userInfo');
        if(userInfo){
            this.setState({
                id : userInfo.id || ''
            });
        }
    },
    render() {
        return (
            <div className="navbar-default sidebar" role="navigation">
                <div className="sidebar-nav navbar-collapse">
                    <ul className="nav" id="side-menu">
                        <li>
                            <IndexLink to="/home" activeClassName="active">
                                <i className="fa fa-dashboard fa-fw"></i>
                                <span>Home</span>
                            </IndexLink>
                        </li>
                        <li>
                            <Link>
                                <i className="fa fa-bar-chart-o fa-fw"></i>
                                <span>商品</span>
                            </Link>
                            <ul className="nav nav-second-level collapse in">
                                <li>
                                    <Link to="/product" activeClassName="active">商品管理</Link>
                                </li>
                                <li>
                                    {
                                        this.state.id == 1 ? 
                                        <Link to="/product.category" activeClassName="active">品类管理</Link>:
                                        ""
                                    }
                                    
                                </li>
                            </ul>
                        </li>
                        <li>
                            <Link>
                                <i className="fa fa-wrench fa-fw"></i>
                                <span>订单</span>
                            </Link>
                            <ul className="nav nav-second-level collapse in">
                                <li>
                                    <Link to="/order" activeClassName="active">订单管理</Link>
                                </li>
                            </ul>
                        </li>
                        {/*
                        <li>
                            <Link to="/user">
                                <i className="fa fa-user-o fa-fw"></i>
                                <span>用户</span>
                            </Link>
                        </li>
                        */}
                    </ul>
                </div>
            </div>
        );
    }
});

export default SideNav;