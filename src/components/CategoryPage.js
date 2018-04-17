import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Button, Col, Grid, PageHeader, Panel, Row} from 'react-bootstrap'
import PostEditModal from './modal/CreatePostModal'
import CustomizePagination from './CustomizePagination'
import TitleList from './TitleList'
import {sortByEnum} from "./HomePage";
import {sortStateEnum} from "./TitleList";
import sortBy from "sort-by";
import {connect} from "react-redux";

class CategoryPage extends Component{
  pageNum = 30;

  state = {
    createPostModalOpen: false,
    sortByColumn: sortByEnum.VOTE,
    reverse: true,
    displaySlice: [],
  };

  constructor(props) {
    super(props);
    this.state.displaySlice = [0, this.pageNum];
  }

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
    const {posts, categoriesToPost} = this.props;
    const {category} = this.props.match.params;

    let allPosts = Object.keys(categoriesToPost.hasOwnProperty(category) ? categoriesToPost[category] : []).map(e => posts[e]);
    let displayPosts = allPosts.sort(sortBy(sortByColumn));
    reverse && displayPosts.reverse();
    displayPosts = displayPosts.slice(displaySlice[0], displaySlice[1]);

    return (
      <div>
        <div>
          <Grid>
            <Row>
              <Col xs={12} md={12}>
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
                </div>
              </Col>
            </Row>
          </Grid>
        </div>

        <PostEditModal open={createPostModalOpen}
                       closeHandle={() => this.setState({createPostModalOpen: false})}
                       selectedCategory={category}/>
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