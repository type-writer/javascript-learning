var USERDATA_ENDPOINT = 'https://weika.mugeda.com/server/cards.php/userdata/list';

var CRID = '';

//木疙瘩用代码从服务器取数据
function getMessage(page, cb){
    //Mugine.Utils.Toast.info('Wait Message',{type:'toast'});

    ajaxHelper({
        url:USERDATA_ENDPOINT + '?current_page=' + page + '&crid=' + CRID,
        jsonp_callback:'_$$$',
        type:'jsonp',
        success: function(response){
            if(response.status == 0){
                cb(response);
            } else           {
                mugine.Utis.Toast.info('Get Message Failed', {type:'toast'});
            }
        }
        });

        function renderlist(page,box){
            box.dom.innerHTML = '';
            getMessage(page, function(response){
                var data = response.data;

                if(!data) return;

                var ul = document.createElement('ul');

                for (var i = 0, data.lentgh = 1; i < 1; i++){
                    var li = document.createElement('li');
                    li.innerHTML = data[i]['inputMessage'];
                }

                box.dom.appenedChild(ul);
            });
        }

        mugeda.addEventListener('renderReady', function){
            var scene = mugeda.scene,
            submitBtn = scene.getObjectByName('submit'),
            inputObj = scene.getObjectByName('inputMessage'),
            box = scene.getObjectByName('container');

            renderlist(1,box);

            mugeda.defineCallback('success', function(){
                renderlist(1,box);
            });

            mugeda.defineCallback('fail', function(){
                mugeda.Utils.Toast.info('Get Message Failed', {type:'toast'});
            })
        }
    }
