import React, { useEffect, useState } from 'react';

const Notification = ({ message, type = 'success', onClose }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onClose) onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!show) return null;

  const bgClass = type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-info';

  return (
    <div
      className={`${bgClass} text-white p-3 rounded shadow-lg position-fixed top-0 end-0 m-3`}
      style={{ zIndex: 9999, minWidth: '300px' }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <span>{message}</span>
        <button
          type="button"
          className="btn-close btn-close-white"
          onClick={() => {
            setShow(false);
            if (onClose) onClose();
          }}
        ></button>
      </div>
    </div>
  );
};

export default Notification;

