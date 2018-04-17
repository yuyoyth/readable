import React, {Component} from 'react'
import {Navbar, Breadcrumb} from 'react-bootstrap'
import {FaEdit} from 'react-icons/lib/fa'
import {connect} from "react-redux";
import NameEditModal from './modal/NameEditModal'
import {Link} from 'react-router-dom'

class Header extends Component{
  state = {
    editNameModalOpen: false
  };

  render() {
    const {pathname} = this.props.location;
    const {posts} = this.props;
    let path = pathname.slice(1);
    path = path === '' ? [] : path.split('/');

    let postTitle = '';
    if (path.length > 1) {
      posts.hasOwnProperty(path[1]) && (postTitle = posts[path[1]].title);
      postTitle.length > 40 && (postTitle = postTitle.substr(0, 40) + '...');
    }

    return (
      <div>
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <p>Readable</p>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
          <span className='navbar-text'>
            <Breadcrumb style={{padding: 0, margin: 0, borderRadius: 0, backgroundColor: 'rgba(0, 0, 0, 0)'}}>
              <Breadcrumb.Item active><Link to='/'>Home</Link></Breadcrumb.Item>
              {
                path.length > 0 && <Breadcrumb.Item active>
                  {path.length === 1 ? (
                    path[0]
                  ) : (
                    <Link to={'/'+path[0]}>{path[0]}</Link>
                  )}
                </Breadcrumb.Item>
              }
              {
                path.length > 1 && <Breadcrumb.Item active>
                  {path.length === 2 ? (
                    postTitle
                  ) : (
                    <Link to={'/'+path[0]+'/'+path[1]}>{postTitle}</Link>
                  )}
                </Breadcrumb.Item>
              }
            </Breadcrumb>
          </span>

            <Navbar.Text pullRight>
              <span>Hi,{' '}</span>
              <span style={{padding: '0 5px 0 0'}}>{this.props.userName}</span>
              <span style={{cursor: 'pointer'}} onClick={() => {this.setState({editNameModalOpen: true})}}><FaEdit/></span>
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>

        <NameEditModal open={this.state.editNameModalOpen} closeHandle={() => {this.setState({editNameModalOpen: false})}}/>
      </div>
    )
  }
}

function mapStateToProps({post ,userName}) {
  return {
    posts: {...post.posts},
    userName: userName
  }
}

export default connect(mapStateToProps)(Header);