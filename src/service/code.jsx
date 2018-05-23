/*
* @Author: Rosen
* @Date:   2017-02-24 10:35:19
* @Last Modified by:   Rosen
* @Last Modified time: 2017-04-09 23:43:37
*/

'use strict';
import MMUtile from 'util/mm.jsx';

const _mm = new MMUtile();

export default class Code{
    
    // 获取商品信息
    getCodeList(listParam){
        return _mm.request({
            url     : _mm.getServerUrl('/manage/code/list.do'),
            data    : {
                pageNum     : listParam.pageNum || 1,
                productId   : listParam.productId
            }
        });
    }
}
