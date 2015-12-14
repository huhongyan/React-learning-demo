/**
 * Created by Administrator on 2015/11/6.
 */
"use strict";
var HelloWorld = React.createClass({displayName: "HelloWorld",
    render: function() {
        return (
            React.createElement("p", null, 
                "Hello, ", React.createElement("input", {type: "text", placeholder: "Your name here"}), "!" + ' ' +
                "It is ", this.props.date.toTimeString(), 
                React.createElement("div", null, "First . Second")
            )
        );
    }
});
setInterval(function() {
    React.render(
        React.createElement(HelloWorld, {date: new Date()}),
        document.getElementById('example')
    );
}, 500);