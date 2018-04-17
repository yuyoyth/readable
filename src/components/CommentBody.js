import React, {Component} from 'react'
import PropTypes from "prop-types";
import {Button, Col, Row} from 'react-bootstrap'
import {FaThumbsODown, FaThumbsOUp, FaTimesCircleO} from 'react-icons/lib/fa'
import {formatTimestamp} from "../utils/tools";
import {connect} from "react-redux";
import {votePost} from '../actions/PostActions'
import {voteComment} from '../actions/CommentActions'
import {votePost as votePostAPI, voteComment as voteCommentAPI} from '../utils/api'

//展示内容所属类型
export const TypeEnum = {POST: 1, COMMENT: 2};
//投票类型
export const VoteEnum = {DOWN: 0, UP: 1};

class CommentBody extends Component{
  static propTypes = {
    type: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    floor: PropTypes.number.isRequired,
    editButtonClickHandle: PropTypes.func.isRequired, //编辑按钮点击回调
    deleteButtonClickHandle: PropTypes.func.isRequired, //删除按钮点击回调
  };

  /**
   * 投票按钮点击回调
   * @param type 操作的类型
   * @param id 帖子或评论id
   * @param vote 投票操作
   */
  voteButtonClick = (type, id, vote) => {
    if (type === TypeEnum.POST) {
      votePostAPI(id, vote === VoteEnum.UP).then(re => {
        this.props.votePost({id, option: vote === VoteEnum.UP})
      })
    }else if (type === TypeEnum.COMMENT) {
      voteCommentAPI(id, vote === VoteEnum.UP).then(re => {
        this.props.voteComment({id, option: vote === VoteEnum.UP})
      })
    }
  };

  render() {
    const {type, id, floor, posts, comments} = this.props;
    const {editButtonClickHandle, deleteButtonClickHandle} = this.props;

    let ele = undefined;
    if (type === TypeEnum.POST) {
      ele = posts[id]
    }else if (type === TypeEnum.COMMENT) {
      ele = comments[id]
    }

    return (
      <Row>
        <Col xs={2} md={2}>
          <div style={{padding: '10px 10px 5px 20px'}}>
            <p>{ele && ele.author}</p>
          </div>
        </Col>
        <Col xs={10} md={10}>
          <div style={{borderBottom: '1px solid #ddd', padding: '10px 15px 10px 15px'}}>
            <Button bsStyle='link' style={{padding: 0, margin: '0 0 0 15px'}}
                    onClick={() => this.voteButtonClick(type, id, VoteEnum.UP)}
            ><FaThumbsOUp/></Button>
            <span style={{color: '#337ab7', margin: '0 0 0 3px'}}>{ele && ele.voteScore}</span>
            <Button bsStyle='link' style={{padding: 0, margin: '0 0 0 15px'}}
                    onClick={() => this.voteButtonClick(type, id, VoteEnum.DOWN)}
            ><FaThumbsODown/></Button>
            <span style={{color: '#337ab7', float: 'right'}}>
              <Button bsStyle='link' style={{padding: 0, margin: '0 15px 0 0'}} onClick={() => editButtonClickHandle(type, id)}>编辑</Button>
              <span style={{padding: 0, margin: '0 15px 0 0'}}>#{floor}</span>
              <span className='delete-btn' onClick={() => deleteButtonClickHandle(type, id)}><FaTimesCircleO size={22}/></span>
            </span>
          </div>
          <div style={{padding: '10px 15px 10px 15px'}}>
            <p style={{textAlign: 'right', marginBottom: '15px'}}>{ele && formatTimestamp(ele.timestamp)}</p>
            <p>{ele && ele.body}</p>
          </div>
        </Col>
      </Row>
    )
  }
}

function mapStateToProps({post, comment}) {
  return {
    posts: {...post.posts},
    comments: {...comment.comments}
  }
}

function mapDispatchToProps(dispatch) {
  return {
    votePost: data => dispatch(votePost(data)),
    voteComment: data => dispatch(voteComment(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentBody);