import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Popover, OverlayTrigger, Pagination, Button} from 'react-bootstrap'

/**
 * 分页工具
 */
class CustomizePagination extends Component{
  static propTypes = {
    totalNum: PropTypes.number.isRequired, //总条目数
    pageNum: PropTypes.number.isRequired, //每页条目数
    changeHandle: PropTypes.func.isRequired, //更改页码回调
  };

  state = {
    currentPageValue: 1, //当前页码
    goInput: '', //跳转输入
  };

  totalPage = 0; //总页数

  //获得分页区间
  getSlice(value) {
    const {pageNum, totalNum} = this.props;
    let [start, end] = [(value-1)*pageNum, value*pageNum];
    end = end > totalNum ? totalNum : end;
    return [start, end]
  }

  updateGoInput = (value) => {
    this.setState({goInput: value.replace(/[^0-9]/, '')})
  };

  numButtonClickHandle = (value) => {
    this.setState({currentPageValue: value});
    this.props.changeHandle(this.getSlice(value))
  };

  moveButtonClickHandle = (moveCommand) => {
    const {currentPageValue} = this.state;
    const totalPage = this.totalPage;
    let value = 0;
    if (moveCommand === 'first') {
      value = 1
    }else if (moveCommand === 'prev') {
      currentPageValue !== 1 && (value = currentPageValue-1)
    }else if (moveCommand === 'next') {
      currentPageValue !== totalPage && (value = currentPageValue+1)
    }else if (moveCommand === 'last') {
      value = totalPage
    }
    if (currentPageValue !== value && value > 0) {
      this.setState({currentPageValue: value});
      this.props.changeHandle(this.getSlice(value));
    }
  };

  goButtonClickHandle = (value) => {
    const {currentPageValue} = this.state;
    const totalPage = this.totalPage;
    const goValue = parseInt(value, 10);
    if (!isNaN(goValue) && goValue !== currentPageValue) {
      const newPageNum = goValue < 1 ? 1 : (goValue > totalPage ? totalPage : goValue);
      this.setState({currentPageValue: newPageNum});
      this.props.changeHandle(this.getSlice(newPageNum));
    }
  };

  render() {
    const {totalNum, pageNum} = this.props;
    const totalPage = this.totalPage = Math.ceil(totalNum / pageNum);

    const {currentPageValue, goInput} = this.state;

    const popoverClickRootClose = (
      <Popover id="popover-trigger-click-root-close" title="跳转">
        <input
          placeholder='请输入跳转页码'
          className='form-control'
          style={{display: 'inline', width: '80%'}}
          value={goInput}
          onChange={(e) => this.updateGoInput(e.target.value)}
        />
        <Button onClick={() => this.goButtonClickHandle(goInput)}>Go</Button>
      </Popover>
    );

    const ellipsis = (key) => (
      <OverlayTrigger
        key={key}
        trigger="click"
        rootClose
        placement="top"
        overlay={popoverClickRootClose}
      >
        <Pagination.Ellipsis/>
      </OverlayTrigger>
    );

    const pageItem = (pv) => (
      <Pagination.Item
        key={pv}
        active={pv === currentPageValue}
        onClick={pv === currentPageValue ? (() => {}) : (() => this.numButtonClickHandle(pv))}
      >{pv}</Pagination.Item>
    );

    return (
      <div style={{textAlign: 'center'}}>
        <Pagination>
          <Pagination.First onClick={() => this.moveButtonClickHandle('first')} />
          <Pagination.Prev onClick={() => this.moveButtonClickHandle('prev')} />
          {
            //不超过5页简单处理
            totalPage <= 5 && (Object.keys(Array(totalPage).fill(true)).map(e => pageItem(parseInt(e, 10)+1)))
          }

          {
            totalPage > 5 && (Object.keys(Array(5).fill(true)).map(e => {
              if (e === '0') {
                return pageItem(1)
              } else if (e === '1') {
                return currentPageValue <= 3 ? pageItem(2) : ellipsis('ellipsisP')
              } else if (e === '2') {
                return currentPageValue <= 3 ? pageItem(3)
                  : (currentPageValue >= totalPage-2 ? pageItem(totalPage-2)
                    : (<Pagination.Item key={currentPageValue} active>{currentPageValue}</Pagination.Item>))
              } else if (e === '3') {
                return currentPageValue >= totalPage-2 ? pageItem(totalPage-1) : ellipsis('ellipsisN')
              } else {
                return pageItem(totalPage)
              }
            }))
          }

          <Pagination.Next onClick={() => this.moveButtonClickHandle('next')} />
          <Pagination.Last onClick={() => this.moveButtonClickHandle('last')} />
        </Pagination>
      </div>
    )
  }
}

export default CustomizePagination;