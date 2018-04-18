import React, {Component, Fragment} from 'react'
import BaseModal from "./BaseModal";
import {FormGroup, ControlLabel, FormControl, Label} from 'react-bootstrap'
import {connect} from "react-redux";
import {deleteComment} from '../../actions/CommentActions'
import {completeDeleteComment} from '../../actions/PostActions'
import {deleteComment as deleteCommentAPI} from "../../utils/api";
import PropTypes from "prop-types";

/**
 * 删除评论modal
 */
class DeleteCommentModal extends Component {
  static propTypes = {
    commentId: PropTypes.string.isRequired,
    closeHandle: PropTypes.func.isRequired
  };

  state = {
    fetching: false,
  };

  closeHandle = () => {
    this.setState({fetching: false});
    this.props.closeHandle();
  };

  submitHandle = (id, parentId) => {
    this.setState({fetching: true});
    deleteCommentAPI(id).then(re => {
      this.setState({fetching: false});
      this.props.deleteComment(id);
      this.props.completeDeleteComment(parentId);
      this.closeHandle()
    }).catch(err => {
      this.setState({fetching: false});
    });
  };

  render() {
    const {commentId, posts, comments} = this.props;
    const {fetching} = this.state;
    const comment = comments[commentId];
    const post = comment ? posts[comment.parentId] : undefined;

    const body = (
      <Fragment>
        <form>
          <FormGroup controlId="bodyFormControl">
            <ControlLabel>内容</ControlLabel>
            <FormControl componentClass="textarea"
                         style={{height: '120px'}}
                         value={comment ? comment.body : ''} disabled/>
          </FormGroup>

          <FormGroup controlId='authorFormControl'>
            <ControlLabel>创建者</ControlLabel>
            <FormControl value={comment ? comment.author : ''} disabled/>
          </FormGroup>

          <FormGroup controlId="categoryFormControl">
            <ControlLabel>回复帖子</ControlLabel>
            <FormControl value={post ? post.title : ''} disabled/>
          </FormGroup>
        </form>

        <Label style={{display: 'block'}} bsStyle="danger">删除后将无法恢复</Label>
      </Fragment>
    );

    return (
      <BaseModal open={true}
                 title='确认删除？'
                 body={body}
                 closeHandle={() => this.closeHandle(false)}
                 submitButton={true}
                 submitName='删除'
                 submitType='danger'
                 submitHandle={() => this.submitHandle(commentId, comment.parentId)}
                 asyncFetch={fetching}/>
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
    deleteComment: (data) => dispatch(deleteComment(data)),
    completeDeleteComment: (data) => dispatch(completeDeleteComment(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteCommentModal);