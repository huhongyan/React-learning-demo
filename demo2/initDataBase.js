/**
 * Created by Administrator on 2015/11/5.
 */
//indexedDB.deleteDatabase("ReactDemo");
(function(){
    // 初始化数据
    var request, database;

    request = indexedDB.open("ReactDemo");
    request.onerror = function(evt){
        console.error("Something bad happened while trying to open : " + evt.target.error.message);
    };
    request.onsuccess = function(evt){
        database = evt.target.result;

        if(database.version != "1.0"){
            request = database.setVersion("1.0");
            request.onerror = function(evt){
                console.error("Something bad happened while trying to set version : " + evt.target.errorCode);
            };
            request.onsuccess = function(evt){
                console.log("Database initialization complete. Database name : " + database.name + ", Version : " + database.version);
            };
        }else{
            console.log("Database initialized. Database name : " + database.name + ", Version : " + database.version);
        }
    };
    // 请求数据库版本变化句柄
    request.onupgradeneeded = function(evt){
        database = evt.target.result;

        // 对新数据的操作都需要在transaction中进行
        // 而transaction又要求制定object store
        // 所以我们只能在创建数据库的时候初始化object store以供后面使用
        if(!database.objectStoreNames.contains('comment')) {
            var store = database.createObjectStore("comment", {autoIncrement: true});
            store.add({author: "Pete Hunt", text: "This is one comment"});
            // error success 验证这里省略了
        }
        //database.close();
    }

})();

