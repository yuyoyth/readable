import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Table} from 'react-bootstrap'
import {FaSort, FaSortAmountAsc, FaSortAmountDesc} from "react-icons/lib/fa/index"
import {formatTimestamp} from "../utils/tools";
import {Link} from 'react-router-dom'

export const sortStateEnum = {
  DATE_ASC: 0,
  DATE_DESC: 1,
  VOTE_ASC: 2,
  VOTE_DESC: 3,
};

class TitleList extends Component{
  static propTypes = {
    posts: PropTypes.array.isRequired,
    displayCategory: PropTypes.bool,
    sortChangeHandle: PropTypes.func.isRequired
  };

  state = {
    sortState: sortStateEnum.VOTE_DESC
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
    const {posts, displayCategory} = this.props;

    return (
      <div>
        <Table responsive>
          <thead>
          <tr>
            <th className='text-center'>标题</th>
            <th className='text-center' style={{minWidth: '150px'}}>作者</th>
            {displayCategory && <th className='text-center' style={{minWidth: '100px'}}>类别</th>}
            <th className='text-center sort-btn' style={{minWidth: '100px'}} onClick={this.dateSortClick}>日期
              {(() => {
                if (sortState === sortStateEnum.DATE_ASC) {
                  return (<FaSortAmountAsc/>)
                }else if (sortState === sortStateEnum.DATE_DESC) {
                  return (<FaSortAmountDesc/>)
                }else {
                  return (<FaSort/>)
                }
              })()}
            </th>
            <th className='text-center' style={{minWidth: '70px'}}>回复</th>
            <th className='text-center sort-btn' style={{minWidth: '70px'}} onClick={this.voteSortClick}>得票
              {(() => {
                if (sortState === sortStateEnum.VOTE_ASC) {
                  return (<FaSortAmountAsc/>)
                }else if (sortState === sortStateEnum.VOTE_DESC) {
                  return (<FaSortAmountDesc/>)
                }else {
                  return (<FaSort/>)
                }
              })()}
            </th>
          </tr>
          </thead>
          <tbody>
          {
            posts.map(e => (
              <tr key={e.id}>
                <td><Link key={'link-'+e.id} to={'/'+e.category+'/'+e.id}>{e.title}</Link></td>
                <td className='text-center'>{e.author}</td>
                {displayCategory && <td className='text-center'>{e.category}</td>}
                <td className='text-center'>{formatTimestamp(e.timestamp, 'yyyy-MM-dd')}</td>
                <td className='text-center'>{e.commentCount}</td>
                <td className='text-center'>{e.voteScore}</td>
              </tr>
            ))
          }
          </tbody>
        </Table>
      </div>
    )
  }
}

export default TitleList;