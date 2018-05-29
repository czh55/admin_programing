
'use strict';
// react
import React from 'react';
// react-dom
import { render } from 'react-dom';
// react-router
import { Router, Route, IndexRedirect, Link, hashHistory } from 'react-router';
// bootstrap
import 'node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'node_modules/bootstrap/dist/js/bootstrap.min.js';
// bootstrap sb-admin-2 主题
import 'node_modules/sb-admin-2/dist/css/sb-admin-2.min.css';
// font-awesome 字体
import 'node_modules/font-awesome/css/font-awesome.min.css';

// 页面
import Layout               from 'page/layout/index.jsx';
import Home                 from 'page/home/index.jsx';
import CompetitionList          from 'page/competition/index/index.jsx';
import CompetitionSave          from 'page/competition/index/save.jsx';
import CompetitionDetail        from 'page/competition/index/detail.jsx';
import ResultSave           from 'page/competition/index/result.jsx';
import code                 from 'page/competition/index/code.jsx';
import CompetitionCategory      from 'page/competition/category/index.jsx';
import CompetitionCategoryAdd   from 'page/competition/category/add.jsx';
import OrderList            from 'page/order/index.jsx';
import OrderDetail          from 'page/order/detail.jsx';
import User                 from 'page/user/index.jsx';
import Login                from 'page/login/index.jsx';
import ErrorPage            from 'page/error/index.jsx';
import BlankPage            from 'page/blank/index.jsx';

// render router
render(
    <Router history={hashHistory}>
        <Route path="/">
            {/* home */} 
            <IndexRedirect to="login" />
            <Route path="home" component={Layout}>
                <IndexRedirect to="index" />
                <Route path="index" component={Home}/>
            </Route>
            {/* competition */} 
            <Route path="competition" component={Layout}>
                <IndexRedirect to="index" />
                <Route path="index" component={CompetitionList}/>
                <Route path="save(/:pId)" component={CompetitionSave}/>
                <Route path="detail/:pId" component={CompetitionDetail}/>
                <Route path="result/:pId" component={ResultSave}/>
                <Route path="code/:pId" component={code}/>
            </Route>
            
            <Route path="competition.category" component={Layout}>
                <IndexRedirect to="index" />
                <Route path="index(/:categoryId)" component={CompetitionCategory}/>
                <Route path="add" component={CompetitionCategoryAdd}/>
            </Route>

            {/* order */} 
            <Route path="order" component={Layout}>
                <IndexRedirect to="index" />
                <Route path="index" component={OrderList}/>
                <Route path="detail/:orderNumber" component={OrderDetail}/>
            </Route>
            {/* user */} 
            <Route path="user" component={Layout}>
                <IndexRedirect to="index" />
                <Route path="index" component={User}/>
            </Route>
            {/* without layout */} 
            <Route path="login" component={Login}/>
            <Route path="blank" component={Layout}>
                <IndexRedirect to="index" />
                <Route path="index" component={BlankPage}/>
            </Route>
            <Route path="*" component={ErrorPage}/>
        </Route>
        
    </Router>, 
    document.getElementById('app')
);
