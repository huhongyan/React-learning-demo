"use strict";

var LikeButton = React.createClass({
    getInitialState: function() {
        return {liked: false};
    },
    // 事件处理器
    handleClick: function(event) {
        this.setState({liked: !this.state.liked});
    },
    render: function() {
        var text = this.state.liked ? 'like' : 'haven\'t liked';
        return (
            <p onClick={this.handleClick}>
                You {text} this. Click to toggle.
            </p>
        );
    }
});

React.render(
    <LikeButton />,
    document.getElementById('example')
);