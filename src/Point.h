#ifndef _POINT_H
#define _POINT_H

#include <assert.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <string>
#include <v8.h>
#include <nan/nan.h>

using namespace std;
using namespace v8;

#define POINT_DEFAULT_NAME "jim"
#define POINT_DEFAULT_X 10
#define POINT_DEFAULT_Y 100

class Point: public ObjectWrap {
public:
	Point();
	~Point();

	int move(int32_t x, int32_t y);
	string add(int32_t x, int32_t y);
	bool copy(Point* other);

	int32_t getX() const;
	void setX(int32_t x);

	int32_t getY() const;
	void setY(int32_t y);

	string getMagic() const;
	void setMagic(string magic);

private:
	int32_t _x;
	int32_t _y;
	string _magic;
};

#endif
