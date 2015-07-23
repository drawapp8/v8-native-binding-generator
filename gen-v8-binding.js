var fs = require("fs");
var path = require("path");

function upperFirstChar(str) {
	return str.substr(0,1).toUpperCase() + str.substr(1);
}

function saveToFile(fileName, content) {
	var pathName = path.join("output", fileName);
	
	console.log(pathName);
	fs.writeFileSync(pathName, content);

	return;
}

function generateFuncProtype(funcInfo, funcName, noReturnType) {
	var content = "";
	var argc = funcInfo.args.length;

	if(!noReturnType) {
		content += funcInfo.returnType + " ";
	}

	content +=funcName + "(";
	for(var i = 0; i < argc; i++) {
		var argInfo = funcInfo.args[i];
		if(i) {
			content += ", ";
		}

		var type = argInfo.type;
		if(type === "string") {
			type = "const char*";
		}
		else if(type === "function") {
			type = "NanCallback* ";
		}
		content += type + " " + argInfo.name;
	}
	content += ")";

	return content;
}

function generateImplGlobalH(json) {
	var content = "";
	content += "#ifndef _V8_GLOBAL_H\n";
	content += "#define _V8_GLOBAL_H\n\n";
	content += "#include <assert.h>\n";
	content += "#include <fcntl.h>\n";
	content += "#include <stdio.h>\n";
	content += "#include <stdlib.h>\n";
	content += "#include <string>\n\n";
	content += "#include <string.h>\n\n";
	content += "#include <v8.h>\n";
	content += "#include <nan/nan.h>\n\n";
	content += 'using namespace std;\n';
	content += 'using namespace v8;\n';
	
	content += "\n";
	content += generateConstants(json);
	content += "\n";
	for(var funcName in json.functions) {
		var funcInfo = json.functions[funcName];
		var cppFuncName = funcInfo.cppName ? funcInfo.cppName : funcName;
		content += generateFuncProtype(funcInfo, cppFuncName) + ';\n';
	}
	
	content += "\n";
	for(var i in json.attributes) {
		var attrInfo = json.attributes[i];
		content += "" + attrInfo.type + " globalGet" + upperFirstChar(attrInfo.name) + '();\n';
		content += "void"+ " globalSet" + upperFirstChar(attrInfo.name) + '('+attrInfo.type + ' ' + attrInfo.name+');\n';
		content += "\n";
	}

	content += "\n#endif\n"
	
	var className = upperFirstChar(json.className);
	saveToFile(className + ".h", content);

	return;
}

function generateImplGlobalCpp(json) {
	var content = "";
	var className = upperFirstChar(json.className);

	content += '#include "' + className + '.h"\n\n';
	
	for(var funcName in json.functions) {
		var funcInfo = json.functions[funcName];
		var cppFuncName = funcInfo.cppName ? funcInfo.cppName : funcName;
		content += generateFuncProtype(funcInfo, cppFuncName) + ' {\n';
		content += "}\n\n";
	}
	
	content += "\n";
	for(var i in json.attributes) {
		var attrInfo = json.attributes[i];
		content += "" + attrInfo.type + " globalGet" + upperFirstChar(attrInfo.name) + '()\n';
		content += "{\n";
		content += "}\n";

		content += "void"+ " globalSet" + upperFirstChar(attrInfo.name) + '('+attrInfo.type + ' ' + attrInfo.name+')\n';
		content += "{\n";
		content += "}\n";
		content += "\n";
	}


	saveToFile(className + ".cpp", content);

	return;
}

function generateConstants(json) {
	var content = "";
	var className = upperFirstChar(json.className);
	var prefix = className.toUpperCase() +'_';
	for(var i in json.constants) {
		var constInfo = json.constants[i];
		if(constInfo.type === "string") {
			content += '#define ' + prefix +constInfo.name + ' "' + constInfo.value +'"\n';
		}
		else {
			content += '#define ' + prefix +constInfo.name + ' ' + constInfo.value +'\n';
		}
	}

	return content;
}	

