var count = 0;
function tick() {
//	print("tick:" + count++);
}

httpGet("http://www.baidu.com", function onProgress() {
	print("progress");
}, function onDone() {
	print("done");
});

var p = new Point();
p.x = 10;
p.y = 20;

print(p.x + "," + p.y);

p.move(20, 30);
print(p.x + "," + p.y);

p.add(20, 30);
print(p.x + "," + p.y);

print("================");

var p1 = new Point();
p1.copy(p);
print(p1.x + "," + p1.y);

