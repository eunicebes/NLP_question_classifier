function init_quesion(){
	$.ajax({
		type:'GET',
        url: '/load_question',
        success:function(response){
        	for (var i = 0; i < response.length; i++){
        		$("#q_id").append($("<option></option>").attr("value", response[i]).text(response[i]));
        	}
        },
        error:function(error){
            console.log(error);
        }
	});
}
function resettext(id){
	if(id.value == ""){
		id.value = id.defaultValue;   
	}
}

function cleartext (id){ 
	id.value ="";
}
function get_question(){
	var question_id = $("#question_id").val();

	$.ajax({
		type:'POST',
	    url: '/get_probability',
	    data:JSON.stringify({
	    	'question_id': question_id
	    }),
	    contentType:"application/json",
	    datatype:'application/json',
	    success:function(response){
	      	var nb_predict = response['NB'];
	      	//console.log(nb_predict);
	      	var rf_predict = response['RF'];
	      	var svm_predict = response['SVM'];
	      	var lr_predict = response['LR'];
	      	var question = nb_predict['question']
	      	var reply = nb_predict['reply'];
	      	var nb_proba = [nb_predict['完成式'], nb_predict['進行式'], nb_predict['過去式'], nb_predict['未來式'], nb_predict['關係代名詞'], nb_predict['不定詞'], nb_predict['名詞子句'], nb_predict['被動'], nb_predict['介係詞'], nb_predict['連接詞'], nb_predict['假設語氣'], nb_predict['分詞'], nb_predict['其它']];
	      	var rf_proba = [rf_predict['完成式'], rf_predict['進行式'], rf_predict['過去式'], rf_predict['未來式'], rf_predict['關係代名詞'], rf_predict['不定詞'], rf_predict['名詞子句'], rf_predict['被動'], rf_predict['介係詞'], rf_predict['連接詞'], rf_predict['假設語氣'], rf_predict['分詞'], rf_predict['其它']];
	      	var svm_proba = [svm_predict['完成式'], svm_predict['進行式'], svm_predict['過去式'], svm_predict['未來式'], svm_predict['關係代名詞'], svm_predict['不定詞'], svm_predict['名詞子句'], svm_predict['被動'], svm_predict['介係詞'], svm_predict['連接詞'], svm_predict['假設語氣'], svm_predict['分詞'], svm_predict['其它']];
	      	var lr_proba = [lr_predict['完成式'], lr_predict['進行式'], lr_predict['過去式'], lr_predict['未來式'], lr_predict['關係代名詞'], lr_predict['不定詞'], lr_predict['名詞子句'], lr_predict['被動'], lr_predict['介係詞'], lr_predict['連接詞'], lr_predict['假設語氣'], lr_predict['分詞'], lr_predict['其它']];
	      	$('#question_text').text(question);
	      	$('#reply_text').text(reply);
	      	
	      	load_proba_charts(nb_proba, rf_proba, svm_proba, lr_proba);
	    },
	    error:function(error){
	      	console.log(error);
	    }
	});
}
function get_question_text(){
	var question_text = $("#question_text").val();
	$.ajax({
		type:'POST',
	    url: 'http://127.0.0.1:5000/predict_question',
	    data:JSON.stringify({
	    	'question': question_text
	    }),
	    contentType:"application/json",
	    datatype:'application/json',
	    success:function(response){
	      	// console.log(response);
	      	var nb_predict = response['NB'];
	      	var rf_predict = response['RF'];
	      	var svm_predict = response['SVM'];
	      	var lr_predict = response['LR'];
	      	//console.log(svm_predict);
	      	var nb_proba = [nb_predict['完成式'], nb_predict['進行式'], nb_predict['過去式'], nb_predict['未來式'], nb_predict['關係代名詞'], nb_predict['不定詞'], nb_predict['名詞子句'], nb_predict['被動'], nb_predict['介係詞'], nb_predict['連接詞'], nb_predict['假設語氣'], nb_predict['分詞'], nb_predict['其它']];
	      	var rf_proba = [rf_predict['完成式'], rf_predict['進行式'], rf_predict['過去式'], rf_predict['未來式'], rf_predict['關係代名詞'], rf_predict['不定詞'], rf_predict['名詞子句'], rf_predict['被動'], rf_predict['介係詞'], rf_predict['連接詞'], rf_predict['假設語氣'], rf_predict['分詞'], rf_predict['其它']];
	      	var svm_proba = [svm_predict['完成式'], svm_predict['進行式'], svm_predict['過去式'], svm_predict['未來式'], svm_predict['關係代名詞'], svm_predict['不定詞'], svm_predict['名詞子句'], svm_predict['被動'], svm_predict['介係詞'], svm_predict['連接詞'], svm_predict['假設語氣'], svm_predict['分詞'], svm_predict['其它']];
	      	var lr_proba = [lr_predict['完成式'], lr_predict['進行式'], lr_predict['過去式'], lr_predict['未來式'], lr_predict['關係代名詞'], lr_predict['不定詞'], lr_predict['名詞子句'], lr_predict['被動'], lr_predict['介係詞'], lr_predict['連接詞'], lr_predict['假設語氣'], lr_predict['分詞'], lr_predict['其它']];
	      	load_proba_charts(nb_proba, rf_proba, svm_proba, lr_proba);
	    },
	    error:function(error){
	      	console.log(error);
	    }
	});
}
function load_proba_charts(nb_proba, rf_proba, svm_proba, lr_proba){
	$(".classify_chart").show();
	var naive_proba = nb_proba;
	var ctx_naive = $("#naive_bayes");
	var data_naive = {
        labels: ["完成式", "進行式", "過去式", "未來式", "關係代名詞", "不定詞", "名詞子句", "被動", "介系詞", "連接詞", "假設語氣", "分詞", "其他"],
        datasets: [
            {
                label: "Naive Bayes",
                backgroundColor: ["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(255, 99, 132, 0.2)"],
                borderColor: ["rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(255, 99, 132)"],
                borderWidth: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                data: naive_proba
            },
        ]
    };
    var options = {
    	scales: {
    		yAxes: [{
		      	scaleLabel: {
		        	display: true,
		        	labelString: 'probability'
		      	},
		      	ticks: {
                    beginAtZero: true,
                    steps: 0.1,
                    max: 1
                }
		    }]
    	},
        legend: {
            display: true,
            labels: {
                fontSize: 18
            }
        },
        maintainAspectRatio: true
    }
	var BarChart_naive = new Chart(ctx_naive, {
	    type: 'bar',
	    data: data_naive,
	    options: options
	});

	var random_proba = rf_proba;
	var ctx_random = $("#random_forest");
	var data_random = {
        labels: ["完成式", "進行式", "過去式", "未來式", "關係代名詞", "不定詞", "名詞子句", "被動", "介系詞", "連接詞", "假設語氣", "分詞", "其他"],
        datasets: [
            {
                label: "Random Forest",
                backgroundColor: ["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(255, 99, 132, 0.2)"],
                borderColor: ["rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(255, 99, 132)"],
                borderWidth: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                data: random_proba
            },
        ]
    };
    
	var BarChart_random = new Chart(ctx_random, {
	    type: 'bar',
	    data: data_random,
	    options: options
	});

	var svm_proba = svm_proba;
	var ctx_svm = $("#svm");
	var data_svm = {
        labels: ["完成式", "進行式", "過去式", "未來式", "關係代名詞", "不定詞", "名詞子句", "被動", "介系詞", "連接詞", "假設語氣", "分詞", "其他"],
        datasets: [
            {
                label: "SVM",
                backgroundColor: ["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(255, 99, 132, 0.2)"],
                borderColor: ["rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(255, 99, 132)"],
                borderWidth: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                data: svm_proba
            },
        ]
    };
    
	var BarChart_svm = new Chart(ctx_svm, {
	    type: 'bar',
	    data: data_svm,
	    options: options
	});

	var lr_proba = lr_proba;
	var ctx_lr = $("#lr");
	var data_lr = {
        labels: ["完成式", "進行式", "過去式", "未來式", "關係代名詞", "不定詞", "名詞子句", "被動", "介系詞", "連接詞", "假設語氣", "分詞", "其他"],
        datasets: [
            {
                label: "Logistic Regression",
                backgroundColor: ["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(255, 99, 132, 0.2)"],
                borderColor: ["rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(255, 99, 132)"],
                borderWidth: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                data: lr_proba
            },
        ]
    };
    
	var BarChart_lr = new Chart(ctx_lr, {
	    type: 'bar',
	    data: data_lr,
	    options: options
	});
}
