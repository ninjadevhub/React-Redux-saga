import React from 'react';
import ReactPaginate from 'react-paginate';
import {
  Container,
  Row,
  Col,
} from 'reactstrap';

type Props = {
  pageLength: number,
  pageOffset: number,
  rowCount: number,
  onPageOffsetChange: () => {}
};

export default class DataGridFooter extends React.Component {
  props: Props;

  render() {
    const { pageLength, pageOffset, rowCount, onPageOffsetChange } = this.props;
    let pageCount = 0;
    if (pageLength !== 0) {
      if (rowCount % pageLength === 0) {
        pageCount = parseInt(rowCount / pageLength, 10);
      } else {
        pageCount = parseInt(rowCount / pageLength, 10) + 1;
      }
    }
    // const pageCountMark = (
    //   <div className="page-count-container">
    //     <div className="info-label">
    //       <div className="select-container">
    //         <select className="form-control" style={{ marginBottom: 0, padding: '0.5rem' }} value={pageLength} onChange={ev => onPageLengthChange(ev)}>
    //           <option value="5">5 per page</option>
    //           <option value="10">10 per page</option>
    //           <option value="20">20 per page</option>
    //           <option value="50">50 per page</option>
    //         </select>
    //         <i className="fa fa-caret-down i-dropdown" />
    //       </div>
    //     </div>
    //     {/* <div className="info-label">Page size:&nbsp;</div> */}
    //   </div>
    // );
    return (
      <Container fluid>
        <Row className="align-items-center">
          {/* <Col className="pagination-label">{(pageOffset / pageLength) + 1}-{pageCount} of {rowCount} entries</div> */}
          <Col md={{ size: 4, offset: 4 }}>
            <nav aria-label="page">
              <ReactPaginate
                previousLabel={
                  <span aria-hidden="true">«</span>
                }
                nextLabel={
                  <span aria-hidden="true">»</span>
                }
                breakLabel={
                  <span aria-hidden="true">...</span>
                }
                breakClassName="break-me"
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={4}
                onPageChange={(sd) => { console.log('yeseyseyeses'); onPageOffsetChange(sd); }}
                containerClassName="pagination text-center"
                subContainerClassName="pages pagination"
                activeClassName="active"
                pageLinkClassName="page-link"
                forcePage={pageOffset / pageLength}
              />
            </nav>
          </Col>
          <Col md={4} className="text-center text-md-right mt-1 mt-md-0">
            <small>
              {(pageOffset / pageLength) + 1}-{pageCount} of {rowCount} entries
            </small>
          </Col>
        </Row>
      </Container>
    );
  }
}
