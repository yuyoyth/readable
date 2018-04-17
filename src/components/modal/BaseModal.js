import React from 'react'
import {Button, Modal} from 'react-bootstrap'
import Loading from 'react-loading'

export default function BaseModal({title, body, open, backdrop = 'static', closeHandle = ()=>{},
                                    submitButton = false, submitName = '提交', submitType='primary', submitHandle = ()=>{},
                                    asyncFetch = false}) {
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
                return (<Button bsStyle="primary" disabled><Loading delay={200} type='bubbles' color='#fff' className='loading' height='20px' width='28px' /></Button>)
              }else {
                return (<Button bsStyle={submitType} onClick={submitHandle}>{submitName}</Button>)
              }
            }
          })()
        }
      </Modal.Footer>
    </Modal>
  )
}