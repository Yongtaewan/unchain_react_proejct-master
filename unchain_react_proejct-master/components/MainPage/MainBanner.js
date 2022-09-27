import ExchangeWidget from "./ExchangeWidget"
import { useRouter } from 'next/router'
import Link from 'next/link'

function MainBanner() {
  const router = useRouter()
  return (
    <>
    <div id = "main_title">
      <div
        id="body_title"
        className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-light"
      >
        <div className="col-md-5 p-lg-5 mx-auto my-5">
          <h1 className="display-4 fw-normal">언체인</h1>
          <p className="lead fw-normal">투명한 디지털 자산 거래소</p>
          <Link href="/trade">
            <a className="btn btn-outline-secondary">거래소</a>
          </Link>
          <Link href="/login">
            <a className="btn btn-outline-secondary">로그인</a>
          </Link>
        </div>
      </div>
    </div>
      <style jsx>{`
        #main_title{
          width : 100%;
        }
        #body_title {
          width: 80%;
          color: white;
          background: url('/title.jpg');
          background-size: 100% 100%;
        }
      `}</style>
    </>
  )
}

export default MainBanner
