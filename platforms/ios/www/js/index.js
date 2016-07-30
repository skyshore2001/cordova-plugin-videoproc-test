/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

///////////////////////////////////
var mediaRec = null;
var mediaPlay = null;
var recAudioName = "record";

function isIOS()
{
	return /iPhone|iPad/i.test(navigator.userAgent);
}
/*
@fn getRecFile(fn, doStartRec?=false)
@param fn Function(recAudioFile)
 */
function getRecFile(fn, doStartRec)
{
	var file;
	if (isIOS()) { // IOS
		var dirUrl = cordova.file.dataDirectory;
		var fileName = recAudioName + ".wav";
		file = dirUrl.replace('file://', '') + fileName;

		if (doStartRec) {
			// create the file
			resolveLocalFileSystemURL(dirUrl, function (dirEntry) {
				dirEntry.getFile(fileName, {create: true, exclusive: false}, function () {
					fn(file);
				});
			});
		}
		else {
			fn(file);
		}
	}
	else { // ANDOIRD
		file = cordova.file.externalDataDirectory + recAudioName + ".3gp";
		fn(file);
	}
}

function btnRecord_click(btn)
{
	getRecFile(record, mediaRec == null);

	function record(recAudioFile)
	{
		if (mediaRec == null) {
			mediaRec = new Media(recAudioFile,
				// success callback
				function() {
					console.log("recordAudio():Audio Success");
					txtAudio2.value = recAudioFile;
					alert('录音完成');
					endRecord();
				},

				// error callback
				function(err) {
					if (err.code === undefined)
						return;
					console.log(err);
					console.log("recordAudio():Audio Error: "+ err.code);
					alert('录音失败:' + err.code);
					endRecord();
				}
			);
			// Record audio
			mediaRec.startRecord();
			btn.innerHTML = "结束录音";
		}
		else {
			mediaRec.stopRecord();
		}
	}

	function endRecord()
	{
		mediaRec = null;
		btn.innerHTML = "开始录音";
	}
}

function btnSetRecAudio_click(btn)
{
	if (! confirm('部分IOS手机上在audio标签中播放wav音频会造成播放问题，是否继续? (可点直接播放听录音)'))
		return;
	audio2.src=txtAudio2.value;
	audio2.play(); 
}

function btnPlayRecAudio_click(btn)
{
	var audioFile2 = document.getElementById("txtAudio2").value;

	if (mediaPlay == null) {
		mediaPlay = new Media(audioFile2,
			function() {
				console.log("play media success");
				stop();
			},

			// error callback
			function(err) {
				if (err.code === undefined || err.code == 0)
					return;
				console.log(err);
				console.log("play media error: "+ err.code);
				alert('fail to play:' + err.code);
				stop();
			}
		);
		mediaPlay.play();
		btn.innerHTML = "Stop";
	}
	else {
		stop();
	}

	function stop()
	{
		if (mediaPlay) {
			mediaPlay.stop();
			mediaPlay = null;
		}
		btn.innerHTML = "Play";
	}
}

function extName(f)
{
	var n= f.lastIndexOf('.');
	if (n <= 0)
		return "";
	return f.substr(n);
}

function btnCompose_click(btn)
{
	alert('开始合成: 先下载视频、音频到本地');
    var videoUrl = document.getElementById("txtVideo").value;
    var audioUrl = document.getElementById("txtAudio").value;
	var audioFile2 = document.getElementById("txtAudio2").value;
	var n = 0;

	var dir = cordova.file.dataDirectory.replace('file://', '');
	var videoFile = dir + 'video' + extName(videoUrl);
	var audioFile = dir + 'audio' + extName(audioUrl);

	var ft = new FileTransfer();
	ft.download(videoUrl, videoFile, function (entry) {
		alert('down video ok: ' + videoFile);
		console.log(videoFile);
		++ n;
		onDownOk();
	}, onFileTransferFail);

	var ft2 = new FileTransfer();
	ft2.download(audioUrl, audioFile, function (entry) {
		alert('down audio ok: ' + audioFile);
		console.log(audioFile);
		++ n;
		onDownOk();
	}, onFileTransferFail);

	function onFileTransferFail(err)
	{
		alert('download error');
		console.log('download error');
		console.log(err);
	}

	function onDownOk()
	{
		if (n < 2)
			return;
		compose(videoFile, audioFile, audioFile2);
	}
}

