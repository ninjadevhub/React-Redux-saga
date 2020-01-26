import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { withRouter } from 'react-router-dom';

import { Header } from 'components/Header';
import Footer from 'components/Footer';
import { Button } from 'components/Button';
import { appConfig } from 'config/appConfig';

import thumbUp from 'assets/icons/thumbs-up.svg';
import style from './style.scss';

class Congrats extends Component {
  handleButtonClick = (e) => {
    e.preventDefault();

    this.props.history.push('/dashboard');
  }
  render() {
    const isADFMerchant = appConfig.adfMerchantId === localStorage.getItem('merchantId');

    return (
      <Fragment>
        <Header />
        <section className="container section">
          <div className={cn('grid-container fluid', style['borrowers-message'])}>
            <div className="grid-container">
              <div className="grid-x grid-margin-x max-limited">

                <div className="cell small-12 large-8 large-offset-2">
                  <img src={thumbUp} alt="congrats" />
                  <h2>Congratulations!<br />Your Application has been successfully submitted!</h2>
                  <p className="p-xlarge">Please have your merchant proceed to the next step</p>
                  { !isADFMerchant &&
                    <Button
                      id="FormSubmit"
                      className="button large arrow green"
                      onClick={this.handleButtonClick}
                    >
                      To Dashboard
                    </Button>
                  }
                </div>

              </div>
            </div>
          </div>
        </section>
        <Footer />
      </Fragment>
    );
  }
}

Congrats.propTypes = {
  history: PropTypes.object.isRequired,
};

Congrats.defaultProps = {

};

export default withRouter(Congrats);
