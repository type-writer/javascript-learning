
var USERDATA_ENDPOINT = 'https://weika.mugeda.com/server/cards.php/userdata/list';

var CRID = '6619efd1312a2541bf0fcce0';

mugeda.addEventListener("renderready", function(){
    // 当动画准备完成，开始播放前的那一刻引发回调。

    var scene = mugeda.scene;   //获取舞台

    //木疙瘩用代码从服务器取数据
    function getMessage(page, callbackfn){
        //Mugine.Utils.Toast.info('Wait Message',{type:'toast'});
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

    //渲染列表，建立一个表格，把信息加进去
    function renderList(page, container){
        
        getMessage(page, function(response){
            var data = response.data;
    
            if(!data) return;
    
            console.log('response的内容如下:');
            console.log('response的类型是:' + typeof(data));
            console.log('response是数组吗:' + Array.isArray(data));
            console.log('行数：' + data.length);
            console.log('列数：' + Object.keys(data[0]).length);
            console.log('第一行第一列单元格内容：'+data[0]['姓名']);
    
            //****************************************
            //把容器里的表格都清理掉
            let tables = container.dom.getElementsByTagName('table');
            while(tables[0]) {
               tables[0].parentNode.removeChild(tables[0]);
            }
            var table = document.createElement('table');

            // 创建表头
            var headers = ['姓名', '单位', '得分', '用时'];
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
                    
                // for(var colnum = 0, i = data[rownum].length; colnum < i; colnum++){
                //     var td = document.createElement("td");
                //     td.innerHTML = data[rownum][colnum];
                //     tr.appendChild(td);
                // }
                // table.appendChild(tr);

                var tdname = document.createElement("td");
                tdname.innerHTML = data[rownum]['姓名'];
                tr.appendChild(tdname);

                var tdunit = document.createElement("td");
                tdunit.innerHTML = data[rownum]['工作单位'];
                tr.appendChild(tdunit);

                var tdscores = document.createElement("td");
                tdscores.innerHTML = data[rownum]['总分'];
                tr.appendChild(tdscores);

                var tdtime = document.createElement("td");
                tdtime.innerHTML = data[rownum]['答题计时标签']+'秒';
                tr.appendChild(tdtime);

                table.appendChild(tr);
            }

            container.dom.appendChild(table);
        });
    }

    mugeda.defineCallback('showList',function(element, container, para2){
        var scene = mugeda.scene;
        var aObject = scene.getObjectByName(container);
        
        alert(aObject.name);

        //renderList(pageIndex, aObject);
        renderList(1, aObject);
    })

});

