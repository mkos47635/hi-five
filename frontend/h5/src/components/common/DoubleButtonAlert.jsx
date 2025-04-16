import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './DoubleButtonAlert.css';

const DoubleButtonAlert = (message) => {
  return Swal.fire({
    title: '알림',
    html: `<div class="swal-text">${message}</div>`,
    showCancelButton: true,
    confirmButtonText: '네',
    cancelButtonText: '아니오',
    customClass: {
      popup: 'my-swal-popup',
      title: 'my-swal-title',
      confirmButton: 'my-swal-confirm-button',
      cancelButton: 'my-swal-cancel-button'
    },
    buttonsStyling: false
  });
};

export default DoubleButtonAlert;