import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {Button, Col, Grid, ListGroup, ListGroupItem, PageHeader, Panel, Row} from 'react-bootstrap'
import {Redirect} from 'react-router-dom'
import CustomizePagination from './CustomizePagination'
import CommentBody, {TypeEnum} from './CommentBody'
import SortTool from './PostPageSortTool'
import {getCommentsByPost} from '../utils/api'
import {initPostToComment} from '../actions/CommentActions'
import {sortByEnum} from "./CategoryPage";
import {sortStateEnum} from "./TitleList";
import sortBy from "sort-by";
import EditPostModal from './modal/EditPostModal'
import DeletePostModal from './modal/DeletePostModal'
import CreateCommentModal from './modal/CreateCommentModal'
import EditCommentModal from './modal/EditCommentModal'
import DeleteCommentModal from './modal/DeleteCommentModal'

/**
 * 帖子页面
 */
class PostPage extends Component {
  pageNum = 20;

  state = {
    sortByColumn: sortByEnum.VOTE,
    reverse: true,
    displaySlice: [],

    editPostModalOpen: false, //编辑帖子modal开关
    editPostModal: '', //编辑帖子modal

    deletePostModalOpen: false, //删除帖子modal开关
    deletePostModal: '', //删除帖子modal
    submitDeletePostAndRedirect: false, //删除并跳转开关

    createCommentModalOpen: false, //添加评论modal开关

    editCommentModalOpen: false, //编辑评论modal开关
    editCommentModal: '', //编辑评论modal

    deleteCommentModalOpen: false, //删除评论modal开关
    deleteCommentModal: '' //删除评论modal
  };

  constructor(props) {
    super(props);
    this.state.displaySlice = [0, this.pageNum];
  }

  //编辑按钮回调
  editClick = (type, id) => {
    if (type === TypeEnum.POST) {
      //生成modal
      const modal = (
        <EditPostModal postId={id}
                       closeHandle={() => this.setState({editPostModalOpen: false, editPostModal: ''})}/>
      );
      //刷新状态显示modal
      this.setState({editPostModalOpen: true, editPostModal: modal})
    } else if (type === TypeEnum.COMMENT) {
      const modal = (
        <EditCommentModal commentId={id}
                          closeHandle={() => this.setState({editCommentModalOpen: false, editCommentModal: ''})}/>
      );
      this.setState({editCommentModalOpen: true, editCommentModal: modal})
    }
  };

  //删除按钮回调
  deleteClick = (type, id) => {
    if (type === TypeEnum.POST) {
      const modal = (
        <DeletePostModal postId={id}
                         closeHandle={(submit) => {
                           if (submit) {
                             this.setState({
                               deletePostModalOpen: false,
                               deletePostModal: '',
                               submitDeletePostAndRedirect: true
                             })
                           } else {
                             this.setState({deletePostModalOpen: false, deletePostModal: ''})
                           }
                         }}/>
      );
      this.setState({deletePostModalOpen: true, deletePostModal: modal})
    } else if (type === TypeEnum.COMMENT) {
      const modal = (
        <DeleteCommentModal commentId={id}
                            closeHandle={() => this.setState({deleteCommentModalOpen: false, deleteCommentModal: ''})}/>
      );
      this.setState({deleteCommentModalOpen: true, deleteCommentModal: modal})
    }
  };

  sortChange = (sortState) => {
    if (sortState === sortStateEnum.VOTE_ASC) {
      this.setState({sortByColumn: sortByEnum.VOTE, reverse: false})
    } else if (sortState === sortStateEnum.VOTE_DESC) {
      this.setState({sortByColumn: sortByEnum.VOTE, reverse: true})
    } else if (sortState === sortStateEnum.DATE_ASC) {
      this.setState({sortByColumn: sortByEnum.DATE, reverse: false})
    } else if (sortState === sortStateEnum.DATE_DESC) {
      this.setState({sortByColumn: sortByEnum.DATE, reverse: true})
    }
  };

