import requests
from bs4 import BeautifulSoup
import re
import pandas as pd
from tqdm import tqdm
import matplotlib.pyplot as plt
import time
import konlpy
from konlpy.tag import Okt
import numpy as np
import keras
from keras.layers import Embedding, Dense, LSTM
from keras.models import Sequential
from keras_preprocessing.sequence import pad_sequences
def dftoCsv(my_title_df, num):
    my_title_df.to_csv(('./article_datas/data'+f"_{keyword}_{now_time}"+'.csv'), sep=',', na_rep='NaN', encoding='utf-8')

    
now_time = time.strftime('%Y-%m-%d', time.localtime(time.time()))

#비트코인-----------------------------------------------------------------------------
bit_titles = []
bit_urls = []
keyword = "비트코인"
#pageNum = 1
for num in range(1, 70, 10):
  #print(f"{pageNum}페이지입니다.----------------")
  # pd 4 = 1일, pd 1 = 일주일, pd 2 = 1달
  response = requests.get(f"https://search.naver.com/search.naver?where=news&sm=tab_jum&query={keyword}&pd=4&start={num}")
  
  html = response.text
  soup = BeautifulSoup(html, 'html.parser')
  links = soup.select(".news_tit")
  for link in links:
    title = link.text
    url = link.attrs['href']
    clean_title = re.sub('[-=+,#/\?:^$.@*\"※~&%ㆍ·!』\\‘|\(\)\[\]\<\>`\'…\"\“”》]', '', title) 
    #print(clean_title,"\n", url, "\n")
    bit_titles.append(clean_title)
    bit_urls.append(url)
  #pageNum = pageNum + 1

positive = []
negative = []
bit_labels = []
    
with open("./words/negative_words_self.txt", encoding='utf-8') as neg:
  negative = neg.readlines()

negative = [neg.replace("\n", "") for neg in negative]

with open("./words/positive_words_self.txt", encoding='utf-8') as pos:
  positive = pos.readlines()

negative = [neg.replace("\n", "") for neg in negative]
positive = [pos.replace("\n", "") for pos in positive]

label = [0] * 4000

bit_title_dic = {"title":[], "label":label}

for title in tqdm(range(len(bit_titles))):
  negative_flag = False
  neutrality_flag = True
  
  label = 0
  for i in range(len(negative)):
    if negative[i] in bit_titles[title]:
      label = label-1
      negative_flag = True
      neutrality_flag = False
    
  for i in range(len(positive)):
    if positive[i] in bit_titles[title]:
      label = label + 1
      neutrality_flag = False
      negative_flag = False

  if (label==0):
    bit_labels.append("neut")
  elif label < 0:
    label = -1
    bit_labels.append("neg")
  elif label > 0:
    bit_labels.append("pos")

bit_title_df = pd.DataFrame({"title":bit_titles, "url":bit_urls, "label":bit_labels})
dftoCsv(bit_title_df, num)

#비트코인 끝--------------------------------------------------------------------------

#이더리움-----------------------------------------------------------------------------
eth_titles = []
eth_urls = []
keyword = "이더리움"
#pageNum = 1
for num in range(1, 70, 10):
  #print(f"{pageNum}페이지입니다.----------------")
  # pd 4 = 1일, pd 1 = 일주일, pd 2 = 1달
  response = requests.get(f"https://search.naver.com/search.naver?where=news&sm=tab_jum&query={keyword}&pd=4&start={num}")
  
  html = response.text
  soup = BeautifulSoup(html, 'html.parser')
  links = soup.select(".news_tit")
  for link in links:
    title = link.text
    url = link.attrs['href']
    clean_title = re.sub('[-=+,#/\?:^$.@*\"※~&%ㆍ·!』\\‘|\(\)\[\]\<\>`\'…\"\“”》]', '', title) 
    #print(clean_title,"\n", url, "\n")
    eth_titles.append(clean_title)
    eth_urls.append(url)
  #pageNum = pageNum + 1

eth_labels = []

label = [0] * 4000

eth_title_dic = {"title":[], "label":label}

