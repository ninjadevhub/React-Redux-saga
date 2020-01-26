import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { appConfig } from 'config/appConfig';

const unSupportedStates = {
  CT: 'Connecticut',
  NY: 'New York',
  WV: 'West Virginia',
  NH: 'New Hampshire',
  VT: 'Vermont',
  KS: 'Kansas',
  MS: 'Mississippi',
  SC: 'South Carolina',
  WA: 'Washington',
  WI: 'Wisconsin',
  WY: 'Wyoming',
  VI: 'Virgin Islands',
  PR: 'Puerto Rico',
};

class Popup extends Component {
  render() {
    const { type, handleAbort, data } = this.props;
    return (
      <div className="smarty-ui">
        <div className="smarty-popup">
          <div className={cn('smarty-popup-header', type === 1 && 'smarty-popup-missing-input-header', (type === 2 || type === 3 || type === 4 || type === 5) && 'smarty-popup-invalid-header')}>
            {type === 1 && 'You didn\'t enter enough information'}
            {type === 2 && 'You entered an unknown address'}
            {type === 3 && 'P.O. Box address is not allowed'}
            {type === 4 && `Currently we do not accept loan applications for residents of the state of ${unSupportedStates[data.state]}`}
            {type === 5 && 'Did you miss entering your apt/suite/unit number?'}
          </div>
          <div className="smarty-popup-typed-address">
            { type !== 4 && `${data.address || ''} ${data.city || ''} ${data.state || ''} ${data.zipcode || ''}`}
          </div>
          <div className="smarty-choice-alt" style={{ justifyContent: (!appConfig.smartyStreetEnforce && (type !== 1)) ? 'space-between' : 'center' }}>
            { (type !== 1) && <div className="smarty-choice smarty-choice-abort smarty-abort" onClick={handleAbort}>Use this address anyway</div>}
            <div className="smarty-choice smarty-choice-abort smarty-abort" onClick={handleAbort}>Go back</div>
          </div>
        </div>
      </div>
    );
  }
}

Popup.propTypes = {
  handleAbort: PropTypes.func.isRequired,
  type: PropTypes.number,
  data: PropTypes.object,
};

Popup.defaultProps = {
  type: null,
  data: null,
};

export default Popup;
