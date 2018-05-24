
'use strict';
import React        from 'react';
import ReactDOM     from 'react-dom';
import { Link }     from 'react-router';

import PageTitle    from 'component/page-title/index.jsx';
import Pagination   from 'component/pagination/index.jsx';

import MMUtile      from 'util/mm.jsx';
import User        from 'service/user.jsx';

const _mm = new MMUtile();
const _user = new User();

// import './index.scss';

const UserList = React.createClass({
    getInitialState() {
        return {
            list            : [],
            listType        : 'list', // list / search
            role            : 2,//角色0-管理员,1-普通用户
            pageNum         : 1,
            pages           : 0
        };
    },
    componentDidMount(){
       this.loadUserList();
    },
    // 加载用户列表
    loadUserList(){

        let listParam       = {};
        listParam.listType  = this.state.listType;
        listParam.pageNum   = this.state.pageNum;
        // 按角色搜索
        if(this.state.listType ==='search'){
            listParam.role = this.state.role;
            _mm.errorTips(listParam.role);
        }
        // 查询
        _user.getUserList(listParam).then(res => {
            this.setState(res);

        }, errMsg => {
            _mm.errorTips(errMsg);
        });
    },
    // 关键词变化
    onUserRoleChange(e){
        let role = e.target.value.trim();
        this.setState({
            role : role
        });
    },
    // 搜索
    onSearch(){
        if(this.state.role == 0){
            // setState是异步的
            this.setState({
                listType    : 'search',
                pageNum     : 1
            }, () => {
                this.loadUserList();
            });
        }


        if(this.state.role == 1){
            // setState是异步的
            this.setState({
                listType    : 'search',
                pageNum     : 1
            }, () => {
                this.loadUserList();
            });
        }

        if(this.state.role == 2){
            // setState是异步的
            this.setState({
                listType    : 'list',
                pageNum     : 1
            }, () => {
                this.loadUserList();
            });
        }
            
    },
    // 页数变化
    onPageNumChange(pageNum){
        this.setState({
            pageNum     : pageNum
        }, () => {
            this.loadUserList();
        });
    },
    
    render() {
        return (
            <div id="page-wrapper">
                <PageTitle pageTitle="用户管理"/>
                <div className="row">
                    <div className="search-wrap col-md-12">
                        <div className="form-inline">
                            <div className="form-group">
                                <select className="form-control">
                                    <option value="userNumber">按角色查询</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="用户角色" onChange={this.onUserRoleChange}/>
                            </div>
                            <button type="button" className="btn btn-default" onClick={this.onSearch}>查询</button>
                        </div>
                    </div>
                    <div className="table-wrap col-lg-12">
                        <table className="table table-striped table-busered table-hover">
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>用户名</th>
                                    <th>email</th>
                                    <th>电话</th>
                                    <th>角色</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.list.length ? this.state.list.map((user, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{user.id}</td>
                                                <td>{user.username}</td>
                                                <td>{user.email}</td>
                                                <td>￥{user.phone}</td>
                                                <td>{user.role}</td>
                                            </tr>
                                        );
                                    }) :
                                    (
                                        <tr>
                                            <td colSpan="6" className="text-center">没有找到相应结果~</td>
                                        </tr>
                                    )
                                }
                                            
                            </tbody>
                        </table>
                    </div>
                    {
                    this.state.pages > 1 ? <Pagination onChange={this.onPageNumChange} 
                        current={this.state.pageNum} 
                        total={this.state.total} 
                        showLessItems/>: null
                    }
                </div>
            </div>
        );
    }
});

export default UserList;