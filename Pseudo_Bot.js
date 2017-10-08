console.log("The bot is starting...");
console.log('');

//look at the link below for reference or questions
//involving twit:
//https://github.com/ttezel/twit

var Twit = require('twit');

//config is a file within the twitterbot folder.
var config = require('./config');

var T = new Twit(config);

var streamUser = T.stream('user');

function sendATweet(tweetSend) {

    //For some reason I can't collect metadata without a variable,
    //Need to look into this.
    var tweetText = tweetSend

    T.post('statuses/update', {status: tweetText}, function (err, data, response) {
        //console.log(data)
        console.log('Anonymous Tweet Sent...');
        console.log('Tweet Text: ' + data.text);
        console.log('Time (UTC) : ' + data.created_at);
        //debug data.statuses_count
        //potential debugging: var statusCount = data.statuses/update.statuses_count
        //potential debugging: console.log(statusCount)
        console.log('Status Count: ' + data.statuses_count);
        console.log('Tweet ID: ' + data.id);
        console.log('')
    })
}
//sendATweet('test')

streamUser.on('direct_message', messageRecieved);
console.log('Direct Message stream established...');
console.log('Follower stream established...');

//function streamConnection() {
    //console.log('Direct message stream in prorgess...')
    //console.log('follower stream in prorgess...')
//}

function messageRecieved(directMsg) {

    var msg = directMsg.direct_message.text;
    var screenName = directMsg.direct_message.sender.screen_name;
    //console.log(directMsg)
    console.log('Direct Message Recieved...');
    console.log('Content of Direct Message: ' + msg);
    console.log('Direct Message sent by(@handle): ' + screenName);
    console.log('');
    sendATweet(msg);
}

//1000*60*5 === 5 minutes
//setInterval(streamConnection,1000*60*5)

//To Do List:
//Setup a Follow stream that follows back
//Setup an Unfollow stream that unfollows back
//make the function messageRecieved only work if the user is following the bot

streamUser.on('follow', beingFollowed);

function beingFollowed(followerMsg){
    var friend = followerMsg.source.id;
    var screenName = followerMsg.source.screen_name;

    console.log('@' + followerMsg.source.screen_name + ' followed you!');
    console.log('Follower ID: ' + friend);
    console.log('Follower ScreenName: ' + screenName);

    T.post('friendships/create', {
        screen_name: screenName
    })

}

var upTime;
upTime = 0;
function timeRunning() {

    upTime = upTime + 1;
    console.log('Bot has been running for ' + upTime + 'hours...')
}

setInterval(timeRunning, 1000 * 60 * 60);

//Bug: fix input validation, Symbols (!@#$%^&*) are being tweeted weird.