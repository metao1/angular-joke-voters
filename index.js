var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
var http = require('http');
var app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
/*
 var port = 5000;
 var api_port = 5001;
 */
app.set('port', (process.env.PORT || 5000));

var data = [{
    "id": "0",
    "DisplayName": "Mehrdad",
    "Idea": "Why is our government not in a hurry to land our men on the moon?We’re answering: “What if they refuse to return?”",
    "comments": [{"value": "hahahah"}, {"value": "lol"}],
    "show": false,
    "average": 20,
    "VoteUp": {"value": 24, "disabled": false},
    "VoteDown": {"value": 4, "disabled": false}
}, {
    "id": "1",
    "DisplayName": "French",
    "Idea": "Raise your right hand if you like the French ... raise both hands if you are French.",
    "comments": [{"value": "Great!"}, {"value": ":))"}],
    "show": false,
    "average": 21,
    "VoteUp": {"value": 25, "disabled": false},
    "VoteDown": {"value": 4, "disabled": false}
}, {
    "id": "2",
    "DisplayName": "Ali",
    "Idea": "Is it true that American skyscrapers are the tallest in the world?We’re answering: “Yes, it's true, but on the other hand the Soviet-made transistors are the largest in the world.”",
    "comments": [{"value": "yes!"}, {"value": "hahahaha"}, {"value": "lol"}],
    "show": false,
    "average": 7,
    "VoteUp": {"value": 11, "disabled": false},
    "VoteDown": {"value": 4, "disabled": false}
}, {
    "id": 3,
    "DisplayName": "زیبا",
    "Idea": "مورد داشتیم دختره رفته تو گوگل سرچ کرده : اسم اون پسری که نزدیک مدرسه مون مغازه داره چیه؟!! گوگل جواب داده برو درستو بخون دو شنبه امتحان فارسی داری!",
    "comments": [],
    "show": false,
    "VoteUp": {"value": 0, "disabled": false},
    "VoteDown": {"value": 0, "disabled": false}
}, {
    "id": 4,
    "DisplayName": "ziba",
    "Idea": "یخچال خونمون موقع روشن شدن جوری صدا میده انگار یخای قطب شمال کار اینه ! حالا درشو باز میکنی پشه ها توش دارن آفتاب میگیرن !",
    "comments": [{"value": "یخچال شما چند؟"}],
    "show": false,
    "VoteUp": {"value": 2, "disabled": false},
    "VoteDown": {"value": 0, "disabled": false},
    "average": 2
}, {
    "id": 5,
    "DisplayName": "مهدی",
    "Idea": "بابای من هر چند وقت یبار همینجوری وقتی همه نشستن یهو به یکی میگه یه لیوان آب بیار که ببینه هنوزم تو خونه حساب میبریم ازش یا نه",
    "comments": [{"value": "حقته خخخخخ"}],
    "show": false,
    "VoteUp": {"value": 1, "disabled": false},
    "VoteDown": {"value": 0, "disabled": false},
    "average": 1
}, {
    "id": 6,
    "DisplayName": "Geek",
    "Idea": "A computer once beat me at chess, but it was no match for me at kick boxing.",
    "comments": [],
    "show": false,
    "VoteUp": {"value": 1, "disabled": false},
    "VoteDown": {"value": 0, "disabled": false},
    "average": 1
}, {
    "id": 7,
    "DisplayName": "Geek",
    "Idea": "A client called my help desk saying she couldn’t send an e-mail. When I was done troubleshooting the problem, she interrupted me to ask, “Wait a minute, do I type @ in lower or uppercase?”",
    "comments": [{"value": "dasdas"}],
    "show": false,
    "VoteUp": {"value": 0, "disabled": false},
    "VoteDown": {"value": 1, "disabled": false},
    "average": -1
}, {
    "id": 8,
    "DisplayName": "Geek",
    "Idea": "A company owner was asked a question, \"How do you motivate your employees to be so punctual?\"   He smiled & replied, \"It's simple. I have 30 employees and 29 free parking spaces. One is paid parking.\"",
    "comments": [],
    "show": false,
    "VoteUp": {"value": 1, "disabled": false},
    "VoteDown": {"value": 0, "disabled": false},
    "average": 1
}];
app.use(express.static(path.join(__dirname, 'client')));
var http_server = http.Server(app);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/allvotes', function (req, res) {
    var json = JSON.stringify(data);
    res.status(200).send(json);
});