function generateImplClassH(json) {
	var content = "";
	var className = upperFirstChar(json.className);
	var macro = "_" + className + "_H";
	macro = macro.toUpperCase();

	content += "#ifndef "+macro+"\n";
	content += "#define "+macro+"\n\n";
	content += "#include <assert.h>\n";
	content += "#include <fcntl.h>\n";
	content += "#include <stdio.h>\n";
	content += "#include <stdlib.h>\n";
	content += "#include <string.h>\n";
	content += "#include <string>\n";
	content += "#include <v8.h>\n";
	content += "#include <nan/nan.h>\n\n";
	content += 'using namespace std;\n';
	content += 'using namespace v8;\n';
	
	content += "\n";
	content += generateConstants(json);
	content += "\n";

	content += "class " + className + ": public ObjectWrap {\n";
	content += "public:\n";
	content += "	" + className + "();\n";
	content += "	~" + className + "();\n";
	
	content += "\n";
	for(var funcName in json.functions) {
		var funcInfo = json.functions[funcName];
		var cppFuncName = funcInfo.cppName ? funcInfo.cppName : funcName;
		content += "\t" + generateFuncProtype(funcInfo, cppFuncName) + ';\n';
	}
	
	content += "\n";
	for(var i in json.attributes) {
		var attrInfo = json.attributes[i];
		content += "\t" + attrInfo.type + " get" + upperFirstChar(attrInfo.name) + '() const;\n';
		content += "\tvoid"+ " set" + upperFirstChar(attrInfo.name) + '('+attrInfo.type + ' ' + attrInfo.name+');\n';
		content += "\n";
	}
	
	content += "private:\n";
	for(var i in json.attributes) {
		var attrInfo = json.attributes[i];
		content += "\t" + attrInfo.type + " _" + attrInfo.name + ';\n';
	}

	content += "};\n";
	content += "\n#endif\n";

	saveToFile(className + ".h", content);
}

function generateImplClassCpp(json) {
	var content = "";
	var className = upperFirstChar(json.className);

	content += '#include "' + className + '.h"\n';

	content += className + "::" + className + "(){\n";
	content += "}\n\n";
	
	content += className + "::~" + className + "(){\n";
	content += "}\n\n";
	
	content += "\n";
	for(var funcName in json.functions) {
		var funcInfo = json.functions[funcName];
		var cppFuncName = funcInfo.cppName ? funcInfo.cppName : funcName;
		content +=  funcInfo.returnType + " " + className + "::" + generateFuncProtype(funcInfo, cppFuncName, true) + ' {\n';
		content += "}\n\n";
	}
	
	content += "\n";
	for(var i in json.attributes) {
		var attrInfo = json.attributes[i];
		content += attrInfo.type + " " + className + "::get" + upperFirstChar(attrInfo.name) + '() const {\n';
		content += "\treturn this->_" + attrInfo.name + ";\n";
		content += "}\n\n";

		content += "void "+ className + "::set" + upperFirstChar(attrInfo.name) + '('+attrInfo.type + ' ' + attrInfo.name+') {\n';
		content += "\tthis->_" + attrInfo.name + " = "+attrInfo.name+";\n";
		content += "}\n\n";
		content += "\n";
	}
	
	saveToFile(className + ".cpp", content);
}

function generateImpl(json) {
	var className = json.className;

	if(className === "global") {
		generateImplGlobalH(json);
		generateImplGlobalCpp(json);
	}
	else {
		generateImplClassH(json);
		generateImplClassCpp(json);
	}
}

function generateBindingH(json) {
	var content = "";
	var className = upperFirstChar(json.className);
	var macro = "_" + className + "BINDING_H";
	macro = macro.toUpperCase();

	content += "#ifndef "+macro+"\n";
	content += "#define "+macro+"\n\n";
	content += "#include <assert.h>\n";
	content += "#include <fcntl.h>\n";
	content += "#include <stdio.h>\n";
	content += "#include <stdlib.h>\n";
	content += "#include <string>\n\n";
	content += "#include <string.h>\n\n";
	content += "#include <v8.h>\n";
	content += "#include <nan/nan.h>\n\n";
	content += 'using namespace v8;\n';

	content += "void " + className + "InitBinding(Handle<Object> target);\n";
	
	content += "\n#endif\n";

	saveToFile(className + "Binding.h", content);
}

function generateNewType(type, value) {
	var str = "";
	switch(type) {
		case 'string': {
			str = 'NanNew<String>('+value+')';
			break;
		}
		case 'int': 
		case 'int32_t': {
			str = 'NanNew<Int32>('+value+')';
			break;
		}
		case 'int64_t': {
			str = 'NanNew<Int64>('+value+')';
			break;
		}
		case 'double': {
			str = 'NanNew<Double>('+value+')';
			break;
		}
		case 'bool': {
			str = 'NanNew<Bool>('+value+')';
			break;
		}
		default:break;
	}

	return str;
}

