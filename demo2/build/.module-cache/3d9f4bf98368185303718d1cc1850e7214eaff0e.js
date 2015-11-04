/**
 * Created by Administrator on 2015/11/4.
 */
var CommentBox = React.createClass({displayName: "CommentBox",
    render: function() {
        return (
            React.createElement("div", {className: "commentBox"}, 
                "Hello, world! I am a CommentBox."
            )
        );
    }
});
React.render(
    React.createElement(CommentBox, null),
    document.getElementById('content')
);