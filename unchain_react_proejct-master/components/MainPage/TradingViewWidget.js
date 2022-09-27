import { useEffect, useRef } from 'react'

function TradingViewWidget({ width = '100%', height = '400px' }) {
  const ref = useRef()
  useEffect(() => {
    let refValue
    if (ref.current) {
      const script = document.createElement('script')
      script.src = 'https://s3.tradingview.com/tv.js'
      script.async = true
      script.onload = () => {
        if (typeof TradingView !== 'undefined') {
          new TradingView.widget({
            symbol: 'UPBIT:BTCKRW',
            interval: '1',
            timezone: 'Etc/UTC',
            theme: 'light',
            style: '0',
            locale: 'kr',
            toolbar_bg: '#f1f3f6',
            enable_publishing: false,
            allow_symbol_change: true,
            details: true,
            show_popup_button: true,
            width,
            height,
            container_id: 'tradingview_17997'
          })
        }
      }
      ref.current.appendChild(script)
      refValue = ref.current
    }

    return () => {
      if (refValue) {
        while (refValue.firstChild) {
          refValue.removeChild(refValue.firstChild)
        }
      }
    }
  }, [height, ref, width])

  return (
    <>
      <div className="tradingview-widget-container">
        <div id="tradingview_17997" ref={ref}></div>
      </div>
      <style jsx>{`
        .tradingview-widget-container {
          margin: 1rem;
          grid-column: 1/4;
        }
      `}</style>
    </>
  )
}

export default TradingViewWidget
