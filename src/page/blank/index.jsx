
'use strict';
import React        from 'react';
import ReactDOM     from 'react-dom';
import { Link }     from 'react-router';

import PageTitle    from 'component/page-title/index.jsx';

import Competition      from 'service/competition.jsx'
const _competition  = new Competition();

const CompetitionCategory = React.createClass({
    getInitialState() {
        return {
            
        };
    },
    componentDidMount: function(){
        
    },
    render() {
        return (
            <div id="page-wrapper">
                <PageTitle pageTitle="品类管理">
                    <div className="page-header-right">
                        <Link className="btn btn-primary" to="/competition.category/add">
                            <i className="fa fa-plus fa-fw"></i>
                            <span>Button</span>
                        </Link>
                    </div>
                </PageTitle>
                <div className="row">
                    <div className="col-md-12">
                        Blank page
                    </div>
                </div>
            </div>
        );
    }
});

export default CompetitionCategory;
