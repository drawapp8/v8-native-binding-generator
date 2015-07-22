var count = 0;
function tick() {
//	print("tick:" + count++);
}

httpGet("http://www.baidu.com", function onProgress() {
	print("progress");
}, function onDone() {
	print("done");
});