function compose(videoFile, audioFile, audioFile2)
{
	alert('compose');
	var opt = {
		items: [
                {type: 'audio', value: audioFile,volume:0.05}, // 音频
			//{type: 'image', value: 'cdvfile://localhost/temporary/1.png'}, // 图片
			{type: 'text', value: '配音: 张三丰 - 网友-1', from: 1.0, to: -1.0, x: -20, y: -20}, // 文本

			{type: 'text', value: '配音: 张三丰 - 网友1', from: 1.0, to: 2.0, x: 20, y: 20}, // 文本
			{type: 'text', value: '配音: 张无忌 - 网友2', from: 2.0, to: 3.0, x: 40, y: 40}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友3', from: 2.1, to: 3.1, x: 42, y: 42}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友4', from: 2.2, to: 3.2, x: 44, y: 44}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友5', from: 2.3, to: 3.3, x: 46, y: 46}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友6', from: 2.4, to: 3.4, x: 48, y: 48}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友7', from: 2.5, to: 3.5, x: 50, y: 50}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友8', from: 2.6, to: 3.6, x: 52, y: 52}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友9', from: 2.7, to: 3.7, x: 54, y: 54}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友10', from: 2.8, to: 3.8, x: 56, y: 56}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友11', from: 2.9, to: 3.9, x: 58, y: 58}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友12', from: 3.0, to: 4.0, x: 60, y: 60}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友13', from: 3.1, to: 4.1, x: 62, y: 62}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友14', from: 3.2, to: 4.2, x: 64, y: 64}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友15', from: 3.3, to: 4.3, x: 66, y: 66}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友16', from: 3.4, to: 4.4, x: 68, y: 68}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友17', from: 3.5, to: 4.5, x: 70, y: 70}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友18', from: 3.6, to: 4.6, x: 72, y: 72}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友19', from: 3.7, to: 4.7, x: 74, y: 74}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友20', from: 3.8, to: 4.8, x: 76, y: 76}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友21', from: 3.9, to: 4.9, x: 78, y: 78}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友22', from: 4.0, to: 5.0, x: 80, y: 80}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友23', from: 4.1, to: 5.1, x: 82, y: 82}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友24', from: 4.2, to: 5.2, x: 84, y: 84}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友25', from: 4.3, to: 5.3, x: 86, y: 86}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友26', from: 4.4, to: 5.4, x: 88, y: 88}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友27', from: 4.5, to: 5.5, x: 90, y: 90}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友28', from: 4.6, to: 5.6, x: 92, y: 92}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友29', from: 4.7, to: 5.7, x: 94, y: 94}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友30', from: 4.8, to: 5.8, x: 96, y: 96}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友31', from: 4.9, to: 5.9, x: 98, y: 98}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友32', from: 5.0, to: 6.0, x: 100, y: 100}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友33', from: 5.1, to: 6.1, x: 102, y: 102}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友34', from: 5.2, to: 6.2, x: 104, y: 104}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友35', from: 5.3, to: 6.3, x: 106, y: 106}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友36', from: 5.4, to: 6.4, x: 108, y: 108}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友37', from: 5.5, to: 6.5, x: 110, y: 110}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友38', from: 5.6, to: 6.6, x: 112, y: 112}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友39', from: 5.7, to: 6.7, x: 114, y: 114}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友40', from: 5.8, to: 6.8, x: 116, y: 116}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友41', from: 5.9, to: 6.9, x: 118, y: 118}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友42', from: 6.0, to: 7.0, x: 120, y: 120}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友43', from: 6.1, to: 7.1, x: 122, y: 122}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友44', from: 6.2, to: 7.2, x: 124, y: 124}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友45', from: 6.3, to: 7.3, x: 126, y: 126}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友46', from: 6.4, to: 7.4, x: 128, y: 128}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友47', from: 6.5, to: 7.5, x: 130, y: 130}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友48', from: 6.6, to: 7.6, x: 132, y: 132}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友49', from: 6.7, to: 7.7, x: 134, y: 134}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友50', from: 6.8, to: 7.8, x: 136, y: 136}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友51', from: 6.9, to: 7.9, x: 138, y: 138}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友52', from: 7.0, to: 8.0, x: 140, y: 140}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友53', from: 7.1, to: 8.1, x: 142, y: 142}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友54', from: 7.2, to: 8.2, x: 144, y: 144}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友55', from: 7.3, to: 8.3, x: 146, y: 146}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友56', from: 7.4, to: 8.4, x: 148, y: 148}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友57', from: 7.5, to: 8.5, x: 150, y: 150}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友58', from: 7.6, to: 8.6, x: 152, y: 152}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友59', from: 7.7, to: 8.7, x: 154, y: 154}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友60', from: 7.8, to: 8.8, x: 156, y: 156}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友61', from: 7.9, to: 8.9, x: 158, y: 158}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友62', from: 8.0, to: 9.0, x: 160, y: 160}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友63', from: 8.1, to: 9.1, x: 162, y: 162}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友64', from: 8.2, to: 9.2, x: 164, y: 164}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友65', from: 8.3, to: 9.3, x: 166, y: 166}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友66', from: 8.4, to: 9.4, x: 168, y: 168}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友67', from: 8.5, to: 9.5, x: 170, y: 170}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友68', from: 8.6, to: 9.6, x: 172, y: 172}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友69', from: 8.7, to: 9.7, x: 174, y: 174}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友70', from: 8.8, to: 9.8, x: 176, y: 176}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友71', from: 8.9, to: 9.9, x: 178, y: 178}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友72', from: 9.0, to: 10.0, x: 180, y: 180}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友73', from: 9.1, to: 10.1, x: 182, y: 182}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友74', from: 9.2, to: 10.2, x: 184, y: 184}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友75', from: 9.3, to: 10.3, x: 186, y: 186}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友76', from: 9.4, to: 10.4, x: 188, y: 188}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友77', from: 9.5, to: 10.5, x: 190, y: 190}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友78', from: 9.6, to: 10.6, x: 192, y: 192}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友79', from: 9.7, to: 10.7, x: 194, y: 194}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友80', from: 9.8, to: 10.8, x: 196, y: 196}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友81', from: 9.9, to: 10.9, x: 198, y: 198}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友82', from: 10.0, to: 11.0, x: 200, y: 200}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友83', from: 10.1, to: 11.1, x: 202, y: 202}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友84', from: 10.2, to: 11.2, x: 204, y: 204}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友85', from: 10.3, to: 11.3, x: 206, y: 206}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友86', from: 10.4, to: 11.4, x: 208, y: 208}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友87', from: 10.5, to: 11.5, x: 210, y: 210}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友88', from: 10.6, to: 11.6, x: 212, y: 212}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友89', from: 10.7, to: 11.7, x: 214, y: 214}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友90', from: 10.8, to: 11.8, x: 216, y: 216}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友91', from: 10.9, to: 11.9, x: 218, y: 218}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友92', from: 11.0, to: 12.0, x: 220, y: 220}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友93', from: 11.1, to: 12.1, x: 222, y: 222}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友94', from: 11.2, to: 12.2, x: 224, y: 224}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友95', from: 11.3, to: 12.3, x: 226, y: 226}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友96', from: 11.4, to: 12.4, x: 228, y: 228}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友97', from: 11.5, to: 12.5, x: 230, y: 230}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友98', from: 11.6, to: 12.6, x: 232, y: 232}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友99', from: 11.7, to: 12.7, x: 234, y: 234}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友100', from: 11.8, to: 12.8, x: 236, y: 236}, // 文本2
			{type: 'text', value: '配音: 张无忌 - 网友101', from: 11.9, to: 12.9, x: 238, y: 238}, // 文本2
		],
		//replaceAudio: true,
        videoVolume : 0.01
	};

	if (audioFile2) {
        opt.items.push( {type: 'audio', value: audioFile2, volume: 1.5} ); // 录音
	}

	videoproc.compose(videoFile, opt, onSuccess, onFail);
	
	function onSuccess(file) {
		txtVideoResult.value = file;
		alert('合成完成');
		videoResult.src = file;
		videoResult.play();
		var media = document.getElementById('myVideo');
		media.src = 'file://' + file;
		media.play();
	}

	function onFail(msg) {
		alert('fail: ' + msg);
	}
}

