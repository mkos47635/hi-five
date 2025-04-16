import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className='footer_container'>
        <span>
          <img src="/logo.png" alt="로고" className="co_footer_logo" />
        </span>
        <ul className="footer-links">
          <li>개인정보처리방침</li>
          <li>이용약관</li>
          <li>FAQ</li>
          <li>공지사항</li>
          <li>찬환과아이들</li>
        </ul>
      </div>
      <hr />
      <div className='footer-bottom'>
        <div className='footer-left'>
          <span className="copyright">©2025 CZ05 ssafy. All rights reserved.</span>
        </div>
        <div className='footer-right'>
          <i className="pi pi-phone" style={{ fontSize: '1.0rem', color: '#FF9F1C', marginRight: '10px', marginTop: '5px' }}></i>
          <span style={{marginRight: '5px'}}>am 9:00 - pm 18:00 </span>
          <span>062-000-0000</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
