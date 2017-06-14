function init_student(){
	$.ajax({
		type:'GET',
        url: 'http://127.0.0.1:5000/load_student',
        success:function(response){
            // alert(response.length);
        	for (var i = 0; i < response.length; i++){
        		$("#m_id").append($("<option></option>").attr("value", response[i]).text(response[i]));
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
function get_student(){
    var member_id = $("#member_id").val();

    $.ajax({
        type:'POST',
        url: 'http://127.0.0.1:5000/get_count',
        data:JSON.stringify({
            'member_id': member_id
        }),
        contentType:"application/json",
        datatype:'application/json',
        success:function(response){
            var questions = response['questions'];
            // console.log(questions);
            var nb_student = response['NB'];
            var rf_student = response['RF'];
            var svm_student = response['SVM'];
            var lr_student = response['LR'];
            var nb_count = [nb_student['完成式'], nb_student['進行式'], nb_student['過去式'], nb_student['未來式'], nb_student['關係代名詞'], nb_student['不定詞'], nb_student['名詞子句'], nb_student['被動'], nb_student['介係詞'], nb_student['連接詞'], nb_student['假設語氣'], nb_student['分詞'], nb_student['其它']];
            var rf_count = [rf_student['完成式'], rf_student['進行式'], rf_student['過去式'], rf_student['未來式'], rf_student['關係代名詞'], rf_student['不定詞'], rf_student['名詞子句'], rf_student['被動'], rf_student['介係詞'], rf_student['連接詞'], rf_student['假設語氣'], rf_student['分詞'], rf_student['其它']];
            var svm_count = [svm_student['完成式'], svm_student['進行式'], svm_student['過去式'], svm_student['未來式'], svm_student['關係代名詞'], svm_student['不定詞'], svm_student['名詞子句'], svm_student['被動'], svm_student['介係詞'], svm_student['連接詞'], svm_student['假設語氣'], svm_student['分詞'], svm_student['其它']];
            var lr_count = [lr_student['完成式'], lr_student['進行式'], lr_student['過去式'], lr_student['未來式'], lr_student['關係代名詞'], lr_student['不定詞'], lr_student['名詞子句'], lr_student['被動'], lr_student['介係詞'], lr_student['連接詞'], lr_student['假設語氣'], lr_student['分詞'], lr_student['其它']];
            load_full_questions(questions);
            load_count_charts(nb_count, rf_count, svm_count, lr_count);
        },
        error:function(error){
            console.log(error);
        }
    });
}
function load_full_questions(questions){
    $(".show_question").show();
    $('#demo').empty();
    question_ary = questions;
    for (var i = 0; i < question_ary.length; i++){
        $('#demo').append('<div>'+ (i+1).toString() + '. ' + question_ary[i] + '</div>');
    }
}
function load_count_charts(nb_count, rf_count, svm_count, lr_count){
    $(".classify_chart").show();
    var naive_count = nb_count;
    for (var i = 0; i < naive_count.length; i++){
        if (naive_count[i] == undefined){
            naive_count[i] = 0;
        }
    }
    var naive_upper = (Math.ceil((Math.max.apply(Math, naive_count))/10))*10; 
    var ctx_naive = $("#naive_bayes");
    var data_naive = {
        labels: ["完成式", "進行式", "過去式", "未來式", "關係代名詞", "不定詞", "名詞子句", "被動", "介系詞", "連接詞", "假設語氣", "分詞", "其他"],
        datasets: [
            {
                label: "Naive Bayes",
                backgroundColor: ["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(255, 99, 132, 0.2)"],
                borderColor: ["rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(255, 99, 132)"],
                borderWidth: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                data: naive_count
            },
        ]
    };
    var options_naive = {
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'count'
                },
                ticks: {
                    beginAtZero: true,
                    max: naive_upper
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
        options: options_naive
    });

    var random_count = rf_count;
    for (var i = 0; i < random_count.length; i++){
        if (random_count[i] == undefined){
            random_count[i] = 0;
        }
    }
    var random_upper = (Math.ceil((Math.max.apply(Math, random_count))/10))*10; 
    var ctx_random = $("#random_forest");
    var data_random = {
        labels: ["完成式", "進行式", "過去式", "未來式", "關係代名詞", "不定詞", "名詞子句", "被動", "介系詞", "連接詞", "假設語氣", "分詞", "其他"],
        datasets: [
            {
                label: "Random Forest",
                backgroundColor: ["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(255, 99, 132, 0.2)"],
                borderColor: ["rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(255, 99, 132)"],
                borderWidth: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                data: random_count
            },
        ]
    };

    var options_random = {
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'count'
                },
                ticks: {
                    beginAtZero: true,
                    max: random_upper
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
    var BarChart_random = new Chart(ctx_random, {
        type: 'bar',
        data: data_random,
        options: options_random
    });

    var svm_count = svm_count;
    for (var i = 0; i < svm_count.length; i++){
        if (svm_count[i] == undefined){
            svm_count[i] = 0;
        }
    }
    var svm_upper = (Math.ceil((Math.max.apply(Math, svm_count))/10))*10;
    var ctx_svm = $("#svm");
    var data_svm = {
        labels: ["完成式", "進行式", "過去式", "未來式", "關係代名詞", "不定詞", "名詞子句", "被動", "介系詞", "連接詞", "假設語氣", "分詞", "其他"],
        datasets: [
            {
                label: "SVM",
                backgroundColor: ["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(255, 99, 132, 0.2)"],
                borderColor: ["rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(255, 99, 132)"],
                borderWidth: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                data: svm_count
            },
        ]
    };
    var options_svm = {
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'count'
                },
                ticks: {
                    beginAtZero: true,
                    max: svm_upper
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
    var BarChart_svm = new Chart(ctx_svm, {
        type: 'bar',
        data: data_svm,
        options: options_svm
    });

    var lr_count = lr_count;
    for (var i = 0; i < lr_count.length; i++){
        if (lr_count[i] == undefined){
            lr_count[i] = 0;
        }
    }
    var lr_upper = (Math.ceil((Math.max.apply(Math, lr_count))/10))*10;
    var ctx_cnn = $("#cnn");
    var data_cnn = {
        labels: ["完成式", "進行式", "過去式", "未來式", "關係代名詞", "不定詞", "名詞子句", "被動", "介系詞", "連接詞", "假設語氣", "分詞", "其他"],
        datasets: [
            {
                label: "Logistic Regression",
                backgroundColor: ["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(255, 99, 132, 0.2)"],
                borderColor: ["rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(255, 99, 132)"],
                borderWidth: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                data: lr_count
            },
        ]
    };
    var options_lr = {
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'count'
                },
                ticks: {
                    beginAtZero: true,
                    max: lr_upper
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
    var BarChart_cnn = new Chart(ctx_cnn, {
        type: 'bar',
        data: data_cnn,
        options: options_lr
    });
}