  render() {
    const {editPostModalOpen, editPostModal} = this.state;
    const {deletePostModalOpen, deletePostModal, submitDeletePostAndRedirect} = this.state;
    const {createCommentModalOpen} = this.state;
    const {editCommentModalOpen, editCommentModal} = this.state;
    const {deleteCommentModalOpen, deleteCommentModal} = this.state;

    const {sortByColumn, reverse, displaySlice} = this.state;
    const {postInitFlag, posts, comment, match, initComments} = this.props;
    const {category, postId} = match.params; //获得地址匹配数据

    //所有帖子加载完毕但却没找到对应帖子，404
    if (postInitFlag && !posts.hasOwnProperty(postId)) {
      return <Redirect to='/404'/>
    }

    const post = posts.hasOwnProperty(postId) ? (posts[postId]) : {};

    //判断此帖子的评论是否已初始化，没有则进行一次初始化
    const initFlag = comment.postsToComments.hasOwnProperty(postId);
    !initFlag && getCommentsByPost(postId).then(comments => initComments(postId, comments));

    //评论列表
    const commentsOfPost = initFlag
      ? Object.keys(comment.postsToComments[postId]).map(e => comment.comments[e])
      : [];

    //按状态排序分页
    let displayComments = commentsOfPost.sort(sortBy(sortByColumn));
    reverse && displayComments.reverse();
    displayComments = displayComments.slice(displaySlice[0], displaySlice[1]);

    return (
      <Fragment>
        <Grid>
          <Row>
            <Col xs={12} md={12}>
              {Object.keys(post).length > 0 && (
                <div style={{marginBottom: '50px'}}>
                  <PageHeader style={{marginTop: '0'}}>
                    <span><small style={{fontSize: '45%'}}>{post.title}</small></span>
                  </PageHeader>
                  <CommentBody type={TypeEnum.POST} id={postId} floor={1}
                               editButtonClickHandle={(type, id) => this.editClick(type, id)}
                               deleteButtonClickHandle={(type, id) => this.deleteClick(type, id)}/>
                </div>
              )}

              <div>
                <div>
                  <SortTool sortChangeHandle={(newSortState) => this.sortChange(newSortState)}/>
                  <Button bsStyle='link' style={{float: 'right'}}
                          onClick={() => this.setState({createCommentModalOpen: true})}>Reply</Button>
                </div>
                <Panel>
                  <div>
                    <ListGroup className='reply-list'>
                      {
                        Object.entries(displayComments).map(([i, e]) => (
                          <ListGroupItem key={e.id}>
                            <CommentBody type={TypeEnum.COMMENT} id={e.id} floor={parseInt(i, 10) + 2}
                                         editButtonClickHandle={(type, id) => this.editClick(type, id)}
                                         deleteButtonClickHandle={(type, id) => this.deleteClick(type, id)}/>
                          </ListGroupItem>
                        ))
                      }
                    </ListGroup>
                    <CustomizePagination totalNum={commentsOfPost.length}
                                         pageNum={this.pageNum}
                                         changeHandle={(newSlice) => this.setState({displaySlice: newSlice})}/>
                  </div>
                </Panel>
              </div>
            </Col>
          </Row>
        </Grid>

        {/*modal生成*/}
        <CreateCommentModal open={createCommentModalOpen} postId={postId}
                            closeHandle={() => this.setState({createCommentModalOpen: false})}/>
        {editPostModalOpen && editPostModal}
        {deletePostModalOpen && deletePostModal}
        {editCommentModalOpen && editCommentModal}
        {deleteCommentModalOpen && deleteCommentModal}

        {/*如果帖子被删除，触发跳转*/}
        {submitDeletePostAndRedirect && (<Redirect to={'/' + category}/>)}
      </Fragment>
    )
  }
}

function mapStateToProps({post, comment}) {
  return {
    postInitFlag: post.initFlag,
    posts: {...post.posts},
    comment: {...comment}
  }
}

function mapDispatchToProps(dispatch) {
  return {
    initComments: (postId, comments) => dispatch(initPostToComment(postId, comments))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);