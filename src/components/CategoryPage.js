import React, {Component} from 'react'
import {Button, Col, Grid, PageHeader, Panel, Row} from 'react-bootstrap'
import PostEditModal from './modal/CreatePostModal'
import CustomizePagination from './CustomizePagination'
import TitleList from './TitleList'
import {sortStateEnum} from "./TitleList";
import sortBy from "sort-by";
import {connect} from "react-redux";

//排序字段
export const sortByEnum = {
  VOTE: 'voteScore',
  DATE: 'timestamp'
};

/**
 * 类别页面
 */
class CategoryPage extends Component{
  pageNum = 30; //分页每页30项

  state = {
    createPostModalOpen: false, //添加帖子modal开关

    sortByColumn: sortByEnum.VOTE, //排序使用列
    reverse: true, //是否倒序
    displaySlice: [], //展示范围
  };

  constructor(props) {
    super(props);
    //初始化第一页范围
    this.state.displaySlice = [0, this.pageNum];
  }

  //排序变化时修改控制选项
  sortChange = (sortState) => {
    if (sortState === sortStateEnum.VOTE_ASC) {
      this.setState({sortByColumn: sortByEnum.VOTE, reverse: false})
    }else if (sortState === sortStateEnum.VOTE_DESC) {
      this.setState({sortByColumn: sortByEnum.VOTE, reverse: true})
    }else if (sortState === sortStateEnum.DATE_ASC) {
      this.setState({sortByColumn: sortByEnum.DATE, reverse: false})
    }else if (sortState === sortStateEnum.DATE_DESC) {
      this.setState({sortByColumn: sortByEnum.DATE, reverse: true})
    }
  };

  render() {
    const {createPostModalOpen, sortByColumn, reverse, displaySlice} = this.state;

    //all为属性参数，如果有效，将不进行类别筛选，显示全部帖子
    const {posts, categoriesToPost, all} = this.props;

    //获得类别参数
    let category;
    !all && (category = this.props.match.params.category);

    //获得类别下的所有帖子
    let allPosts = all
      ? Object.values(posts)
      : Object.keys(categoriesToPost.hasOwnProperty(category) ? categoriesToPost[category] : []).map(e => posts[e]);
    //按状态进行排序分页
    let displayPosts = allPosts.sort(sortBy(sortByColumn));
    reverse && displayPosts.reverse();
    displayPosts = displayPosts.slice(displaySlice[0], displaySlice[1]);

    const body = (
      <div>
        <PageHeader>
          <span><small>帖子</small></span>
          <span style={{float: 'right'}}>
                    <Button bsStyle='link' onClick={() => this.setState({createPostModalOpen: true})}>新建帖子</Button>
                  </span>
        </PageHeader>

        <Panel>
          <TitleList posts={displayPosts} sortChangeHandle={(newSortState) => this.sortChange(newSortState)} />
          <CustomizePagination totalNum={allPosts.length}
                               pageNum={this.pageNum}
                               changeHandle={(newSlice) => this.setState({displaySlice: newSlice})} />
        </Panel>

        <PostEditModal open={createPostModalOpen}
                       closeHandle={() => this.setState({createPostModalOpen: false})}
                       selectedCategory={category}/>
      </div>
    );

    return all ? body :(
      <div>
        <Grid>
          <Row>
            <Col xs={12} md={12}>
              {body}
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

function mapStateToProps({post}) {
  return {
    posts: {...post.posts},
    categoriesToPost: {...post.categoriesToPost}
  }
}

export default connect(mapStateToProps)(CategoryPage);