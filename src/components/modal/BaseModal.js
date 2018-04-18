import React from 'react'
import {Button, Modal} from 'react-bootstrap'
import Loading from 'react-loading'

/**
 * modal基础框架
 * @param title 标题
 * @param body 内体展示控件
 * @param open 开关
 * @param backdrop 展示方式
 * @param closeHandle 关闭回调
 * @param submitButton 是否生成提交按钮
 * @param submitName 提交按钮显示名称
 * @param submitType 提交按钮风格
 * @param submitHandle 提交回调
 * @param asyncFetch 异步方式
 * @returns {*}
 * @constructor
 */
export default function BaseModal({
                                    title, body, open, backdrop = 'static', closeHandle = () => {},
                                    submitButton = false, submitName = '提交', submitType = 'primary', submitHandle = () => {},
                                    asyncFetch = false
                                  }) {
  return (
    <Modal show={open} onHide={closeHandle} backdrop={backdrop}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {body}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={closeHandle}>关闭</Button>
        {
          (() => {
            if (submitButton) {
              if (asyncFetch) {
                return (<Button bsStyle="primary" disabled><Loading delay={200} type='bubbles' color='#fff'
                                                                    className='loading' height='20px'
                                                                    width='28px'/></Button>)
              } else {
                return (<Button bsStyle={submitType} onClick={submitHandle}>{submitName}</Button>)
              }
            }
          })()
        }
      </Modal.Footer>
    </Modal>
  )
}