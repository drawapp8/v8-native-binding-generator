#ifndef _V8_GLOBAL_H
#define _V8_GLOBAL_H

#include <assert.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string>

#include <string.h>

#include <v8.h>
#include <nan/nan.h>

using namespace std;
using namespace v8;

#define GLOBAL_NETWORK_DEFAULT_TIMEOUT 3000

bool httpGetJson(const char* url, NanCallback*  onProgress, NanCallback*  onDone);
bool httpGet(const char* url, NanCallback*  onProgress, NanCallback*  onDone);
bool httpPost(const char* url, const char* data, NanCallback*  onProgress, NanCallback*  onDone);
bool httpRequest(const char* url, const char* method, const char* header, const char* data, NanCallback*  onProgress, NanCallback*  onDone);
int32_t setTimeout(int32_t duration, NanCallback*  onTimeout);

int32_t globalGetNetworkTimeout();
void globalSetNetworkTimeout(int32_t networkTimeout);


#endif
