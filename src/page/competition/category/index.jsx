
'use strict';
import React        from 'react';
import ReactDOM     from 'react-dom';
import { Link }     from 'react-router';

import './index.scss';
import MMUtile      from 'util/mm.jsx';
import PageTitle    from 'component/page-title/index.jsx';

import Competition      from 'service/competition.jsx';

const _mm = new MMUtile();
const _competition  = new Competition();

const CompetitionCategory = React.createClass({
    getInitialState() {
        return {
            parentCategoryId    : this.props.params.categoryId || 0,
            categoryList        : []
        };
    },
    componentDidMount(){
        this.initCategory(this.state.parentCategoryId);
    },
    componentDidUpdate(prevProps){
        let oldPath = prevProps.location.pathname,
            newPath = this.props.location.pathname,
            newId   = this.props.params.categoryId || 0;
        if(oldPath !== newPath){
            this.initCategory(newId);
        }   
    },
    initCategory(categoryId){
        // 按父id查询对应的类别
        _competition.getCategory(categoryId).then(res => {
            this.setState({
                parentCategoryId : categoryId,
                categoryList: res
            });
        }, errMsg => {
            _mm.errorTips(errMsg);
        });
    },
    onUpdateName(categoryId, categoryName){
        let newName = window.prompt("请输入新的类别名称", categoryName); 
        if(newName){
            // 更新
            _competition.updateCategoryName({
                categoryId : categoryId,
                categoryName : newName
            }).then(res => {
                _mm.successTips(res);
                this.initCategory(this.state.parentCategoryId);
            }, errMsg => {
                _mm.errorTips(errMsg);
            });
        }else{
            _mm.errorTips('请输入正确的类别名称');
        }
    },
    render() {
        return (
            <div id="page-wrapper">
                <PageTitle pageTitle="类别管理">
                    <div className="page-header-right">
                        <Link className="btn btn-primary" to="/competition.category/add">
                            <i className="fa fa-plus fa-fw"></i>
                            <span>添加类别</span>
                        </Link>
                    </div>
                </PageTitle>
                <div className="row">
                    <div className="col-lg-12">
                        <p>当前商品分类ID：{this.state.parentCategoryId}</p>
                    </div>
                    <div className="table-wrap col-lg-12">
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>类别ID</th>
                                    <th>类别名称</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.categoryList.map((category, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{category.id}</td>
                                            <td>
                                                <span>{category.name}</span>
                                            </td>
                                            <td>
                                            <a className="opera" onClick={this.onUpdateName.bind(this, category.id, category.name)}>修改名称</a>
                                            {category.parentId == 0 ? 
                                                <Link to={'/competition.category/index/' + category.id} className="opera">查看其子类别</Link>
                                                : null
                                            }
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
});

export default CompetitionCategory;
