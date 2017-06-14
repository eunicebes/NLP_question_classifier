import jieba
import numpy as np
from sklearn.externals import joblib

Grammar = {'1': '完成式', '2': '進行式', '3': '過去式', '4': '未來式', '5': '關係代名詞', '6': '不定詞', '7': '名詞子句', '8': '被動', '9': '介係詞', \
           '10': '連接詞', '11': '假設語氣', '12': '分詞', '13': 'PT', '0': '其它'}
STOPWORDS = ['什麼', '請問', '這裡', '不是', '意思', '這邊', '謝謝', '這句', '為何', '使用', '怎麼', '要加', '老師', '還是', '如何', '甚麼', '一下', '這個', '這樣', '問為', '因為', '何要', '用過', '是不是', '一個', '應該', '直接', '好像', '如果', '何不', '兩個', '這是', '何用', '需要', '時候', '所以', '您好', '起來', '還有', '加上', '寫成', '你好', '此句', '有點', '問此', '不好意思', '不到', '像是', '這裏', '為什麼']
vectorizer = joblib.load('../classifier/tfidf.pkl')
NB = joblib.load('../classifier/NB_classifier.pkl')
RF = joblib.load('../classifier/RF_classifier.pkl')
svm = joblib.load('../classifier/svc_classifier.pkl')
LR = joblib.load('../classifier/LR_classifier.pkl')


def cut_questions(data):
	corpus = []
	segs = jieba.cut(data, cut_all=False)
	final = [seg for seg in segs if seg not in STOPWORDS]
	corpus.append(' '.join(final))
	return corpus

def transform_feature(text):
	corpus = cut_questions(text)
	features = vectorizer.transform(corpus)
	return features

def nb_classifier(features):
	y_predict_proba = NB.predict_proba(features)
	nb_cat = [Grammar[item] for item in NB.classes_]
	# print (NB.classes_)
	nb_probability = {}
	for i in range(0, len(y_predict_proba[0]), 1):
		nb_probability[nb_cat[i]] = y_predict_proba[0][i]
	return nb_probability

def rf_classifier(features):
	y_predict_proba = RF.predict_proba(features)
	rf_cat = [Grammar[item] for item in RF.classes_]
	# print (RF.classes_)
	rf_probability = {}
	for i in range(0, len(y_predict_proba[0]), 1):
		rf_probability[rf_cat[i]] = y_predict_proba[0][i]
	return rf_probability

def svm_classifier(features):
	y_predict_type = svm.predict(features)
	# print (y_predict_type)
	svm_probability = {}
	for i in range(0, 14, 1):
		if str(i) == y_predict_type[0]:
			svm_probability[Grammar[str(i)]] = 1
		else:
			svm_probability[Grammar[str(i)]] = 0

	return svm_probability

def lr_classifier(features):
	y_predict_proba = LR.predict_proba(features)
	lr_cat = [Grammar[item] for item in LR.classes_]
	lr_probability = {}
	for i in range(0, len(y_predict_proba[0]), 1):
		lr_probability[lr_cat[i]] = y_predict_proba[0][i]
	return lr_probability



