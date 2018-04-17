import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Button} from 'react-bootstrap'
import {FaSort, FaSortAmountAsc, FaSortAmountDesc} from 'react-icons/lib/fa'
import {sortStateEnum} from "./TitleList";

class PostPageSortTool extends Component{
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
    }else {
      sortState === sortStateEnum.DATE_DESC && (newSortState = sortStateEnum.DATE_ASC);
      sortState === sortStateEnum.DATE_ASC && (newSortState = sortStateEnum.DATE_DESC);
    }
    this.setState({sortState: newSortState});
    this.props.sortChangeHandle(newSortState);
  };

  voteSortClick = () => {
    const {sortState} = this.state;
    let newSortState = sortStateEnum.VOTE_DESC;
    if (sortState < 2) {
      newSortState = sortStateEnum.VOTE_DESC;
    }else {
      sortState === sortStateEnum.VOTE_DESC && (newSortState = sortStateEnum.VOTE_ASC);
      sortState === sortStateEnum.VOTE_ASC && (newSortState = sortStateEnum.VOTE_DESC);
    }
    this.setState({sortState: newSortState});
    this.props.sortChangeHandle(newSortState);
  };

  render() {
    const {sortState} = this.state;

    return (
      <span>
        <Button bsStyle='link' onClick={this.voteSortClick}>
          {(() => {
            if (sortState === sortStateEnum.VOTE_ASC) {
              return (<FaSortAmountAsc/>)
            }else if (sortState === sortStateEnum.VOTE_DESC) {
              return (<FaSortAmountDesc/>)
            }else {
              return (<FaSort/>)
            }
          })()}
          得票
        </Button>
        <Button bsStyle='link' onClick={this.dateSortClick}>
          {(() => {
            if (sortState === sortStateEnum.DATE_ASC) {
              return (<FaSortAmountAsc/>)
            }else if (sortState === sortStateEnum.DATE_DESC) {
              return (<FaSortAmountDesc/>)
            }else {
              return (<FaSort/>)
            }
          })()}
          时间
        </Button>
      </span>
    )
  }
}

export default PostPageSortTool;