V8_SRC=/work/jsengine/v8/v8
CFLAGS=-I$(V8_SRC) -I$(V8_SRC)/include -I../ -I../output

VPATH=../output:../src
OBJS=Point.o PointBinding.o GlobalBinding.o Global.o main.o Native.o
LIBV8_ROOT=$(V8_SRC)/out/x64.debug/obj.target/tools/gyp
LIBICU_ROOT=$(V8_SRC)/out/x64.debug/obj.target/third_party/icu

LIBS=$(LIBV8_ROOT)/libv8_base.a $(LIBV8_ROOT)/libv8_libbase.a \
	$(LIBV8_ROOT)/libv8_snapshot.a $(LIBV8_ROOT)/libv8_libplatform.a $(LIBV8_ROOT)/libv8_nosnapshot.a \
	$(LIBICU_ROOT)/libicui18n.a  $(LIBICU_ROOT)/libicuuc.a $(LIBICU_ROOT)/libicudata.a \
	-lm  -lpthread  -lstdc++

%.o:%.cpp
	$(CC) -g -c $< $(CFLAGS)

all:$(OBJS)
	$(CC) -g $(OBJS) $(LIBS) -o runJS
clean:
	rm -f *.o runJS

