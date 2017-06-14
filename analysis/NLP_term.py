# -*- coding: utf-8 -*- 
import re
import json
import copy
from collections import defaultdict
from progressbar import AnimatedMarker, Bar, BouncingBar, ETA, FileTransferSpeed, FormatLabel, Percentage, \
    ProgressBar, ReverseBar, RotatingMarker, \
    SimpleProgress, Timer

REG_EXP = (r'[a-zA-Z]')

class Members(object):
    """docstring for Members"""
    def __init__(self, datafile):
        super(Members, self).__init__()
        self.datafile = datafile

        # load member data
        with open(self.datafile) as jsonfile:
            self.data = json.load(jsonfile)

    def get_member_info_by_id(self, memberid):
        return self.data[memberid]

    def get_all_questions(self):
        questions = []
        for key, vals in self.data.items():
            for q in vals['question']:
                questions.append(q['message'])
        return questions
    
    def get_questions(self):
        for key, vals in self.data.items():
            for q in vals['question']:
                yield q['message']

    def get_question_info(self):
        for key, vals in self.data.items():
            for q in vals['question']:
                yield q

    def get_questions_count(self):
        count = 0
        for key, vals in self.data.items():
            for q in vals['question']:
                count += 1
        return count

    def get_member_info(self):
        for key, vals in self.data.items():
            yield key, vals

class Questions(Members):
    """docstring for Questions"""
    
    def get_question_dict(self):
        questions = defaultdict(defaultdict)
        for q in member.get_question_info():
            questions[q['id']]['memberid'] = q['memberid']
            questions[q['id']]['message'] = q['message']
            questions[q['id']]['reply'] = q['reply']['message']
        return questions

        

# filter those questions without letters
def filter_questions(member, outfile):
    member_data = {}
    pbar  = ProgressBar(widgets=[Percentage(), Bar()], maxval = len(member.data.keys())).start()
    index = 0
    for key, vals in member.get_member_info():
        question_list = [] # set question list empty
        for question in vals['question']:
            msg = question['message']
            msg = msg.replace('<br>', ' ')
            msg = msg.replace('<br/>', ' ')
            # check if the msg contains letters. If does, append it into member_data
            # otherwise, neglect
            if not re.search(REG_EXP, msg):
                continue
            question['message'] = msg

            # process the corresponding replies
            reply_list = []
            if 'reply' in question:
                for reply in question['reply']:
                    reply['message'] = reply['message'].replace('<br/>', ' ')
                    reply_list.append(reply)
            question['reply'] = reply_list
            question_list.append(question)
        vals['question'] = question_list
        member_data[key] = vals
        pbar.update(index+1)
        index += 1
    pbar.finish()

    with open(outfile, 'w') as jsonfile:
        json.dump(member_data, jsonfile)

if __name__ == '__main__':
    member = Members('member_data.json')
    outfile = 'member_data_filtered.json'
    filter_questions(member, outfile)
    

    