import React from 'react'
import {Link} from 'react-router-dom'

/**
 * 404页面
 */
export default function () {
  return (
    <div className="background-404">
      <h1><b>404</b></h1>
      <h1><b>浏览的内容不存在</b></h1>
      <br/>
      <p><Link to='/'>Back Home</Link></p>
    </div>
  )
}