#include "Global.h"

bool httpGetJson(const char* url, NanCallback*  onProgress, NanCallback*  onDone) {
}

bool httpGet(const char* url, NanCallback*  onProgress, NanCallback*  onDone) {
	int _argc = 2;
	Handle<Value> _argv[2] = {};
	_argv[0] = NanNew<Int32>(100);
	_argv[1] = NanNew<Int32>(200);

	onProgress->Call(_argc, _argv);
	onDone->Call(_argc, _argv);
}

bool httpPost(const char* url, const char* data, NanCallback*  onProgress, NanCallback*  onDone) {
}

bool httpRequest(const char* url, const char* method, const char* header, const char* data, NanCallback*  onProgress, NanCallback*  onDone) {
}

int32_t setTimeout(int32_t duration, NanCallback*  onTimeout) {
}


int32_t globalGetNetworkTimeout()
{
}
void globalSetNetworkTimeout(int32_t networkTimeout)
{
}

