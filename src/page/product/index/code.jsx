/*
* @Author: Rosen
* @Date:   2017-02-11 18:46:37
* @Last Modified by:   Rosen
* @Last Modified time: 2017-04-09 23:36:03
*/

'use strict';
import React        from 'react';
import ReactDOM     from 'react-dom';
import { Link }     from 'react-router';
import moment       from 'moment'; 

import PageTitle    from 'component/page-title/index.jsx';
import Pagination   from 'component/pagination/index.jsx';

import MMUtile      from 'util/mm.jsx';
import Code      from 'service/code.jsx';
import User      from 'service/user.jsx';


const _mm = new MMUtile();
const _code = new Code();
const _user = new User();

import './code.scss';

const CodeList = React.createClass({
    getInitialState() {
        return {
            list            : [],
            productId       : this.props.params.pId,
            pageNum         : 1,
            username        : ''
        };
    },
    componentDidMount(){
        this.loadCodeList();
    },
    // 加载产品列表
    loadCodeList(pageNum){
        let listParam       = {};
            
        listParam.pageNum   = pageNum || this.state.pageNum;
        listParam.productId = this.state.productId;
        // 查询
        _code.getCodeList(listParam).then(res => {
            console.log(res)
            this.setState(res);//对应的参数名是list
        }, err => {
            _mm.errorTips(err.msg || err.statusText);
        });
    },
    // 页数变化
    onPageNumChange(pageNum){
        this.loadCodeList(pageNum);
    },
    
    render() {  
        return (
            <div id="page-wrapper">
                <PageTitle pageTitle="商品管理">
                    <div className="page-header-right">
                        <Link className="btn btn-primary" to="/code/save"><i className="fa fa-plus fa-fw"></i>添加商品</Link>
                    </div>
                </PageTitle>
                <div className="row">
                    <div className="table-wrap col-lg-12">
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>用户</th>
                                    <th>标题</th>
                                    <th>时间</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.list.length ? this.state.list.map((code, index) => {
                                        
                                        code.updateTime = moment(code.updateTime).format("YYYY-MM-DD HH:mm:ss");

                                        return (
                                            <tr key={index}>
                                                <td>{code.id}</td>
                                                <td>{code.userName}</td>
                                                <td><a href={'http://image.programing.com/'+code.src}>{code.title}</a></td>
                                                <td>{code.updateTime}</td>
                                            </tr>
                                        );
                                    }) :
                                    (
                                        <tr>
                                            <td colSpan="5" className="text-center">暂无结果~</td>
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

export default CodeList;
