#include "GlobalBinding.h"
#include "PointBinding.h"

void nativeInitBinding(Handle<Object> target) {
	PointInitBinding(target);
	GlobalInitBinding(target);

	return;
}

