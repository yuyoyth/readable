import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Table} from 'react-bootstrap'
import {FaSort, FaSortAmountAsc, FaSortAmountDesc} from "react-icons/lib/fa/index"
import {formatTimestamp} from "../utils/tools";
import {Link} from 'react-router-dom'

//排序状态
export const sortStateEnum = {
  DATE_ASC: 0,
  DATE_DESC: 1,
  VOTE_ASC: 2,
  VOTE_DESC: 3,
};

/**
 * 展示帖子标题的列表
 */
class TitleList extends Component {
  static propTypes = {
    posts: PropTypes.array.isRequired,
    displayCategory: PropTypes.bool, //是否展示类别列
    sortChangeHandle: PropTypes.func.isRequired
  };

  state = {
    sortState: sortStateEnum.VOTE_DESC,  //默认得票数从大到小排序
  };

  //点击时间排序回调
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

  //点击得票排序回调
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
    const {posts, displayCategory} = this.props;

    return (
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
              } else if (sortState === sortStateEnum.DATE_DESC) {
                return (<FaSortAmountDesc/>)
              } else {
                return (<FaSort/>)
              }
            })()}
          </th>
          <th className='text-center' style={{minWidth: '70px'}}>回复</th>
          <th className='text-center sort-btn' style={{minWidth: '70px'}} onClick={this.voteSortClick}>得票
            {(() => {
              if (sortState === sortStateEnum.VOTE_ASC) {
                return (<FaSortAmountAsc/>)
              } else if (sortState === sortStateEnum.VOTE_DESC) {
                return (<FaSortAmountDesc/>)
              } else {
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
              <td><Link key={'link-' + e.id} to={'/' + e.category + '/' + e.id}>{e.title}</Link></td>
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
    )
  }
}

export default TitleList;