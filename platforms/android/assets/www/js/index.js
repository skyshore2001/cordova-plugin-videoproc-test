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
var recAudioName = "record";

/*
@fn getRecFile(fn, doStartRec?=false)
@param fn Function(recAudioFile)
 */
function getRecFile(fn, doStartRec)
{
	var file;
	if (/iPhone|iPad/i.test(navigator.userAgent)) { // IOS
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

function btnCompose_click(btn)
{
	var videoFile = document.getElementById("txtVideo").value;
	var audioFile = document.getElementById("txtAudio").value;
	var audioFile2 = document.getElementById("txtAudio2").value;

	var opt = {
		items: [
			{type: 'audio', value: audioFile}, // 音频
			{type: 'image', value: 'cdvfile://localhost/temporary/1.png'}, // 图片
			{type: 'text', value: '配音: 张三丰 - 网友1', from: 15.0, to: 16.0, x: 120, y: 150}, // 文本
			{type: 'text', value: '配音: 张无忌 - 网友2', from: 16.0, to: 17.0, x: 120, y: 150} // 文本2
		]
	};
	if (audioFile2) {
		opt.items.push( {type: 'audio', value: audioFile2} ); // 录音
	}

	videoproc.compose(videoFile, opt, onSuccess, onFail);
	
	function onSuccess(file) {
		txtVideoResult.value = file;
		alert('合成完成');
		videoResult.src = file;
		videoResult.play();
	}

	function onFail(msg) {
		alert('fail: ' + msg);
	}
}

