import React, {Component} from 'react'
import BaseModal from './BaseModal'
import {FormGroup, ControlLabel, FormControl, Label} from 'react-bootstrap'
import {editComment} from '../../actions/CommentActions'
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {editComment as editCommentAPI} from "../../utils/api";

/**
 * 编辑评论modal
 */
class EditCommentModal extends Component{
  static propTypes = {
    commentId: PropTypes.string.isRequired,
    closeHandle: PropTypes.func.isRequired
  };

  state = {
    bodyInput: '',
    warringLabelDisplay: false,
    warringInfo: '',
    fetching: false,
    errLabelDisplay: false,
  };

  constructor(props) {
    super(props);
    const {commentId, comments} = this.props;
    const comment = comments[commentId];
    //载入原评论信息
    this.state.bodyInput = comment.body;
  }

  closeHandle = () => {
    let newState = {};
    newState.warringLabelDisplay = false;
    newState.errLabelDisplay = false;
    newState.fetching = false;
    this.setState(newState);
    this.props.closeHandle();
  };

  warringInfoArr = [
    '请输入内容',
    '内容长度不能超过1000个字符',
  ];

  submitHandle = (id, body) => {
    let newState = {warringLabelDisplay: true};
    if (body === '') {
      newState.warringInfo = this.warringInfoArr[0]
    }else if (body.length > 1000) {
      newState.warringInfo = this.warringInfoArr[1]
    }else {
      newState.warringLabelDisplay = false;
    }

    if (newState.warringLabelDisplay) {
      this.setState(newState)
    }else {
      let timestamp = Date.now();
      this.setState({fetching: true});
      editCommentAPI(id, {timestamp, body}).then(re => {
        this.setState({fetching: false});
        this.props.editComment({id, timestamp, body});
        this.closeHandle()
      }).catch(err => {
        this.setState({fetching: false, errLabelDisplay: true});
      });
    }
  };

  render() {
    const {commentId, comments} = this.props;
    const {bodyInput, warringLabelDisplay, warringInfo, fetching, errLabelDisplay} = this.state;
    const comment = comments[commentId];

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
            <FormControl value={comment ? comment.author : ''} disabled/>
          </FormGroup>
        </form>

        <Label style={{display: warringLabelDisplay ? 'block' : 'none'}} bsStyle="warning">{warringInfo}</Label>
        <Label style={{display: errLabelDisplay ? 'block' : 'none'}} bsStyle="danger">服务器访问失败</Label>
      </div>
    );

    return (
      <BaseModal open={true}
                 title='编辑回复'
                 body={body}
                 closeHandle={() => this.closeHandle()}
                 submitButton={true}
                 submitName='更新'
                 submitHandle={() => this.submitHandle(commentId, bodyInput)}
                 asyncFetch={fetching}/>
    )
  }
}

function mapStateToProps({userName, comment}) {
  return {
    userName,
    comments: {...comment.comments}
  }
}

function mapDispatchToProps(dispatch) {
  return {
    editComment: data => dispatch(editComment(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCommentModal);