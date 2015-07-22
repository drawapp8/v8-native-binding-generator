#include "Point.h"
Point::Point(){
}

Point::~Point(){
}


int Point::move(int32_t x, int32_t y) {
}

string Point::add(int32_t x, int32_t y) {
}

bool Point::copy(Point* other) {
}


int32_t Point::getX() const {
	return this->_x;
}

void Point::setX(int32_t x) {
	this->_x = x;
}


int32_t Point::getY() const {
	return this->_y;
}

void Point::setY(int32_t y) {
	this->_y = y;
}


string Point::getMagic() const {
	return this->_magic;
}

void Point::setMagic(string magic) {
	this->_magic = magic;
}


