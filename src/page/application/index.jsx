
'use strict';
import React        from 'react';
import ReactDOM     from 'react-dom';
import { Link }     from 'react-router';

import PageTitle    from 'component/page-title/index.jsx';
import Pagination   from 'component/pagination/index.jsx';

import MMUtile      from 'util/mm.jsx';
import Application        from 'service/application.jsx';

const _mm = new MMUtile();
const _application = new Application();

// import './index.scss';

const ApplicationList = React.createClass({
    getInitialState() {
        return {
            list            : [],
            listType        : 'list', // list / search
            applicationNumber     : '',
            pageNum         : 1,
            pages           : 0
        };
    },
    componentDidMount(){
       this.loadApplicationList();
    },
    // 加载报名表
    loadApplicationList(){
        let listParam       = {};
        listParam.listType  = this.state.listType;
        listParam.pageNum   = this.state.pageNum;
        // 按比赛名搜索
        if(this.state.listType ==='search'){
            listParam.applicationNo = this.state.applicationNumber;
        }
        // 查询
        _application.getApplicationList(listParam).then(res => {
            this.setState(res);
        }, errMsg => {
            _mm.errorTips(errMsg);
        });
    },
    // 关键词变化
    onApplicationNumberChange(e){
        let applicationNumber = e.target.value.trim();
        this.setState({
            applicationNumber : applicationNumber
        });
    },
    // 搜索
    onSearch(){
        if(this.state.applicationNumber){
            // setState是异步的
            this.setState({
                listType    : 'search',
                pageNum     : 1
            }, () => {
                this.loadApplicationList();
            });
        }else{
            // setState是异步的
            this.setState({
                listType    : 'list',
                pageNum     : 1
            }, () => {
                this.loadApplicationList();
            });
        }
            
    },
    // 页数变化
    onPageNumChange(pageNum){
        this.setState({
            pageNum     : pageNum
        }, () => {
            this.loadApplicationList();
        });
    },
    
    render() {
        return (
            <div id="page-wrapper">
                <PageTitle pageTitle="报名管理"/>
                <div className="row">
                    <div className="search-wrap col-md-12">
                        <div className="form-inline">
                            <div className="form-group">
                                <select className="form-control">
                                    <option value="applicationNumber">按报名号查询</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="报名号" onChange={this.onApplicationNumberChange}/>
                            </div>
                            <button type="button" className="btn btn-default" onClick={this.onSearch}>查询</button>
                        </div>
                    </div>
                    <div className="table-wrap col-lg-12">
                        <table className="table table-striped table-bapplicationed table-hover">
                            <thead>
                                <tr>
                                    <th>报名号</th>
                                    <th>报名状态</th>
                                    <th>报名花费</th>
                                    <th>创建时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.list.length ? this.state.list.map((application, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <Link className="opear" to={ '/application/detail/' + application.applicationNo}>{application.applicationNo}</Link>
                                                </td>
                                                <td>{application.statusDesc}</td>
                                                <td>￥{application.payment}</td>
                                                <td>{application.createTime}</td>
                                                <td>
                                                    <Link className="opear" to={ '/application/detail/' + application.applicationNo}>查看</Link>
                                                </td>
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

export default ApplicationList;