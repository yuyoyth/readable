import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import {Button} from 'react-bootstrap'
import {FaSort, FaSortAmountAsc, FaSortAmountDesc} from 'react-icons/lib/fa'
import {sortStateEnum} from "./TitleList";

/**
 * 帖子详情页的排序工具
 */
class PostPageSortTool extends Component {
  static propTypes = {
    sortChangeHandle: PropTypes.func.isRequired
  };

  state = {
    sortState: sortStateEnum.VOTE_DESC,
  };

  dateSortClick = () => {
    const {sortState} = this.state;
    let newSortState = sortStateEnum.DATE_DESC;
    if (sortState > 1) {
      newSortState = sortStateEnum.DATE_DESC;
    } else {
      newSortState = sortState === sortStateEnum.DATE_DESC ? sortStateEnum.DATE_ASC : sortStateEnum.DATE_DESC
    }
    this.setState({sortState: newSortState});
    this.props.sortChangeHandle(newSortState);
  };

  voteSortClick = () => {
    const {sortState} = this.state;
    let newSortState = sortStateEnum.VOTE_DESC;
    if (sortState < 2) {
      newSortState = sortStateEnum.VOTE_DESC;
    } else {
      newSortState = sortState === sortStateEnum.VOTE_DESC ? sortStateEnum.VOTE_ASC : sortStateEnum.VOTE_DESC
    }
    this.setState({sortState: newSortState});
    this.props.sortChangeHandle(newSortState);
  };

  render() {
    const {sortState} = this.state;

    return (
      <Fragment>
        <Button bsStyle='link' onClick={this.voteSortClick}>
          {(() => {
            if (sortState === sortStateEnum.VOTE_ASC) {
              return (<FaSortAmountAsc/>)
            } else if (sortState === sortStateEnum.VOTE_DESC) {
              return (<FaSortAmountDesc/>)
            } else {
              return (<FaSort/>)
            }
          })()}
          得票
        </Button>
        <Button bsStyle='link' onClick={this.dateSortClick}>
          {(() => {
            if (sortState === sortStateEnum.DATE_ASC) {
              return (<FaSortAmountAsc/>)
            } else if (sortState === sortStateEnum.DATE_DESC) {
              return (<FaSortAmountDesc/>)
            } else {
              return (<FaSort/>)
            }
          })()}
          时间
        </Button>
      </Fragment>
    )
  }
}

export default PostPageSortTool;