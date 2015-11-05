/**
 * Created by Administrator on 2015/11/4.
 */

/**
 *  评论框
 */
var CommentBox = React.createClass({displayName: "CommentBox",
    loadCommentsFromServer: function() {
        // 由于没有后台服务器，这里使用 indexedDB
        var request = indexedDB.open("ReactDemo", "1.0"),
            _self = this,
            databaseName = _self.props.url;
        request.onerror = function(evt){
            console.error("Something bad happened while trying to open : " + evt.target.error.message);
        };
        request.onsuccess = function(evt){
            var database = evt.target.result;
            if (database.objectStoreNames.contains(databaseName)) {
                try {
                    var transaction = database.transaction(databaseName, 'readwrite');
                    var store = transaction.objectStore(databaseName);
                    var result = store.openCursor();
                    var array = [];
                    result.onsuccess = function (e) {
                        var cursor = e.target.result;
                        if(cursor){
                            var data = cursor.value;
                            array.push(data);
                            cursor.continue();
                        }else{
                            // 更新 this.state 会致使 UI 更新
                            _self.setState({data: array});
                        }
                    };
                }catch(e){
                    console.error(e);
                }
            }
        };
    },
    // 用于传递给子组件的回调函数
    handleCommentSubmit: function(comment) {
        // 提前更新UI
        var comments = this.state.data;
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});

        // 由于没有后台服务器，这里使用浏览器的indexedDB 保存数据
        var request = indexedDB.open("ReactDemo", "1.0"),
            databaseName = this.props.url;
        request.onerror = function(evt){
            console.error("Something bad happened while trying to open : " + evt.target.error.message);
        };
        request.onsuccess = function(evt){
            var database = evt.target.result;
            database.onversionchange = function(){
                database.close();
            };
            if(database.objectStoreNames.contains(databaseName)) {
                try{
                    var transaction = database.transaction(databaseName,'readwrite');
                    var store = transaction.objectStore(databaseName);
                    store.add(comment);
                }catch(e){
                    console.error(e);
                }
            }
        };
    },
    // 在组件的生命周期中仅执行一次，用于设置组件的初始化 state
    // this.state 是组件的私有变量
    getInitialState: function() {
        return {data: []};
    },
    // 在组件渲染的时候被 React 自动调用的方法
    componentDidMount: function() {
        this.loadCommentsFromServer();
        // 实现一个简单的轮询
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            React.createElement("div", {className: "commentBox"}, 
                React.createElement("h1", null, "Comments"), 
                React.createElement(CommentList, {data: this.state.data}), 
                React.createElement(CommentForm, {onCommentSubmit: this.handleCommentSubmit})
            )
        );
    }
});
/**
 *  评论列表
 */
var CommentList = React.createClass({displayName: "CommentList",
    render: function() {
        var commentNodes = this.props.data.map(function(comment){
            return (
                React.createElement(Comment, {author: comment.author}, 
                    comment.text
                )
            );
        });
        return (
            React.createElement("div", {className: "commentList"}, 
                commentNodes
            )
        );
    }
});
/**
 *  一列评论
 */
var Comment = React.createClass({displayName: "Comment",
    rawMarkup: function() {
        // sanitize: true ，告诉 marked 转义掉评论文本中的 HTML 标签而不是直接原封不动地返回这些标签。
        var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
        return { __html: rawMarkup };
    },
    render: function() {
        return (
            React.createElement("div", {className: "comment"}, 
                React.createElement("h2", {className: "commentAuthor"}, 
                    this.props.author
                ), 
                React.createElement("span", {dangerouslySetInnerHTML: this.rawMarkup()})
            )
        );
    }
});
/**
 *  评论表单
 */
var CommentForm = React.createClass({displayName: "CommentForm",
    handleSubmit: function(e) {
        // 避免浏览器默认地提交表单
        e.preventDefault();
        // 利用 ref 属性给子组件命名，通过 this.refs 引用 DOM 节点
        var author = this.refs.author.value.trim();
        var text = this.refs.text.value.trim();
        if (!text || !author) {
            return;
        }
        // 调用父组件传来的回调函数(将数据传给了父组件)
        this.props.onCommentSubmit({author: author, text: text});
        this.refs.author.value = '';
        this.refs.text.value = '';
        return;
    },
    render: function() {
        return (
            React.createElement("form", {className: "commentForm", onSubmit: this.handleSubmit}, 
                React.createElement("h2", null, "Please fill in the comments."), 
                React.createElement("input", {className: "commentForm-author", type: "text", placeholder: "Your name", ref: "author"}), 
                React.createElement("textarea", {className: "commentForm-text", placeholder: "Say something...", ref: "text"}), 
                React.createElement("input", {className: "commentForm-submit", type: "submit", value: "Post"})
            )
        );
    }
});

ReactDOM.render(
    React.createElement(CommentBox, {url: "comment", pollInterval: 2000}),
    document.getElementById('example')
);