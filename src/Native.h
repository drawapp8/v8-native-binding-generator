#ifndef _NATIVE_BINDING_H
#define _NATIVE_BINDING_H

#include <v8.h>
#include <nan/nan.h>

using namespace v8;

void nativeInitBinding(Handle<Object> target);

#endif
