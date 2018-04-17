import React, {Component} from 'react'
import BaseModal from "./BaseModal";
import {FormGroup, ControlLabel, FormControl, Label} from 'react-bootstrap'
import PropTypes from "prop-types";
import {editPost} from "../../actions/PostActions";
import {connect} from "react-redux";
import escapeRegExp from "escape-string-regexp";
import {editPost as editPostAPI} from "../../utils/api";

class EditPostModal extends Component{
  static propTypes = {
    postId: PropTypes.string.isRequired,
    closeHandle: PropTypes.func.isRequired
  };

  state = {
    titleInput: '',
    bodyInput: '',
    warringLabelDisplay: false,
    warringInfo: '',
    fetching: false,
    errLabelDisplay: false,
  };

  constructor(props) {
    super(props);
    const {posts, postId} = this.props;
    const post = posts[postId];
    this.state.titleInput = post.title;
    this.state.bodyInput = post.body;
  }

  closeHandle = (submit) => {
    let newState = {};
    if (submit) {
      newState.titleInput = '';
      newState.bodyInput = '';
    }
    newState.warringLabelDisplay = false;
    newState.errLabelDisplay = false;
    newState.fetching = false;
    this.setState(newState);
    this.props.closeHandle();
  };

  warringInfoArr = [
    '请输入标题',
    '标题长度不能超过100个字符',
    '请输入内容',
    '内容长度不能超过1000个字符',
  ];

  submitHandle = (id, title, body) => {
    let newState = {warringLabelDisplay: true};
    if (title === '') {
      newState.warringInfo = this.warringInfoArr[0]
    }else if (title.length > 100) {
      newState.warringInfo = this.warringInfoArr[1]
    }else if (body === '') {
      newState.warringInfo = this.warringInfoArr[2]
    }else if (body.length > 1000) {
      newState.warringInfo = this.warringInfoArr[3]
    }else {
      newState.warringLabelDisplay = false;
    }

    if (newState.warringLabelDisplay) {
      this.setState(newState)
    }else {
      title = escapeRegExp(title);
      body = escapeRegExp(body);

      this.setState({fetching: true});
      editPostAPI(id, {title, body}).then(re => {
        this.setState({fetching: false});
        this.props.editPost({id, title, body});
        this.closeHandle(true)
      }).catch(err => {
        this.setState({fetching: false, errLabelDisplay: true});
      });
    }
  };

  render() {
    const {posts, postId} = this.props;
    const {titleInput, bodyInput, warringLabelDisplay, warringInfo, fetching, errLabelDisplay} = this.state;
    const post = posts[postId];

    const body = (
      <div>
        <form>
          <FormGroup controlId='titleFormControl'>
            <ControlLabel>标题</ControlLabel>
            <FormControl placeholder='标题'
                         value={titleInput}
                         onChange={(e) => this.setState({titleInput: e.target.value})} />
          </FormGroup>

          <FormGroup controlId="bodyFormControl">
            <ControlLabel>内容</ControlLabel>
            <FormControl componentClass="textarea"
                         style={{height: '120px'}}
                         value={bodyInput}
                         onChange={(e) => this.setState({bodyInput: e.target.value})}/>
          </FormGroup>

          <FormGroup controlId='authorFormControl'>
            <ControlLabel>创建者</ControlLabel>
            <FormControl value={post.author} disabled/>
          </FormGroup>

          <FormGroup controlId="categoryFormControl">
            <ControlLabel>类别</ControlLabel>
            <FormControl value={post.category} disabled/>
          </FormGroup>
        </form>

        <Label style={{display: warringLabelDisplay ? 'block' : 'none'}} bsStyle="warning">{warringInfo}</Label>
        <Label style={{display: errLabelDisplay ? 'block' : 'none'}} bsStyle="danger">服务器访问失败</Label>
      </div>
    );

    return (
      <BaseModal open={true}
                 title='编辑帖子'
                 body={body}
                 closeHandle={() => this.closeHandle(false)}
                 submitButton={true}
                 submitName='更新'
                 submitHandle={() => this.submitHandle(postId, titleInput, bodyInput)}
                 asyncFetch={fetching}/>
    )
  }
}

function mapStateToProps({post}) {
  return {
    posts: {...post.posts}
  }
}

function mapDispatchToProps(dispatch) {
  return {
    editPost: (data) => dispatch(editPost(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPostModal);