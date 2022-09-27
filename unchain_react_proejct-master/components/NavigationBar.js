import Link from 'next/link'
import { useRouter } from 'next/router'
import { Provider } from 'react-redux';
import { RecoilRoot } from "recoil";

function NavigationBar() {
  const router = useRouter()
  const anchorClass = (href) =>
    router.asPath === href ? 'nav-link px-2 text-secondary' : 'nav-link px-2 text-white'
  return (
    <header className="p-3 bg-dark ftext-white">
      <div className="unchain_title_container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li>
              <Link href="/">
                <a className={anchorClass('/')}>언체인</a>
              </Link>
            </li>
            <li>
              <Link href="/trade">
                <a className={anchorClass('/trade')}>거래소</a>
              </Link>
            </li>
            <li>
              <Link href="/trends">
                <a className={anchorClass('/trends')}>코인동향</a>
              </Link>
            </li>
            <li>
              <Link href="/SimpleStorage">
                <a className={anchorClass('/SimpleStorage')}>TDC</a>
              </Link>
            </li>
          </ul>
          <div className="text-end">
            
            <button
              type="button"
              className="btn btn-outline-light me-2"
              onClick={() => router.push('/login')}
            >
              
              로그인
            </button>
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => router.push('/signin')}
            >
              회원가입
            </button>
            
          </div>
        </div>
      </div>
    </header>
  )
}

export default NavigationBar
