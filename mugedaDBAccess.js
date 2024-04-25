
var USERDATA_ENDPOINT = 'https://weika.mugeda.com/server/cards.php/userdata/list';

var CRID = '6619efd1312a2541bf0fcce0';

var dataArray = [];//全局变量，保存服务器返回的response.data，response.data的类型是对象数组

//木疙瘩用代码从服务器取数据
function getMessage(page, callbackfn){
    //Mugine.Utils.Toast.info('Wait Message',{type:'toast'});
    //console.log('读取第' + page + '页数据');
    ajaxHelper({
        url:USERDATA_ENDPOINT + '?current_page=' + page + '&crid=' + CRID,
        jsonp_callback:'__$$$',
        type:'jsonp',
        success: function(response){
            if(response.status === 0){
                callbackfn(response);
            } else{
                Mugine.Utils.Toast.info('Get Message Failed', {type:'toast'});
            }
        }
    })
}


//链式调用
//page:木疙瘩数据库取数据每次只能取十条,一次一页，page表示要取第多少页的十条数据
//以递归的方式调取出所有数据存入全局变量data
function recursiveGetMessage(container, page) {
    //console.log("第" + page + "次执行recursiveGetMessage函数");

    if (page==1){//清空全局数据变量，避免多次点击刷新数据叠加
        dataArray = [];
    }

    getMessage(page, function(response) {
        if(response.data){//如果返回数据不为空
        
            dataArray = dataArray.concat(response.data);// 合并数据

            //console.log('取出数据数量：' + dataArray.length);
        
            var totalcount = (response.total || 0);//取出数据库记录总数
        
            if(totalcount > dataArray.length){//如果数据库记录总数 > 已得到的记录数
                // 取下一页数据，设置一秒(100毫秒)的延时
                setTimeout(function() {
                    recursiveGetMessage(container, page + 1);
                }, 100);     
            } else {//全部数据已经取完，先对记录排序，再渲染列表

                // // 数据获取完全后，按照总分降序排序
                // dataArray.sort(function(a, b) {
                //     return b['总分'] - a['总分']; 
                // });

                //console.log('看看能不能把总分拿出来：' + dataArray[0].总分);

                // 先按分数降序排序，分数相同下按答题时间升序排序
                // 因为sort是默认用字符串的编码进行比较，需要转成数字
                dataArray.sort((a, b) => {
                    // 先按总分排序
                    if (Number(a.总分||0) < Number(b.总分||0)){
                        return 1;
                    }
                    if (Number(a.总分||0) > Number(b.总分||0)){
                        return -1;
                    }

                    // 再按答题时间排序
                    if (Number(a.答题计时标签||0) < Number(b.答题计时标签||0)){
                        return -1;
                    }
                    if (Number(a.答题计时标签||0) > Number(b.答题计时标签||0)){
                        return 1;
                    }

                    return 0;
                });

                // 把数据渲染到界面
                renderList(container, dataArray);
            }

        }  
    })
}

//渲染列表，建立一个表格，把信息加进去
function renderList(container, data){
    
        if(!data) return;

        //console.log('response的内容如下:');
        //console.log('response的类型是:' + typeof(data));
        //console.log('response是数组吗:' + Array.isArray(data));
        //console.log('行数：' + data.length);
        //console.log('列数：' + Object.keys(data[0]).length);
        //console.log('第一行第一列单元格内容：'+data[0]['姓名']);

        //****************************************
        //把容器里的表格都清理掉
        let tables = container.dom.getElementsByTagName('table');
        while(tables[0]) {
            tables[0].parentNode.removeChild(tables[0]);
        }
        var table = document.createElement('table');
        
        //设置表格样式
        table.style.width = '100%';           // 表格宽度
        table.style.borderCollapse = 'collapse';  // 边框合并

        // 创建表头
        var headers = ['排名', '姓名', '得分', '用时'];
        var thead = document.createElement('thead');
        var headerRow = document.createElement('tr');
        headers.forEach(function(header) {
            var th = document.createElement('th');
            th.innerHTML = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        for (var rownum = 0, l= data.length; rownum < l; rownum++){
            var tr = document.createElement('tr');
                
            var tdrankingnum = document.createElement("td");
            tdrankingnum.innerHTML = rownum + 1;
            tr.appendChild(tdrankingnum);

            var tdname = document.createElement("td");
            tdname.innerHTML = data[rownum]['姓名'];
            tr.appendChild(tdname);

            // var tdunit = document.createElement("td");
            // tdunit.innerHTML = data[rownum]['工作单位'];
            // tr.appendChild(tdunit);

            var tdscores = document.createElement("td");
            tdscores.innerHTML = (data[rownum]['总分'] || 0) + '分';
            tr.appendChild(tdscores);

            var tdtime = document.createElement("td");
            tdtime.innerHTML = (data[rownum]['答题计时标签'] || 0) + '秒';
            tr.appendChild(tdtime);

            //单元格内样式 没有起效果！！！
            var tds = tr.childNodes;
            for(var colnum = 0; colnum < tr.length; i++){
                tds[colnum].style.padding = '10px'; // 单元格内边距
                tds[colnum].style.padding = '1px solid black'; // 单元格边框
                tds[colnum].style.padding.textAlign = 'center'; // 文本居中

                tds[colnum].style.color = 'red';  // 表格内的字体颜色
                tds[colnum].style.fontFamily = 'Arial'; // 使用字体
            }

            table.appendChild(tr);
        }

        container.dom.appendChild(table);
}

mugeda.addEventListener("renderready", function(){
    // 当动画准备完成，开始播放前的那一刻引发回调。
    //element:触发行的对象
    //container:容器名称，包含排行榜列表的父级元素
    //projectnum:作品编号，木疙瘩当前作品的编号，地址栏内网址的最后一段数字
    mugeda.defineCallback('showList',function(element, container, projectnum){
        var scene = mugeda.scene;
        var objectcontainer = scene.getObjectByName(container);
        
        //alert(objectcontainer.name);

        //渲染列表
        //page:页号，服务器取数据一页返回十条，按页数返数据
        //容器:包含排行榜列表元素的父节点元素
        //renderList(1, objectcontainer);
        recursiveGetMessage(objectcontainer, 1);  // Trigger the recursive request from page 1.
    })

});

mugeda.addEventListener("renderready", function(){
    // 当动画准备完成，开始播放前的那一刻引发回调。
    //element:触发行的对象
    //para1 参数1，没有使用
    //para2 参数2，没有使用
    mugeda.defineCallback('clearScores',function(element, para1, para2){

        var scene = mugeda.scene;
        var scoreTagArray = ['分数#1', '分数#2', '分数#3', '分数#3', '分数#3', '分数#4', '分数#5', '分数#6', '分数#7', '分数#8', '分数#9', '分数#10'];  //每道题的计分标签
        var questionTitleArray = ['第一题', '第二题', '第三题', '第四题', '第五题', '第六题', '第七题', '第八题', '第九题', '第十题'];  //每道题的题目，用来将上一次做题的输入都清空

        // 这里的代码执行了，但是没有起效，无论是Text=''或是checked=false都不起作用

        // //每道题的计分标签清零(不要让它为''，因为每道题算分时是直接用数据向原有数字加10或0分)
        // for(let i = 0; i < scoreTagArray.length; i++){
        //     scene.getObjectByName(scoreTagArray[0]).text = '0';
        // }

        // //每道题前一次做的选择清除掉，如果不清除重新答题时，还会显示上一次做出的结果
        // for (let i = 0; i< questionTitleArray.length; i++){
        //     scene.getObjectByName(questionTitleArray[0]).text = '';
        // }
    })
});