function generateCheckType(type) {
	var str = "";
	switch(type) {
		case 'string': {
			str = 'IsString()';
			break;
		}
		case 'int': 
		case 'int32_t': {
			str = 'IsInt32()';
			break;
		}
		case 'int64_t': {
			str = 'IsNumber()';
			break;
		}
		case 'double': {
			str = 'IsNumber()';
			break;
		}
		case 'bool': {
			str = 'IsBoolean()';
			break;
		}
		default:break;
	}

	return str;
}

function generateBindingClassCpp(json) {
	var content = "";
	var className = upperFirstChar(json.className);

	content += '#include "'+className + ".h"+'"\n\n';
	content += '#include "'+className + "Binding.h"+'"\n\n';

	content += 'NAN_METHOD(new'+className+') {\n';
	content += '\tNanScope();\n\n';
	content += '\t'+className+'* obj = new '+className+'();\n';
	content += '\tobj->Wrap(args.This());\n\n';
	content += '\tNanReturnValue(args.This());\n';
	content += '}\n\n';

	for(var funcName in json.functions) {
		var funcInfo = json.functions[funcName];
		var cppFuncName = funcInfo.cppName ? funcInfo.cppName : funcName;
		var argc = funcInfo.args.length;

		var funcWrap = className + upperFirstChar(funcName);
		content += 'NAN_METHOD('+funcWrap+') {\n';
		content += '\tNanScope();\n';
		content += '\tif(args.Length() < ' + argc + ') {\n';
		content += '\t\tprintf("invalid arguments for '+funcName+'.\\n");\n';
		content += '\t\treturn;\n';
		content += '\t}\n';
		content += unwrapArgs(funcInfo, "\t") + '\n';
		
		content += "\t"+className+"* obj = ObjectWrap::Unwrap<"+className+">(args.This());\n";

		var returnType = funcInfo.returnType;
		if(returnType && returnType !== 'void') {
			content += '\t' + returnType + " retVal = " ;
		}
		else {
			content += "\t";
		}
		
		content += " obj->" + cppFuncName + '(' ;
		
		for(var i = 0; i < argc; i++) {
			var argInfo = funcInfo.args[i];
			if(i > 0) {
				content += ', ';
			}
			content += argInfo.type === "string" ? "*"+argInfo.name : argInfo.name;
		}
		content += ');\n' ;

		if(returnType && returnType !== 'void') {
			content += generateSetReturnValue(funcInfo, "\t");
		}
		else {
			content += "\tNanReturnUndefined();\n";
		}
		
		content += '}\n\n';
	}
	
	for(var i in json.attributes) {
		var attrInfo = json.attributes[i];
		var attrNameGet = className + "Get" + upperFirstChar(attrInfo.name);
		var attrNameSet = className + "Set" + upperFirstChar(attrInfo.name);
		content += "NAN_GETTER(" + attrNameGet + ") {\n";
		content += "\tNanScope();\n";
		content += "\t" + className + "* obj = ObjectWrap::Unwrap<"+className + ">(args.This());\n";
		var value = "obj->get"+upperFirstChar(attrInfo.name)+"()";
		content += "\tNanReturnValue("+generateNewType(attrInfo.type, value)+");\n";
		
		content += "}\n\n";
		
		content += "NAN_SETTER(" + attrNameSet + ") {\n";
		content += "\tNanScope();\n";
		content += "\t" + className + "* obj = ObjectWrap::Unwrap<"+className + ">(args.This());\n";
		
		content += "\tif (value->"+generateCheckType(attrInfo.type)+") {\n";
		content += generateConvertDataToNative("\t\t", attrInfo.type, 'value', 'nativeValue');
		var nativeValue = attrInfo.type === "string" ? '*nativeValue' : 'nativeValue';
		content += "\t\tobj->set"+upperFirstChar(attrInfo.name)+"("+nativeValue+");\n";
		content += "\t}else{\n";
		content += '\t\tprintf("invalid data type for '+className + "." + attrInfo.name+'\\n");\n';
		content += "\t}\n";

		content += "}\n\n";
	}
	content += "\n";

	content += '\nstatic Persistent<FunctionTemplate> constructor;\n';
	content += "void " + className + "InitBinding(Handle<Object> target) {\n";
	content += "\tNanScope();\n";
	content += "\tLocal<FunctionTemplate> ctor = NanNew<FunctionTemplate>(new"+className+");\n";
	content += "\tNanAssignPersistent(constructor, ctor);\n";
	content += "\tctor->InstanceTemplate()->SetInternalFieldCount(1);\n";
	content += '\tctor->SetClassName(NanNew("'+className+'"));\n';
	content += "\tLocal<ObjectTemplate> proto = ctor->PrototypeTemplate();\n";
	content += "\t\n";

	for(var i in json.attributes) {
		var str = "";
		var attrInfo = json.attributes[i];
		var attrNameGet = className + "Get" + upperFirstChar(attrInfo.name);
		var attrNameSet = className + "Set" + upperFirstChar(attrInfo.name);
		content += '\tproto->SetAccessor(NanNew("'+attrInfo.name+'"), '+attrNameGet+', '+attrNameSet+');\n';
	}

	content += "\n";
	for(var funcName in json.functions) {
		var funcInfo = json.functions[funcName];
		var funcWrap = className + upperFirstChar(funcName);
		content += '\tNAN_SET_PROTOTYPE_METHOD(ctor, "'+funcName+'", '+funcWrap+');\n';
	}
	content += "\n";
	
	for(var i in json.constants) {
		var constInfo = json.constants[i];
		var value = className.toUpperCase() +"_"+  constInfo.name;
		var str = generateNewType(constInfo.type, value);
		content += '\tNanSetTemplate(proto, "'+constInfo.name + '", '+str+');\n';
	}

	content += "\n";
	content +='\ttarget->Set(NanNew("'+className+'"), ctor->GetFunction());\n';

	content += "\n}\n";

	saveToFile(className + "Binding.cpp", content);
}

function generateBindingClass(json) {
	generateBindingH(json);
	generateBindingClassCpp(json);

	return;
}

function generateConvertDataToNative(prefix, type, name, nativeName) {
	var content = "";
	switch(type) {
		case 'string': {
			content += prefix + 'v8::String::Utf8Value ' + nativeName + '('+name+');\n';
			break;
		}
		case 'int': 
		case 'int32_t': {
			content += prefix + 'int32_t ' + nativeName + ' = '+name+'->Int32Value();\n';
			break;
		}
		case 'int64_t': {
			content += prefix + 'int64_t ' + nativeName + ' = '+name+'->IntegerValue();\n';
			break;
		}
		case 'double': {
			content += prefix + 'double ' + nativeName + ' = '+name+'->NumberValue();\n';
			break;
		}
		case 'bool': {
			content += prefix + 'bool ' + nativeName + ' = '+name+'->BooleanValue();\n';
			break;
		}
		case 'function': {
			content += prefix + 'NanCallback* ' + nativeName + ' = new NanCallback('+name+'.As<Function>());\n';
			break;
		}
		default: {
			var typeName = type.replace(/\*/, "");
			content += prefix + 'Local<Object> '+nativeName+'Obj = '+name+'->ToObject();\n';
			content += prefix + type + ' ' + nativeName + ' = ObjectWrap::Unwrap<'+typeName+'>('+nativeName+'Obj);\n';
		}
	}

	return content;
}

function unwrapArgs(funcInfo, prefix) {
	var content = "";
	var argc = funcInfo.args.length;

	for(var i = 0; i < argc; i++) {
		var argInfo = funcInfo.args[i];
		content += generateConvertDataToNative(prefix, argInfo.type, 'args['+i+']', argInfo.name);
	}

	return content;
}

function generateSetReturnValue(funcInfo, prefix) {
	var content = "";

	switch(funcInfo.returnType) {
		case 'string': {
			content += prefix + 'NanReturnValue(NanNew<String>(retVal.c_str()));\n';
			break;
		}
		case 'int': 
		case 'int32_t': {
			content += prefix + 'NanReturnValue(NanNew<Int32>(retVal));\n';
			break;
		}
		case 'int64_t': {
			content += prefix + 'NanReturnValue(NanNew<Number>(retVal));\n';
			break;
		}
		case 'double': {
			content += prefix + 'NanReturnValue(NanNew<Number>(retVal));\n';
			break;
		}
		case 'bool': {
			content += prefix + 'NanReturnValue(NanNew<Boolean>(retVal));\n';
			break;
		}
		default:break;
	}

	return content;
}

function generateBindingGlobalCpp(json) {
	var content = "";
	var className = upperFirstChar(json.className);

	content += '#include "' + className + '.h"\n\n';

	for(var funcName in json.functions) {
		var funcInfo = json.functions[funcName];
		var cppFuncName = funcInfo.cppName ? funcInfo.cppName : funcName;
		var argc = funcInfo.args.length;
		var wrapFuncName = 'wrap'+upperFirstChar(funcName);

		content += 'NAN_METHOD('+wrapFuncName+') {\n';
		content += "\tNanScope();\n";
		content += '\tif(args.Length() < ' + argc + ') {\n';
		content += '\t\tprintf("invalid arguments for '+funcName+'.\\n");\n';
		content += '\t\treturn;\n';
		content += '\t}\n\n';
		content += unwrapArgs(funcInfo, "\t") + '\n';

		var returnType = funcInfo.returnType;
		if(returnType && returnType !== 'void') {
			content += '\t' + returnType + " retVal = " ;
		}
		else {
			content += "\t";
		}
		
		content += cppFuncName + '(' ;
		
		for(var i = 0; i < argc; i++) {
			var argInfo = funcInfo.args[i];
			if(i > 0) {
				content += ', ';
			}
			content += argInfo.type === "string" ? "*"+argInfo.name : argInfo.name;
		}
		content += ');\n' ;

		if(returnType && returnType !== 'void') {
			content += generateSetReturnValue(funcInfo, "\t");
		}
		
		content += '}\n\n';
	}
	
	for(var i in json.attributes) {
		var attrInfo = json.attributes[i];
		var attrNameGet = className + "Get" + upperFirstChar(attrInfo.name);
		var attrNameSet = className + "Set" + upperFirstChar(attrInfo.name);
		content += "NAN_GETTER(" + attrNameGet + ") {\n";
		content += "\tNanScope();\n";
		var value = "globalGet"+upperFirstChar(attrInfo.name)+"()";
		content += "\tNanReturnValue("+generateNewType(attrInfo.type, value)+");\n";
		
		content += "}\n\n";
		
		content += "NAN_SETTER(" + attrNameSet + ") {\n";
		content += "\tNanScope();\n";
		
		content += "\tif (value->"+generateCheckType(attrInfo.type)+") {\n";
		content += generateConvertDataToNative("\t\t", attrInfo.type, 'value', 'nativeValue');
		var nativeValue = attrInfo.type === "string" ? '*nativeValue' : 'nativeValue';
		content += "\t\tglobalSet"+upperFirstChar(attrInfo.name)+"("+nativeValue+");\n";
		content += "\t}else{\n";
		content += '\t\tprintf("invalid data type for '+className + "." + attrInfo.name+'\\n");\n';
		content += "\t}\n";

		content += "}\n\n";
	}
	content += "\n";

	content += "void " + className + "InitBinding(Handle<Object> target) {\n";
	content +="\tNanScope();\n";
	for(var funcName in json.functions) {
		var funcInfo = json.functions[funcName];
		var wrapFuncName = 'wrap'+upperFirstChar(funcName);
		var jsFuncName = funcInfo.jsName ? funcInfo.jsName : funcName;

		content += '\tNAN_SET_METHOD(target, "'+jsFuncName+'", '+wrapFuncName+');\n';
	}
	
	for(var i in json.attributes) {
		var str = "";
		var attrInfo = json.attributes[i];
		var attrNameGet = className + "Get" + upperFirstChar(attrInfo.name);
		var attrNameSet = className + "Set" + upperFirstChar(attrInfo.name);
		content += '\ttarget->SetAccessor(NanNew("'+attrInfo.name+'"), '+attrNameGet+', '+attrNameSet+');\n';
	}
	
	for(var i in json.constants) {
		var constInfo = json.constants[i];
		var value = className.toUpperCase() +"_"+  constInfo.name;
		var str = generateNewType(constInfo.type, value);
		content += '\ttarget->Set(NanNew("'+constInfo.name + '"), '+str+');\n';
	}
	content +="\n";
	content +="\treturn;\n";
	content +="}\n";

	saveToFile(className + "Binding.cpp", content);
}

function generateBindingGlobal(json) {
	generateBindingH(json);
	generateBindingGlobalCpp(json);
}

function generateBinding(json) {
	var className = json.className;

	if(className === "global") {
		generateBindingGlobal(json);	
	}
	else {
		generateBindingClass(json);
	}
}

function generate() {
	var inputFile = process.argv.length > 2 ? process.argv[2] : __dirname + '/test.json';

	fs.readFile(inputFile, function(err, data) {
		var json = JSON.parse(data);

		if(json) {
			if(!json.className) {
				json.className = "global";
			}

			generateBinding(json);
			generateImpl(json);
		}
	});
}

generate();

