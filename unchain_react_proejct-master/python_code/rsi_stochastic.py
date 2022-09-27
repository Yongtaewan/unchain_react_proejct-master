from binance.spot import Spot 
import datetime
import pandas as pd
import mplfinance as mpf
import matplotlib.pyplot as plt
import numpy as np


client = Spot()
print(client.time())

client = Spot(key='QYB7ZQgmmoFWN7VbOpPS9W4kBn0GdUonKGA0KODo1WLD9PCgNpE8VbykmqDjLait', secret='HTOQxa10UvZ7TANdiwtW1HGlZSsFRxFHflceEnA6ZQw7C8rQJzhhtCWlbHWkB96x')

# 3분봉 차트 1000틱
data = client.klines(symbol='BTCUSDT', interval='3m', limit=1000)

# 문자열을 float 타입으로 변환
for i in range(len(data)):
    for j in range(len(data[i])):
        if isinstance(data[i][j], str):
            data[i][j] = float(data[i][j])

# pandas DataFrame 객체 생성
df = pd.DataFrame(data, columns=
             [
                'datetime', 
                'open', 
                'high', 
                'low', 
                'close', 
                'volume', 
                'closeTime', 
                'QuoteAssetVolume', 
                'NumTrades',
                'TakerBuyBaseAssetVolume',
                'TakerBuyQuoteAssetVolume'  ,
                 'Ignore'
                ]
) 

# Timestamp를 Datetime(날짜-시간)형태로 변환
df['datetime'] = pd.to_datetime(df['datetime'], unit='ms')
df.set_index('datetime', inplace=True)

# 필요한 차트 데이터만 가져오기
df = df[['open', 'high', 'low', 'close', 'volume']]
df_100 = df.iloc[-100:]
#print(mpf.plot(df_100,type='candle',mav=(3, 5),volume=True, title='BTC/USDT'))

#rsi
u = df.diff(1)['close'].apply(lambda v:  v if v > 0 else 0)
d = df.diff(1)['close'].apply(lambda v:  -v if v < 0 else 0)

au = u.ewm(14, adjust=False).mean()
ad = d.ewm(14, adjust=False).mean()

rs = au/ad
df['RSI'] = rs / (1 + rs)

df_draw = df[-500:]

adps = []
adps.append(
    mpf.make_addplot(df_draw['RSI'],panel=1,type='line', ylabel='RSI'))
adps.append(
    mpf.make_addplot(np.ones(len(df_draw)) * 0.3, panel=1,type='line', color='red', linestyle='dotted',secondary_y=False))
adps.append(
    mpf.make_addplot(np.ones(len(df_draw)) * 0.7, panel=1,type='line', color='red', linestyle='dotted',secondary_y=False))

fig, axs = mpf.plot(df_draw, style='charles', figratio=(4,3),figscale=1.5, addplot=adps, returnfig=True)
plt.show()

#스토캐스틱
n, m, t = 15, 5, 3

k = (df['close'] - df['low'].rolling(n).min()) / (df['high'].rolling(n).max() - df['low'].rolling(n).min())
d = k.rolling(m).mean()
j = d.rolling(t).mean()

df['F_Stochastic'] = d
df['S_Stochastic'] = j

df_draw = df[-200:]

adps = []
adps.append(
    mpf.make_addplot(df_draw['F_Stochastic'], panel=1,type='line', ylabel='Stochastic'))
adps.append(
    mpf.make_addplot(df_draw['S_Stochastic'], panel=1,type='line', secondary_y=False))
adps.append(
    mpf.make_addplot(np.ones(len(df_draw)) * 0.2, panel=1,type='line', color='red', linestyle='dotted',secondary_y=False))
adps.append(
    mpf.make_addplot(np.ones(len(df_draw)) * 0.8, panel=1,type='line', color='red', linestyle='dotted',secondary_y=False))


fig, axs = mpf.plot(df_draw, style='charles', figratio=(4,3),figscale=1.5, addplot=adps, returnfig=True)

axs[2].legend(['F_Stochastic', 'S_Stochastic'])
plt.show()