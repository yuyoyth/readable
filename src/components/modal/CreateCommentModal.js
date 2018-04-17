import React, {Component} from 'react'
import BaseModal from './BaseModal'
import {FormGroup, ControlLabel, FormControl, Label} from 'react-bootstrap'
import {editName} from "../../actions/UserNameAction";
import {addComment} from '../../actions/CommentActions'
import {completeAddComment} from "../../actions/PostActions";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {generateUUID} from "../../utils/tools";
import escapeRegExp from "escape-string-regexp";
import {addComment as addCommentAPI} from "../../utils/api";

class CreateCommentModal extends Component{
  static propTypes = {
    open: PropTypes.bool.isRequired,
    postId: PropTypes.string.isRequired,
    closeHandle: PropTypes.func.isRequired
  };

  state = {
    bodyInput: '',
    userNameInput: '',
    warringLabelDisplay: false,
    warringInfo: '',
    fetching: false,
    errLabelDisplay: false,
  };

  constructor(props) {
    super(props);
    this.state.userNameInput = this.props.userName;
  }

  closeHandle = (submit) => {
    let newState = {};
    if (submit) {
      newState.bodyInput = '';
    }else {
      newState.userNameInput = this.props.userName;
    }
    newState.warringLabelDisplay = false;
    newState.errLabelDisplay = false;
    newState.fetching = false;
    this.setState(newState);
    this.props.closeHandle();
  };

  warringInfoArr = [
    '请输入内容',
    '内容长度不能超过1000个字符',
    '请输入创建者名称',
    '创建者名称不能超过16个字符',
  ];

  submitHandle = (body, author, parentId) => {
    let newState = {warringLabelDisplay: true};
    if (body === '') {
      newState.warringInfo = this.warringInfoArr[0]
    }else if (body.length > 1000) {
      newState.warringInfo = this.warringInfoArr[1]
    }else if (author === '') {
      newState.warringInfo = this.warringInfoArr[2]
    }else if (author.length > 16) {
      newState.warringInfo = this.warringInfoArr[3]
    }else {
      newState.warringLabelDisplay = false;
    }

    if (newState.warringLabelDisplay) {
      this.setState(newState)
    }else {
      const [id, timestamp] = [generateUUID(), Date.now()];
      body = escapeRegExp(body);
      author = escapeRegExp(author);

      this.setState({fetching: true});
      addCommentAPI({id, timestamp, body, author, parentId}).then(re => {
        this.setState({fetching: false});
        this.props.editName(author);
        this.props.addComment({id, timestamp, body, author, parentId});
        this.props.completeAddComment(parentId);
        this.closeHandle(true)
      }).catch(err => {
        this.setState({fetching: false, errLabelDisplay: true});
      });
    }
  };

  render() {
    const {open, postId, posts} = this.props;
    const {bodyInput, userNameInput, warringLabelDisplay, warringInfo, fetching, errLabelDisplay} = this.state;
    const post = posts[postId];

    const body = (
      <div>
        <form>
          <FormGroup controlId="bodyFormControl">
            <ControlLabel>内容</ControlLabel>
            <FormControl componentClass="textarea"
                         style={{height: '120px'}}
                         value={bodyInput}
                         onChange={(e) => this.setState({bodyInput: e.target.value})}/>
          </FormGroup>

          <FormGroup controlId='authorFormControl'>
            <ControlLabel>创建者</ControlLabel>
            <FormControl value={userNameInput}
                         onChange={(e) => this.setState({userNameInput: e.target.value})}/>
          </FormGroup>

          <FormGroup controlId="categoryFormControl">
            <ControlLabel>回复帖子</ControlLabel>
            <FormControl value={post ? post.title : ''} disabled/>
          </FormGroup>
        </form>

        <Label style={{display: warringLabelDisplay ? 'block' : 'none'}} bsStyle="warning">{warringInfo}</Label>
        <Label style={{display: errLabelDisplay ? 'block' : 'none'}} bsStyle="danger">服务器访问失败</Label>
      </div>
    );

    return (
      <BaseModal open={open}
                 title='回复帖子'
                 body={body}
                 closeHandle={() => this.closeHandle(false)}
                 submitButton={true}
                 submitName='回复'
                 submitHandle={() => this.submitHandle(bodyInput, userNameInput, postId)}
                 asyncFetch={fetching}/>
    )
  }
}

function mapStateToProps({userName, post}) {
  return {
    userName,
    posts: {...post.posts}
  }
}

function mapDispatchToProps(dispatch) {
  return {
    editName: data => dispatch(editName(data)),
    addComment: data => dispatch(addComment(data)),
    completeAddComment: data => dispatch(completeAddComment(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateCommentModal);