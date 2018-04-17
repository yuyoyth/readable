import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Button, Col, Grid, ListGroup, ListGroupItem, PageHeader, Panel, Row} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import sortBy from 'sort-by'
import PostEditModal from './modal/CreatePostModal'
import CustomizePagination from './CustomizePagination'
import TitleList from './TitleList'
import {sortStateEnum} from './TitleList'

export const sortByEnum = {
  VOTE: 'voteScore',
  DATE: 'timestamp'
};

class HomePage extends Component {
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
    const {posts, categories} = this.props;

    let displayPosts = posts.sort(sortBy(sortByColumn));
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
                    <small>类别</small>
                  </PageHeader>
                  <Panel>
                    <ListGroup>
                      {
                        Object.keys(categories).map(k => (
                          <Link key={k+'-link'} to={'/'+k}>
                            <ListGroupItem key={k} className='category-btn'>{k}</ListGroupItem>
                          </Link>
                        ))
                      }
                    </ListGroup>
                  </Panel>
                </div>

                <div>
                  <PageHeader>
                    <span><small>帖子</small></span>
                    <span style={{float: 'right'}}>
                      <Button bsStyle='link' onClick={() => this.setState({createPostModalOpen: true})}>新建帖子</Button>
                    </span>
                  </PageHeader>
                  <Panel>
                    <TitleList posts={displayPosts}
                               displayCategory={true}
                               sortChangeHandle={(newSortState) => this.sortChange(newSortState)} />
                    <CustomizePagination totalNum={posts.length}
                                         pageNum={this.pageNum}
                                         changeHandle={(newSlice) => this.setState({displaySlice: newSlice})} />
                  </Panel>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>

        <PostEditModal open={createPostModalOpen}
                       closeHandle={() => this.setState({createPostModalOpen: false})}/>
      </div>
    )
  }

}

function mapStateToProps({post, categories}) {
  return {
    posts: Object.values(post.posts),
    categories: {...categories}
  }
}

export default connect(mapStateToProps)(HomePage);