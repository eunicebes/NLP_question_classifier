import json, csv
from flask import Flask, render_template, jsonify, request
from collections import defaultdict
import predict
app = Flask(__name__)

def load_json_file(filename):
	with open('../predicted/{0}'.format(filename)) as data_file:
		json_data = json.load(data_file)
	return json_data

@app.route('/')
def load_index_page():
    return render_template('index.html')

@app.route('/load_question', methods=['GET'])
def load_question():
	with open('../data/{0}'.format('questions_nondup_dup.csv')) as data_file:
		question_id = [row['question_id'] for row in csv.DictReader(data_file) if row['type'] != '13']

		return jsonify(question_id)

@app.route('/load_student', methods=['GET'])
def load_student():
	member_id = [key for key, item in NB_STUDENT.items()]

	return jsonify(member_id)

@app.route('/student')
def load_student_page():
    return render_template('student.html')

@app.route('/search')
def load_search_page():
    return render_template('search.html')

@app.route('/get_probability', methods=['POST'])
def get_probability():
	question_id = request.json['question_id']
	#print (SVM_PREDICT[str(question_id)])

	return jsonify({'NB': NB_PREDICT[str(question_id)], 'RF': RF_PREDICT[str(question_id)], 'SVM': SVM_PREDICT[str(question_id)], 'LR': LR_PREDICT[str(question_id)]})

@app.route('/get_count', methods=['POST'])
def get_count():
	member_id = request.json['member_id'] 
	return jsonify({'questions': FULL_QUESTION[str(member_id)], 'NB': NB_STUDENT[str(member_id)], 'RF': RF_STUDENT[str(member_id)], 'SVM': SVM_STUDENT[str(member_id)], 'LR': LR_STUDENT[str(member_id)]})

@app.route('/predict_question', methods=['POST'])
def predict_question():
	question = request.json['question']
	features = predict.transform_feature(question)

	nb_result = predict.nb_classifier(features)
	rf_result = predict.rf_classifier(features)
	svm_result = predict.svm_classifier(features)
	# print (svm_result)
	lr_result = predict.lr_classifier(features)

	return jsonify({'NB': nb_result, 'RF': rf_result, 'SVM': svm_result, 'LR': lr_result})

if __name__ == '__main__':
    NB_PREDICT = load_json_file('NB_predict.json')
    NB_STUDENT = load_json_file('NB_student.json')
    RF_PREDICT = load_json_file('RF_predict.json')
    RF_STUDENT = load_json_file('RF_student.json')
    SVM_PREDICT = load_json_file('SVM_predict.json')
    SVM_STUDENT = load_json_file('SVM_student.json')
    LR_PREDICT = load_json_file('LR_predict.json')
    LR_STUDENT = load_json_file('LR_student.json')

    FULL_QUESTION = defaultdict(list)
    with open('../data/{0}'.format('questions_nondup_dup.csv')) as data_file:
    	for row in csv.DictReader(data_file):
    		if row['type'] != '13':
    			FULL_QUESTION[row['member_id']].append(row['question'])

    app.run()