app.post('/vote', function (req, res) {
    if (!req.body || !req.body.DisplayName || !req.body.Idea) {
        return res.status(403).send('unauthorized');
    }
    var displayName = req.body.DisplayName;
    var idea = req.body.Idea;
    var info = null;
    if (displayName && idea && data.length < 1001) {
        info = {
            "id": data.length,
            "DisplayName": displayName,
            "Idea": idea,
            "comments": [],
            "show": false,
            "VoteUp": {"value": 0, "disabled": false},
            "VoteDown": {"value": 0, "disabled": false}
        };
        data.push(info);
    }
    var json = JSON.stringify(info);
    res.status(200).send(json);
});

app.post('/voteup', function (req, res) {
    if (!req.body || !req.body.id) {
        return res.status(403).send('unauthorized');
    }
    var id = req.body.id;
    if (data[id].VoteUp.value >= 0) {
        data[id].VoteUp.value += 1;
        data[id].average = (parseInt(data[id].VoteUp.value) - parseInt(data[id].VoteDown.value));
    }
    var json = JSON.stringify(data[id]);
    res.status(200).send(json);
});

app.post('/votedown', function (req, res) {
    if (!req.body || !req.body.id) {
        return res.status(403).send('unauthorized');
    }
    var id = req.body.id;
    if (data[id].VoteDown.value >= 0) {
        data[id].VoteDown.value += 1;
        data[id].average = (parseInt(data[id].VoteUp.value) - parseInt(data[id].VoteDown.value));
    }
    var json = JSON.stringify(data[id]);
    res.status(200).send(json);
});
app.post('/comment', function (req, res) {
    if (!req.body || !req.body.id || !req.body.value) {
        return res.status(403).send('unauthorized');
    }
    var comment = req.body.value;
    var id = req.body.id;
    if (data[id]) {
        data[id].comments.push({"value": comment});
    }
    var json = JSON.stringify(data[id]);
    res.status(200).send(json);
});
http_server.listen(app.get('port'), function () {
    console.log('App is running on port', app.get('port'));
});

/*

 var apiServer = http.createServer(function (req, res) {

 try {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Request-Method', '*');
 res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET ,POST');
 res.setHeader('Access-Control-Allow-Headers', '*');
 res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
 res.writeHead(200, {'Content-Type': 'application/json'});
 if (req.method == 'GET') {
 if (req.url == '/allvotes') {
 */
/*data.sort(function (a, b) {
 return parseInt(b.average) - parseInt(a.average);
 });*//*

 var json = JSON.stringify(data);
 return res.end(json);
 } else {
 return res.end("{code: 'unauthorized'}");
 }
 } else if (req.method == 'POST') {
 var body = '';
 req.on('data', function (data) {
 body += data;
 });
 req.on('end', function () {
 if (!body) return;
 if (req.url == "/vote") {
 body = body.replace("{", "").replace("}", "").replace("\"", "");
 var displaySt = body.split(',')[0];
 var displayName = displaySt.split(':')[1];
 var ideaSt = body.split(',')[1];
 var idea = ideaSt.split(':')[1];
 if (displayName && idea && data.length < 1001) {
 var info = {
 "id": data.length,
 "DisplayName": displayName,
 "Idea": idea,
 "comments": [],
 "show": false,
 "VoteUp": {"value": 0, "disabled": false},
 "VoteDown": {"value": 0, "disabled": false}
 };
 data.push(info);
 }
 var json = JSON.stringify(info);
 return res.end(json);
 } else if (req.url == '/voteup') {
 if (data[body].VoteUp.value >= 0) {
 data[body].VoteUp.value += 1;
 data[body].average = (parseInt(data[body].VoteUp.value) - parseInt(data[body].VoteDown.value));
 }
 var json = JSON.stringify(data[body]);
 return res.end(json);
 } else if (req.url == '/votedown') {
 if (data[body].VoteDown.value >= 0) {
 data[body].VoteDown.value += 1;
 data[body].average = (parseInt(data[body].VoteUp.value) - parseInt(data[body].VoteDown.value));
 }
 var json = JSON.stringify(data[body]);
 return res.end(json);
 } else if (req.url == '/comment') {
 body = body.replace("{", "").replace("}", "").replace("\"", "");
 var idSt = body.split(',')[0];
 var id = idSt.split(':')[1].replace("\"", "").replace("\"", "");
 var commentSt = body.split(',')[1];
 var comment = commentSt.split(':')[1].replace("\"", "").replace("\"", "");
 if (data[id]) {
 data[id].comments.push({"value": comment});
 }
 var json = JSON.stringify(data[id]);
 return res.end(json);
 } else {
 return res.end("{code: 'unauthorized'}");
 }
 });
 } else {
 return res.end("{code: 'unauthorized'}");
 }
 } catch (e) {
 console.log(e);
 return res.end("{code: 'machine error'}");
 }
 });
 apiServer.listen(api_port);*/
