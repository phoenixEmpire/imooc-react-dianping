import React, { Component } from "react";
import LikeItem from "../LikeItem";
import Loading from "../../../../components/Loading";
import "./style.css";

class LikeList extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.removeListener = false;
  }

  render() {
    const { data, pageCount } = this.props;
    return (
      <div ref={this.myRef} className="likeList">
        <div className="likeList__header">猜你喜欢</div>
        <div className="likeList__list">
          {data.map((item, index) => {
            return <LikeItem key={index} data={item} />;
          })}
        </div>
        {pageCount < 3 ? (
          <Loading />
        ) : (
          <a className="likeList__viewAll">查看更多</a>
        )}
      </div>
    );
  }

  componentDidMount() {
    // 以前未查询完
    if (this.props.pageCount < 3) {
      document.addEventListener("scroll", this.handleScroll);
    }
    // 以前已查询完
    else {
      this.removeListener = true;
    }
    // 以前未查询过
    if (this.props.pageCount === 0) {
      this.props.fetchData();
    }
  }

  componentDidUpdate() {
    if (this.props.pageCount >= 3 && !this.removeListener) {
      document.removeEventListener("scroll", this.handleScroll);
      this.removeListener = true;
    }
  }

  componentWillUnmount() {
    if (!this.removeListener) {
      document.removeEventListener("scroll", this.handleScroll);
    }
  }

  // 处理屏幕滚动事件，实现加载更多的效果
  handleScroll = () => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop; // 滚动距离
    const screenHeight = document.documentElement.clientHeight; // 屏幕高度
    const likeListTop = this.myRef.current.offsetTop; // 猜你喜欢的顶部位置
    const likeListHeight = this.myRef.current.offsetHeight; // 猜你喜欢的高度

    if (scrollTop >= likeListHeight + likeListTop - screenHeight) {
      this.props.fetchData();
    }
  };
}

export default LikeList;
