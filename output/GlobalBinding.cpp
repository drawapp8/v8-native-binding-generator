#include "console.h"
#include "Global.h"

NAN_METHOD(wrapHttpGetJson) {
	NanScope();
	if(args.Length() < 3) {
		LOGI("invalid arguments for httpGetJson.\n");
		return;
	}

	v8::String::Utf8Value url(args[0]);
	NanCallback* onProgress = new NanCallback(args[1].As<Function>());
	NanCallback* onDone = new NanCallback(args[2].As<Function>());

	bool retVal = httpGetJson(*url, onProgress, onDone);
	NanReturnValue(NanNew<Boolean>(retVal));
}

NAN_METHOD(wrapHttpGet) {
	NanScope();
	if(args.Length() < 3) {
		LOGI("invalid arguments for httpGet.\n");
		return;
	}

	v8::String::Utf8Value url(args[0]);
	NanCallback* onProgress = new NanCallback(args[1].As<Function>());
	NanCallback* onDone = new NanCallback(args[2].As<Function>());

	bool retVal = httpGet(*url, onProgress, onDone);
	NanReturnValue(NanNew<Boolean>(retVal));
}

NAN_METHOD(wrapHttpPost) {
	NanScope();
	if(args.Length() < 4) {
		LOGI("invalid arguments for httpPost.\n");
		return;
	}

	v8::String::Utf8Value url(args[0]);
	v8::String::Utf8Value data(args[1]);
	NanCallback* onProgress = new NanCallback(args[2].As<Function>());
	NanCallback* onDone = new NanCallback(args[3].As<Function>());

	bool retVal = httpPost(*url, *data, onProgress, onDone);
	NanReturnValue(NanNew<Boolean>(retVal));
}

NAN_METHOD(wrapHttpRequest) {
	NanScope();
	if(args.Length() < 6) {
		LOGI("invalid arguments for httpRequest.\n");
		return;
	}

	v8::String::Utf8Value url(args[0]);
	v8::String::Utf8Value method(args[1]);
	v8::String::Utf8Value header(args[2]);
	v8::String::Utf8Value data(args[3]);
	NanCallback* onProgress = new NanCallback(args[4].As<Function>());
	NanCallback* onDone = new NanCallback(args[5].As<Function>());

	bool retVal = httpRequest(*url, *method, *header, *data, onProgress, onDone);
	NanReturnValue(NanNew<Boolean>(retVal));
}

NAN_METHOD(wrapSetTimeout) {
	NanScope();
	if(args.Length() < 2) {
		LOGI("invalid arguments for setTimeout.\n");
		return;
	}

	int32_t duration = args[0]->Int32Value();
	NanCallback* onTimeout = new NanCallback(args[1].As<Function>());

	int32_t retVal = setTimeout(duration, onTimeout);
	NanReturnValue(NanNew<Int32>(retVal));
}

NAN_GETTER(GlobalGetNetworkTimeout) {
	NanScope();
	NanReturnValue(NanNew<Int32>(globalGetNetworkTimeout()));
}

NAN_SETTER(GlobalSetNetworkTimeout) {
	NanScope();
	if (value->IsInt32()) {
		int32_t nativeValue = value->Int32Value();
		globalSetNetworkTimeout(nativeValue);
	}else{
		LOGI("invalid data type for Global.networkTimeout\n");
	}
}


void GlobalInitBinding(Handle<Object> target) {
	NanScope();
	NAN_SET_METHOD(target, "httpGetJson", wrapHttpGetJson);
	NAN_SET_METHOD(target, "httpGet", wrapHttpGet);
	NAN_SET_METHOD(target, "httpPost", wrapHttpPost);
	NAN_SET_METHOD(target, "httpRequest", wrapHttpRequest);
	NAN_SET_METHOD(target, "setTimeout", wrapSetTimeout);
	target->SetAccessor(NanNew("networkTimeout"), GlobalGetNetworkTimeout, GlobalSetNetworkTimeout);
	target->Set(NanNew("NETWORK_DEFAULT_TIMEOUT"), NanNew<Int32>(GLOBAL_NETWORK_DEFAULT_TIMEOUT));

	return;
}
