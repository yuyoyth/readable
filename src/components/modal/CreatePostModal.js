import React, {Component} from 'react'
import PropTypes from 'prop-types'
import escapeRegExp from 'escape-string-regexp'
import BaseModal from './BaseModal'
import {FormGroup, ControlLabel, FormControl, Label} from 'react-bootstrap'
import {addPost} from '../../actions/PostActions'
import {editName} from '../../actions/UserNameAction'
import {connect} from 'react-redux'
import {generateUUID} from '../../utils/tools'
import {addPost as addPostAPI} from '../../utils/api'

class CreatePostModal extends Component{
  static propTypes = {
    open: PropTypes.bool.isRequired,
    selectedCategory: PropTypes.string,
    closeHandle: PropTypes.func.isRequired
  };

  state = {
    titleInput: '',
    bodyInput: '',
    userNameInput: '',
    categorySelect: '',
    warringLabelDisplay: false,
    warringInfo: '',
    fetching: false,
    errLabelDisplay: false,
  };

  constructor(props) {
    super(props);
    this.state.userNameInput = this.props.userName;
    this.props.selectedCategory && (this.state.categorySelect = this.props.selectedCategory)
  }

  closeHandle = (submit) => {
    let newState = {};
    if (submit) {
      newState.titleInput = '';
      newState.bodyInput = '';
      !this.props.hasOwnProperty('selectedCategory') && (newState.categorySelect = '');
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
    '请输入标题',
    '标题长度不能超过100个字符',
    '请输入内容',
    '内容长度不能超过1000个字符',
    '请输入创建者名称',
    '创建者名称不能超过16个字符',
    '请选择类别'
  ];

  submitHandle = (title, body, author, category) => {
    let newState = {warringLabelDisplay: true};
    if (title === '') {
      newState.warringInfo = this.warringInfoArr[0]
    }else if (title.length > 100) {
      newState.warringInfo = this.warringInfoArr[1]
    }else if (body === '') {
      newState.warringInfo = this.warringInfoArr[2]
    }else if (body.length > 1000) {
      newState.warringInfo = this.warringInfoArr[3]
    }else if (author === '') {
      newState.warringInfo = this.warringInfoArr[4]
    }else if (author.length > 16) {
      newState.warringInfo = this.warringInfoArr[5]
    }else if (category === '') {
      newState.warringInfo = this.warringInfoArr[6]
    }else {
      newState.warringLabelDisplay = false;
    }

    if (newState.warringLabelDisplay) {
      this.setState(newState)
    }else {
      const [id, timestamp] = [generateUUID(), Date.now()];
      title = escapeRegExp(title);
      body = escapeRegExp(body);
      author = escapeRegExp(author);

      this.setState({fetching: true});
      addPostAPI({id, timestamp, title, body, author, category}).then(re => {
        this.setState({fetching: false});
        this.props.editName(author);
        this.props.addPost({id, timestamp, title, body, author, category});
        this.closeHandle(true)
      }).catch(err => {
        this.setState({fetching: false, errLabelDisplay: true});
      });
    }
  };

  render() {
    const {open, categories, selectedCategory} = this.props;
    const {titleInput, bodyInput, userNameInput, categorySelect,
      warringLabelDisplay, warringInfo, fetching, errLabelDisplay} = this.state;

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
            <FormControl value={userNameInput}
                         onChange={(e) => this.setState({userNameInput: e.target.value})}/>
          </FormGroup>

          <FormGroup controlId="categoryFormControl">
            <ControlLabel>类别</ControlLabel>
            <FormControl componentClass="select"
                         placeholder="select"
                         value={categorySelect}
                         onChange={(e) => this.setState({categorySelect: e.target.value})}
                         disabled={!!selectedCategory}>
              <option value=''>select...</option>
              {
                categories.map(e => (
                  <option key={e} value={e}>{e}</option>
                ))
              }
            </FormControl>
          </FormGroup>
        </form>

        <Label style={{display: warringLabelDisplay ? 'block' : 'none'}} bsStyle="warning">{warringInfo}</Label>
        <Label style={{display: errLabelDisplay ? 'block' : 'none'}} bsStyle="danger">服务器访问失败</Label>
      </div>
    );

    return (
      <BaseModal open={open}
                 title='新建帖子'
                 body={body}
                 closeHandle={() => this.closeHandle(false)}
                 submitButton={true}
                 submitName='新建'
                 submitHandle={() => this.submitHandle(titleInput, bodyInput, userNameInput, categorySelect)}
                 asyncFetch={fetching}/>
    )
  }
}

function mapStateToProps({userName, categories}) {
  return {
    userName,
    categories: Object.keys(categories)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    editName: data => dispatch(editName(data)),
    addPost: data => dispatch(addPost(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreatePostModal);