import React, {Component} from 'react'
import PropTypes from 'prop-types'
import escapeRegExp from 'escape-string-regexp'
import BaseModal from './BaseModal'
import {Label} from 'react-bootstrap'
import {editName} from "../../actions/UserNameAction";
import {connect} from "react-redux";

class NameEditModal extends Component{
  static propTypes = {
    open: PropTypes.bool.isRequired,
    closeHandle: PropTypes.func.isRequired
  };

  state = {
    nameInput: '',
    warringLabelDisplay: false,
    warringInfo: ''
  };

  constructor(props) {
    super(props);
    this.state.nameInput = this.props.userName;
  }

  closeHandle = (submit) => {
    let newState = {};
    !submit && (newState.nameInput = this.props.userName);
    newState.warringLabelDisplay = false;
    this.setState(newState);
    this.props.closeHandle()
  };

  warringInfoArr = [
    '请输入新用户名',
    '长度不要超过16个字符'
  ];

  submitHandle = (value) => {
    if (value === '') {
      this.setState({warringLabelDisplay: true, warringInfo: this.warringInfoArr[0]})
    }else if (value.length > 16) {
      this.setState({warringLabelDisplay: true, warringInfo: this.warringInfoArr[1]})
    }else {
      this.props.editName(escapeRegExp(value));
      this.closeHandle(true)
    }
  };

  render() {
    const {open} = this.props;
    const {nameInput, warringLabelDisplay, warringInfo} = this.state;

    const modalBody = (
      <div>
        <input className='form-control'
               value={nameInput}
               placeholder='请输入新用户名'
               onChange={(e) => this.setState({nameInput: e.target.value})}/>
        <Label style={{display: warringLabelDisplay ? 'block' : 'none'}} bsStyle="warning">{warringInfo}</Label>
      </div>
    );

    return (
      <BaseModal open={open}
                 title='编辑用户名'
                 body={modalBody}
                 closeHandle={() => this.closeHandle(false)}
                 submitButton={true}
                 submitName='更改'
                 submitHandle={() => this.submitHandle(nameInput)}/>
    )
  }
}

function mapStateToProps({userName}) {
  return {
    userName: userName
  }
}

function mapDispatchToProps(dispatch) {
  return {
    editName: data => dispatch(editName(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NameEditModal);