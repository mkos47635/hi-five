import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2';
import './SingleButtonAlert.css';

const SingleButtonAlert = (message) => {
  return Swal.fire({
    title: '알림',
    html: `<div class="s-swal-text">${message}</div>`,
    confirmButtonText: '확인',
    customClass: {
      container: 'my-swal-container',
      popup: 's-my-swal-popup',
      title: 's-my-swal-title',
      htmlContainer: 's-my-swal-html',
      confirmButton: 's-my-swal-confirm-button'
    },
    buttonsStyling: false,
    showClass: {
      popup: 'swal2-show'
    },
    hideClass: {
      popup: 'swal2-hide'
    }
  });
};
export default SingleButtonAlert;