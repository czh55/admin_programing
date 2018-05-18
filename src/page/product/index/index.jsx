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

import PageTitle    from 'component/page-title/index.jsx';
import Pagination   from 'component/pagination/index.jsx';

import MMUtile      from 'util/mm.jsx';
import Product      from 'service/product.jsx';

import User      from 'service/user.jsx';


const _mm = new MMUtile();
const _product = new Product();
const _user = new User();

import './index.scss';

const ProductList = React.createClass({
    getInitialState() {
        return {
            list            : [],
            listType        : 'list', // list / search
            searchType      : 'productId', // productId / productName
            searchKeyword   : '',
            pageNum         : 1,
            userId          : 0
        };
    },
    componentDidMount(){
        this.loadProductList();
        let userInfo = _mm.getStorage('userInfo');
        if(userInfo){
            this.setState({
                userId : userInfo.id || -1
            });
        }
    },
    // 加载产品列表
    loadProductList(pageNum){
        let listParam       = {},
            listType        = this.state.listType,
            searchType      = this.state.searchType;
            
        listParam.listType  = listType;
        listParam.pageNum   = pageNum || this.state.pageNum;
        // 按商品名搜索
        if(listType == 'search' && searchType == "productName"){
            listParam.productName = this.state.searchKeyword;
        }
        // 按商品id搜索
        if(listType == 'search' && searchType == "productId"){
            listParam.productId = this.state.searchKeyword;
        }
        // 按商品status搜索
        if(listType == 'search' && searchType == "status"){
            listParam.status = this.state.searchKeyword;
        }
        // 查询
        _product.getProductList(listParam).then(res => {
            console.log(res)
            this.setState(res);
        }, err => {
            _mm.errorTips(err.msg || err.statusText);
        });
    },
    // 搜索类型变化
    onSearchTypeChange(e){
        let searchType = e.target.value;
        this.setState({
            searchType : searchType
        });
    },
    // 关键词变化
    onKeywordChange(e){
        let keyword = e.target.value;
        this.setState({
            searchKeyword : keyword
        });
    },
    // 搜索
    onSearch(){
        this.setState({
            listType    : 'search'
        }, () => {
            this.loadProductList(1);
        });
    },
    // 页数变化
    onPageNumChange(pageNum){
        this.loadProductList(pageNum);
    },
    setProductStatus(productId, status){
        let currentStatus   = status,
            newStatus       = currentStatus == 1 ? 2 : 1,
            statusChangeTips= currentStatus == 1 ? '确认要下架该商品？' : currentStatus == 2 ? '确认要上架该商品？' : '确定审核通过商品？';
        if(window.confirm(statusChangeTips)){
            _product.setProductStatus(productId, newStatus).then(res => {
                // 操作成功提示
                _mm.successTips(res);
                this.loadProductList();
            }, err => {
                _mm.errorTips(err.msg);
            });
        }
    },
    render() {       
        return (
            <div id="page-wrapper">
                <PageTitle pageTitle="商品管理">
                    <div className="page-header-right">
                        <Link className="btn btn-primary" to="/product/save"><i className="fa fa-plus fa-fw"></i>添加商品</Link>
                    </div>
                </PageTitle>
                <div className="row">
                    <div className="search-wrap col-md-12">
                        <div className="form-inline">
                            <div className="form-group">
                                <select className="form-control" onChange={this.onSearchTypeChange}>
                                    <option value="productId">按商品id查询</option>
                                    <option value="productName">按商品名称查询</option>
                                    <option value="status">按商品状态查询</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="关键词" onChange={this.onKeywordChange}/>
                            </div>
                            <button type="button" className="btn btn-default" onClick={this.onSearch}>查询</button>
                        </div>
                    </div>
                    <div className="table-wrap col-lg-12">
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>信息</th>
                                    <th>价格</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.list.length ? this.state.list.map((product, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{product.id}</td>
                                                <td>
                                                    <p>{product.name}</p>
                                                    <p>{product.subtitle}</p>
                                                </td>
                                                <td>{product.price}</td>
                                                <td>
                                                    <span>{product.status == 1 ? '在售'  : product.status == 2 ? '已下架': '待审核'}</span>
                                                    {
                                                        this.state.userId != 1 && product.status == 0 ? 
                                                        <span></span> :
                                                        <a className="btn btn-xs btn-warning opear" 
                                                            data-status={product.status} 
                                                            onClick={this.setProductStatus.bind(this, product.id, product.status)}>{product.status == 1 ? '下架' : product.status == 2 ? '上架': '审核批准'}</a>
                                                    }
                                                    
                                                </td>
                                                <td>
                                                    <Link className="opear" to={ '/product/detail/' + product.id}>查看</Link>
                                                    <Link className="opear"  to={ '/product/save/' + product.id}>编辑</Link>
                                                </td>
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

export default ProductList;
