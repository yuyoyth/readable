import React from 'react'
import {connect} from 'react-redux'
import {Col, Grid, ListGroup, ListGroupItem, PageHeader, Panel, Row} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import CategoryPage from './CategoryPage'

/**
 * Home页面
 */
export default connect(mapStateToProps)(function HomePage({categories}) {
  return (
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
                    <Link key={k + '-link'} to={'/' + k}>
                      <ListGroupItem key={k} className='category-btn'>{k}</ListGroupItem>
                    </Link>
                  ))
                }
              </ListGroup>
            </Panel>
          </div>

          <CategoryPage all={true}/>
        </Col>
      </Row>
    </Grid>
  )
});

function mapStateToProps({post, categories}) {
  return {
    categories: {...categories}
  }
}