import React, {Component} from 'react'
import BaseModal from "./BaseModal";
import {FormGroup, ControlLabel, FormControl, Label} from 'react-bootstrap'
import PropTypes from "prop-types";
import {deletePost} from "../../actions/PostActions";
import {connect} from "react-redux";
import {deletePost as deletePostAPI} from "../../utils/api";

class DeletePostModal extends Component{
  static propTypes = {
    postId: PropTypes.string.isRequired,
    closeHandle: PropTypes.func.isRequired
  };

  state = {
    fetching: false,
  };

  closeHandle = (submit) => {
    this.setState({fetching: false});
    this.props.closeHandle(submit);
  };

  submitHandle = (id) => {
    let newState = {};
    this.setState({fetching: true});
    deletePostAPI(id).then(re => {
      this.setState({fetching: false});
      this.props.deletePost(id);
      this.closeHandle(true)
    }).catch(err => {
      this.setState({fetching: false});
    });
  };

  render() {
    const {posts, postId} = this.props;
    const {fetching} = this.state;
    const post = posts[postId];

    const body = (
      <div>
        <form>
          <FormGroup controlId='titleFormControl'>
            <ControlLabel>标题</ControlLabel>
            <FormControl value={post ? post.title : ''} disabled/>
          </FormGroup>

          <FormGroup controlId="bodyFormControl">
            <ControlLabel>内容</ControlLabel>
            <FormControl componentClass="textarea"
                         style={{height: '120px'}}
                         value={post ? post.body : ''} disabled/>
          </FormGroup>

          <FormGroup controlId='authorFormControl'>
            <ControlLabel>创建者</ControlLabel>
            <FormControl value={post ? post.author : ''} disabled/>
          </FormGroup>

          <FormGroup controlId="categoryFormControl">
            <ControlLabel>类别</ControlLabel>
            <FormControl value={post ? post.category: ''} disabled/>
          </FormGroup>
        </form>

        <Label style={{display: 'block'}} bsStyle="danger">删除后将无法恢复</Label>
      </div>
    );

    return (
      <BaseModal open={true}
                 title='确认删除？'
                 body={body}
                 closeHandle={() => this.closeHandle(false)}
                 submitButton={true}
                 submitName='删除'
                 submitType='danger'
                 submitHandle={() => this.submitHandle(postId)}
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
    deletePost: (data) => dispatch(deletePost(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeletePostModal);