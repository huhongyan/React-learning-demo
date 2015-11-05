/**
 * Created by Administrator on 2015/11/5.
 */
//indexedDB.deleteDatabase("ReactDemo");
(function(){
    // ��ʼ������
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
    // �������ݿ�汾�仯���
    request.onupgradeneeded = function(evt){
        database = evt.target.result;

        // �������ݵĲ�������Ҫ��transaction�н���
        // ��transaction��Ҫ���ƶ�object store
        // ��������ֻ���ڴ������ݿ��ʱ���ʼ��object store�Թ�����ʹ��
        if(!database.objectStoreNames.contains('comment')) {
            var store = database.createObjectStore("comment", {autoIncrement: true});
            store.add({author: "Pete Hunt", text: "This is one comment"});
            // error success ��֤����ʡ����
        }
        //database.close();
    }

})();

