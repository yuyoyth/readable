import React, {Component, Fragment} from 'react'
import {Navbar, Breadcrumb} from 'react-bootstrap'
import {FaEdit} from 'react-icons/lib/fa'
import {connect} from "react-redux";
import NameEditModal from './modal/NameEditModal'
import {Link} from 'react-router-dom'

/**
 * header头控件
 */
class Header extends Component {
  state = {
    editNameModalOpen: false
  };

  render() {
    const {pathname} = this.props.location;  //获得地址栏
    const {posts} = this.props;

    //分割地址栏数据
    let path = pathname.slice(1);
    path = path === '' ? [] : path.split('/');

    //如果地址栏有第二个参数，则为postId，查询post标题
    let postTitle = '';
    if (path.length > 1) {
      posts.hasOwnProperty(path[1]) && (postTitle = posts[path[1]].title);
      postTitle.length > 40 && (postTitle = postTitle.substr(0, 40) + '...');
    }

    return (
      <Fragment>
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <p>Readable</p>
            </Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>
          <Navbar.Collapse>
          <span className='navbar-text'>
            <Breadcrumb style={{padding: 0, margin: 0, borderRadius: 0, backgroundColor: 'rgba(0, 0, 0, 0)'}}>
              <Breadcrumb.Item active><Link to='/'>Home</Link></Breadcrumb.Item>
              {
                //类别导航栏
                path.length > 0 && <Breadcrumb.Item active>
                  {path.length === 1 ? (
                    path[0]
                  ) : (
                    <Link to={'/' + path[0]}>{path[0]}</Link>
                  )}
                </Breadcrumb.Item>
              }
              {
                //帖子导航栏
                path.length > 1 && <Breadcrumb.Item active>
                  {path.length === 2 ? (
                    postTitle
                  ) : (
                    <Link to={'/' + path[0] + '/' + path[1]}>{postTitle}</Link>
                  )}
                </Breadcrumb.Item>
              }
            </Breadcrumb>
          </span>

            <Navbar.Text pullRight>
              <span>Hi,{' '}</span>
              <span style={{padding: '0 5px 0 0'}}>{this.props.userName}</span>
              <span style={{cursor: 'pointer'}} onClick={() => {
                this.setState({editNameModalOpen: true})
              }}><FaEdit/></span>
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>

        <NameEditModal open={this.state.editNameModalOpen} closeHandle={() => {
          this.setState({editNameModalOpen: false})
        }}/>
      </Fragment>
    )
  }
}

function mapStateToProps({post, userName}) {
  return {
    posts: {...post.posts},
    userName: userName
  }
}

export default connect(mapStateToProps)(Header);