for title in tqdm(range(len(eth_titles))):
  negative_flag = False
  neutrality_flag = True
  
  label = 0
  for i in range(len(negative)):
    if negative[i] in eth_titles[title]:
      label = label-1
      negative_flag = True
      neutrality_flag = False
    
  for i in range(len(positive)):
    if positive[i] in eth_titles[title]:
      label = label + 1
      neutrality_flag = False
      negative_flag = False

  if (label==0):
    eth_labels.append("neu")
  elif label < 0:
    label = -1
    eth_labels.append("neg")
  elif label > 0:
    eth_labels.append("pos")

eth_title_df = pd.DataFrame({"title":eth_titles, "url":eth_urls, "label":eth_labels})

dftoCsv(eth_title_df, num)
#이더리움 끝--------------------------------------------------------------------------

if __name__ == "__main__":

  bit_data = pd.read_csv(f'./article_datas/data_비트코인_{now_time}.csv')
  bit_data['label'].value_counts().plot(kind='bar')
  plt.savefig(f'./article_datas/graph/비트코인_{now_time}.png')

  eth_data = pd.read_csv(f'./article_datas/data_이더리움_{now_time}.csv')
  eth_data['label'].value_counts().plot(kind='bar')
  plt.savefig(f'./article_datas/graph/이더리움_{now_time}.png')
    

  print(bit_data.groupby('label').size().reset_index(name='count')) #train data = 비트코인
  print(eth_data.groupby('label').size().reset_index(name='count')) #test data = 이더리움

  stopwords = ['의', '가', '이', '은', '들', '는', '좀', '잘', '걍', '과', '도', '를', '으로', '자', '에', '와', '한', '하다']

  #okt 형태소 분석기 활용
  okt = Okt()
  X_train = []
  for sentence in bit_data['title']:
    temp_X = []
    temp_X = okt.morphs(sentence, stem=True) # 토큰화
    temp_X = [word for word in temp_X if not word in stopwords] # 불용어 제거
    X_train.append(temp_X)
      
  X_test = []
  for sentence in eth_data['title']:
    temp_X = []
    temp_X = okt.morphs(sentence, stem=True) # 토큰화
    temp_X = [word for word in temp_X if not word in stopwords] # 불용어 제거
    X_test.append(temp_X)
    
  y_train = []
  y_test = []

  #-1, 0, 1을 원핫인코딩
  for i in range(len(bit_data['label'])):
    if bit_data['label'].iloc[i] == 1:
      y_train.append([0, 0, 1])
    elif bit_data['label'].iloc[i] == 0:
      y_train.append([0, 1, 0])
    elif bit_data['label'].iloc[i] == -1:
      y_train.append([1, 0, 0])

  for i in range(len(eth_data['label'])):
    if eth_data['label'].iloc[i] == 1:
      y_test.append([0, 0, 1])
    elif eth_data['label'].iloc[i] == 0:
      y_test.append([0, 1, 0])
    elif eth_data['label'].iloc[i] == -1:
      y_test.append([1, 0, 0])

  y_train = np.array(y_train)
  y_test = np.array(y_test)

  #모델 생성
  max_len = 20 # 전체 데이터의 길이를 20로 맞춘다

  X_train = pad_sequences(X_train, maxlen=max_len)
  X_test = pad_sequences(X_test, maxlen=max_len)

  # -1, 0, 1 세가지로 분류하기 위해 LSTM, softmax, categorical corssentropy를 사용

  model = Sequential()
  model.add(Embedding(max_words, 100))
  model.add(LSTM(128))
  model.add(Dense(3, activation='softmax'))

  #optimizer는 adam을 선택
  model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
  history = model.fit(X_train, y_train, epochs=10, batch_size=10, validation_split=0.1)

  predict = model.predict(X_test)

  predict_labels = np.argmax(predict, axis=1)
  original_labels = np.argmax(y_test, axis=1)

  for i in range(30):
    print("기사제목 : ", eth_data['title'].iloc[i], "/\t 원래 라벨 : ", original_labels[i], "/\t예측한 라벨 : ", predict_labels[i])
  