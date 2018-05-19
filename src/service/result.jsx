/*
* @Author: Rosen
* @Date:   2017-02-24 10:35:19
* @Last Modified by:   Rosen
* @Last Modified time: 2017-04-09 23:43:37
*/

'use strict';
import MMUtile from 'util/mm.jsx';

const _mm = new MMUtile();

export default class Result{
    
    // 获取结果信息
    getResult(productId){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/result/detail.do'),
            data    : {
                productId : productId || 0
            }
        });
    }

    // 保存结果信息
    saveResult(result){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/result/save.do'),
            data    : result
        });
    }
    
}
