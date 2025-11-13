import { Link } from 'react-router-dom'
import './Footer.scss'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__section">
            <h3 className="footer__title">Hotelhub Business</h3>
            <p className="footer__description">
              호텔 사업자를 위한 통합 관리 플랫폼
            </p>
          </div>

          <div className="footer__section">
            <h4 className="footer__heading">메뉴</h4>
            <ul className="footer__links">
              <li>
                <Link to="/">대시보드</Link>
              </li>
              <li>
                <Link to="/hotels">호텔 관리</Link>
              </li>
              <li>
                <Link to="/rooms">객실 관리</Link>
              </li>
              <li>
                <Link to="/statistics">매출 통계</Link>
              </li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__heading">고객센터</h4>
            <ul className="footer__links">
              <li>
                <a href="mailto:support@hotelhub.com">support@hotelhub.com</a>
              </li>
              <li>1588-0000</li>
              <li>평일 09:00 - 18:00</li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__heading">소셜</h4>
            <div className="footer__social">
              <a href="#" aria-label="Facebook">
                <span>Facebook</span>
              </a>
              <a href="#" aria-label="Instagram">
                <span>Instagram</span>
              </a>
              <a href="#" aria-label="Twitter">
                <span>Twitter</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {currentYear} Hotelhub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
