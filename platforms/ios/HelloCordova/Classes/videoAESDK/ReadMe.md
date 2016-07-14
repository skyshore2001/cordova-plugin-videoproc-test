#	音视频合成
##	接口
```
function testit()
{
    var videoFile = document.getElementById("txtVideo").value;
    var audioFile = document.getElementById("txtAudio").value;
	var opt = {
		items: [
			{type: 'audio', value: audioFile}, // 音频
			{type: 'image', value: 'cdvfile://localhost/temporary/1.png'}, // 图片
			{type: 'text', value: '配音: 张三丰 - 网友1', from: 15.0, to: 16.0, x: 120, y: 150}, // 文本
			{type: 'text', value: '配音: 张无忌 - 网友2', from: 16.0, to: 17.0, x: 120, y: 150} // 文本2
		]
	};

	videoproc.compose(videoFile, opt, onSuccess, onFail);
	
	function onSuccess(file) {
		alert('generate file: ' + file);
	}

	function onFail(msg) {
		alert('fail: ' + msg);
	}
}
```