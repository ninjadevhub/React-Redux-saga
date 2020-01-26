import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { connect } from 'react-redux';
import Loading from 'react-loading-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Card,
  CardHeader,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
} from 'reactstrap';

import { Button } from 'components/Button';
import Select from 'components/Form/Select';

import {
  getBanners,
} from 'actions/banners';

const SELECT_ALL = '_all';

class WebBanners extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isModalShowing: false,
      banners: [],
      sizes: [
        {
          value: SELECT_ALL,
          title: 'Filter by Size...',
        },
        {
          value: 'logo',
          title: 'logo',
          css: 'size-1',
        },
        {
          value: '160x600',
          title: '160x600',
          css: 'size-1',
        },
        {
          value: '200x200',
          title: '200x200',
          css: 'size-2',
        },
        {
          value: '300x250',
          title: '300x250',
          css: 'size-3',
        },
        {
          value: '300x600',
          title: '300x600',
          css: 'size-4',
        },
        {
          value: '320x50',
          title: '320x50',
          css: 'size-5',
        },
        {
          value: '728x90',
          title: '728x90',
          css: 'size-6',
        },
      ],
      selectedBanner: SELECT_ALL,
      selectedSize: SELECT_ALL,
      selectedEmbeded: {},
    };
  }
  componentDidMount() {
    this.props.getBanners({
      url: 'lookup/merchant-banners',
      success: (res) => {
        const banners = [];
        Object.keys(res).forEach((key) => {
          banners.push({
            code: res[key].code,
            label: res[key].label,
            attributes: res[key].attributes,
          });
        });
        this.setState({
          loading: false,
          banners,
        });
      },
      fail: (error) => {
        console.log(error);
      },
    });
  }
  handleButtonClick = (e, size) => {
    e.preventDefault();

    this.setState({
      isModalShowing: true,
      selectedEmbeded: size,
    });
  }
  handleCloseClick = (e) => {
    e.preventDefault();

    this.setState({
      isModalShowing: false,
    });
  }
  handleBannerChange = (event) => {
    this.setState({
      selectedBanner: event.target.value,
    });
  }
  handleSizeChange = (event) => {
    this.setState({
      selectedSize: event.target.value,
    });
  }
  render() {
    const { loading, isModalShowing, banners, selectedBanner, sizes, selectedSize, selectedEmbeded } = this.state;
    const merchantId = localStorage.getItem('merchantId');
    const contentMarkup = selectedEmbeded.markup ? selectedEmbeded.markup.replace(/{{merchantId}}/g, merchantId) : '<div/>';
    const optionsBanner = [{ value: SELECT_ALL, title: 'Select a Specialty' }];
    const content = banners.map((banner, index) => {
      // get options
      optionsBanner.push({
        value: banner.code,
        title: banner.label,
      });

      // get html content
      if (banner.code === selectedBanner || selectedBanner === SELECT_ALL) {
        const contentSizes = banner.attributes.sizes.map((bsize, sindex) => {
          if (bsize.size === selectedSize || selectedSize === SELECT_ALL) {
            // eslint-disable-next-line prefer-destructuring
            const found = sizes.filter(s => s.value === bsize.size)[0];
            const cssSize = found ? found.css : 'size-1';
            return (
              <Col key={sindex} sm={12} lg={4} className="d-flex justify-content-center">
                <div className="bannerContainer">
                  <div className="imageContainer">
                    <img className={`banner-img ${cssSize}`} src={bsize.imageUrl} alt="Banner" />
                  </div>
                  <div className="action">
                    <h6>{bsize.size}</h6>
                    <Button
                      className="small"
                      onClick={e => this.handleButtonClick(e, bsize)}
                      color="primary"
                    >
                      Embed Code
                    </Button>
                  </div>
                </div>
              </Col>
            );
          }
          return null;
        });
        return (
          <Card key={index} className={`animated fadeIn delay-${200 * (index + 1)}ms`}>
            <CardHeader>
              <p style={{ marginBottom: 0 }}>{banner.label} &nbsp;–&nbsp; {banner.attributes.title}</p>
            </CardHeader>
            <CardBody>
              <Row>
                {contentSizes}
              </Row>
            </CardBody>
          </Card>
        );
      }
      return null;
    });

    return (
      <div className="webBanner-page">
        <Container fluid>
          <Row>
            <Col sm="12">
              <Row className="pageHeader">
                <Col sm={12} lg={6}>
                  <h3>Get Website Banners</h3>
                </Col>
                <Col sm={12} lg={3}>
                  <FormGroup className="dropdown-toggle mb-0 pb-0">
                    <Select
                      name="banners"
                      data={optionsBanner}
                      value={selectedBanner}
                      onChange={this.handleBannerChange}
                      label=""
                      hasDefault={false}
                    />
                  </FormGroup>
                </Col>
                <Col sm={12} lg={3}>
                  <FormGroup className="dropdown-toggle mb-0 pb-0">
                    <Select
                      name="sizes"
                      data={sizes}
                      value={selectedSize}
                      onChange={this.handleSizeChange}
                      label=""
                      hasDefault={false}
                    />
                  </FormGroup>
                </Col>
              </Row>
              { loading &&
                <div style={{ margin: '20px' }}>
                  <Loading type="puff" width="100%" height={50} fill="#3989e3" />
                </div>
              }
              { !loading &&
                content
              }
            </Col>
          </Row>
        </Container>
        {/* <!-- Modal --> */}
        <Modal
          isOpen={isModalShowing}
          toggle={this.handleCloseClick}
          backdrop="static"
          centered
          size="lg"
        >
          <ModalHeader toggle={this.handleCloseClick}>
            Embed Code
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col sm={12}>
                <div className="noBottom">
                  <Row>
                    <Col className={cn('col-sm-auto', 'embedImage')}>
                      <img src={selectedEmbeded.imageUrl} alt="Banner" />
                    </Col>
                    <Col className="auto">
                      <label className="has-value" style={{ width: '100%' }}><span>HTML Embed Code</span>
                        <textarea value={contentMarkup} readOnly style={{ height: 180, width: '100%', padding: 15 }} />
                      </label>
                      <CopyToClipboard text={contentMarkup}>
                        <Button className={cn('w-100', 'noMarginBottom')} style={{ marginTop: 15 }} color="primary">Copy Code to Clipboard</Button>
                      </CopyToClipboard>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        {/* <!-- End Modal --> */}
      </div>
    );
  }
}

WebBanners.propTypes = {
  getBanners: PropTypes.func.isRequired,
};

WebBanners.defaultProps = {

};

export default connect(null, { getBanners })(WebBanners);
