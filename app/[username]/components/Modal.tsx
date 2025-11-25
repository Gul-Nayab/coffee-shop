//SJSU CMPE 138 FALL 2025 TEAM 2
import React, { ReactNode } from 'react';
import './styles/Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  closeOnBackdrop?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  closeOnBackdrop = true,
}) => {
  if (!isOpen) return null; // Don't render anything when closed

  return (
    <>
      <div
        className='modal-backdrop'
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      <div className='modal-container'>
        <div className='modal-content' onClick={(e) => e.stopPropagation()}>
          {title && <h2 className='modal-title'>{title}</h2>}
          <div className='modal-body'>{children}</div>
          <button className='modal-close' onClick={onClose}>
            ✕
          </button>
        </div>
      </div>
    </>
  );
};

export default Modal;
