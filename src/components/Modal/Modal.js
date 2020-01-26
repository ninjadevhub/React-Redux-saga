import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { add, remove } from 'eventlistener';
import cn from 'classnames';

import CloseIcon from 'components/Icons/Close';

import style from './Modal.scss';

export default class Modal extends Component {
  static propTypes = {
    className: PropTypes.string,
    closeIconClassName: PropTypes.string,
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
    isFullScreen: PropTypes.bool,
    isCloseButtonShown: PropTypes.bool,
    id: PropTypes.string,
    vertical: PropTypes.string,
  }

  static defaultProps = {
    className: '',
    closeIconClassName: '',
    isFullScreen: false,
    isCloseButtonShown: true,
    id: '',
    vertical: 'center',
  }

  componentDidMount() {
    setImmediate(() => this.positionDialog());
    // document.body.classList.add(style.noScroll);
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';
    add(window, 'resize', this.positionDialog);
    add(this.modal, 'click', this.onOverlayClickHandler);
  }

  componentDidUpdate() {
    this.positionDialog();
  }

  componentWillUnmount() {
    // document.body.classList.remove(style.noScroll);
    document.body.style.height = '';
    document.body.style.overflow = '';
    remove(this.modal, 'click', this.onOverlayClickHandler);
    remove(window, 'resize', this.positionDialog);
  }

  onOverlayClickHandler = (e) => {
    if (e.target === this.modal) {
      this.props.onClose(e);
    }
  }

  positionDialog = () => {
    const { height } = this.modalBody.getBoundingClientRect();
    // Note, to get real height of the modal dialog
    // we have to divide it by 1.1, i.e. scale animation coefficient.
    if (height / 1.1 >= window.innerHeight && !this.props.isFullScreen) {
      this.modal.style.display = 'block';
      this.modalBody.style.margin = 'auto';
    } else {
      this.modal.style.display = '';
      this.modalBody.style.margin = '';
    }
  }

  render() {
    const { children, className, id, closeIconClassName, onClose,
      isFullScreen, isCloseButtonShown, vertical } = this.props;

    return (
      <div
        id={id}
        ref={(el) => { this.modal = el; }}
        className={cn(style.modalContainer, {
          [style.centerContent]: !isFullScreen && vertical === 'center',
          [style.topContent]: !isFullScreen && vertical === 'top',
        })}
      >
        <div
          ref={(el) => { this.modalBody = el; }}
          className={cn(className, style.dialog, {
            [style.fullScreen]: isFullScreen,
          })}
        >
          { /* Browsers don't trigger click on svg icon; Keep it wrapped with div */ }
          { isCloseButtonShown && (
            <div className={cn(closeIconClassName, style.closeIconWrapper)} onClick={onClose}>
              <CloseIcon className={style.closeIcon} />
            </div>)
          }

          {children}
        </div>
      </div>
    );
  }
}
