import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSTransition from 'react-transition-group/CSSTransition';
import { add, remove } from 'eventlistener';
import { createPortal } from 'react-dom';
import Modal from './Modal';
import style from './Modal.scss';

export default class AnimatedModal extends Component {
  static propTypes = {
    isShown: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    canBeClosedByEsc: PropTypes.bool,
  }

  static defaultProps = {
    canBeClosedByEsc: true,
  }

  static contextTypes = {
    store: PropTypes.object,
  }

  componentWillMount() {
    this.modalWrapper = document.createElement('div');
    this.modalWrapper.classList.add('fnhw-react-app');

    this.modal = document.createElement('div');
    this.modal.classList.add(style.zIndex);

    this.modalWrapper.appendChild(this.modal);
    document.body.appendChild(this.modalWrapper);

    /** originally was
     * this.modal = document.createElement('div');
     * this.modal.classList.add(style.zIndex);
     * document.body.appendChild(this.modal);
     * this.renderModal();
     * for a SPA.
     */
  }

  componentWillReceiveProps(nextProps) {
    const { isShown } = this.props;
    if (nextProps.isShown && !isShown) {
      add(window, 'keydown', this.handleKeyDown);
      // as soon as <body> get hight: 100vh and overflow hidden
      // the vertical scrollbar disapears what makes content to jump left on 15px
      // (or depends on browser's scrollbar width);
      // applying window width exclude scrollbar width keeps content placed
      document.body.style.width = window.getComputedStyle(document.body).width;
    } else if (!nextProps.isShown && isShown) {
      // waiting  until animation is done
      remove(window, 'keydown', this.handleKeyDown);
      setTimeout(() => { document.body.style.width = ''; }, 300);
    }
  }

  handleKeyDown = (e) => {
    if (e.key === 'Escape' && this.props.isShown) {
      this.props.canBeClosedByEsc && this.props.onClose();
    }
  }

  render() {
    const { isShown, ...restProps } = this.props;
    return createPortal(
      <CSSTransition
        classNames="modalWrap"
        timeout={300}
        unmountOnExit
        in={isShown}
      >
        <Modal {...restProps} />
      </CSSTransition>,
      this.modalWrapper
    );
  }
}
