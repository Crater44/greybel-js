# Greybel-JS 0.1.2

GreyScript preprocessor ([GreyHack](https://store.steampowered.com/app/605230/Grey_Hack/)). Which adds new features to GreyScript.

Lexer and Parser using partly logic from [luaparse](https://www.npmjs.com/package/luaparse). It's heavily modified though to support GreyScript.

Also party based on my GreyScript preprocessor written in GreyScript [greybel](https://github.com/ayecue/greybel). Without it's issues. That's mainly due to using a lexer and parser instead of string manipulation.

Features:
- import files, used to load other files into script
- wraps imported files in function block to prevent variable shadowing
- include which unlike import just copy paste its content
- envar which puts values from one file or multiple env files into the script
- minimizing your script, depending on the size of your project you can save up to 40%
-- optimizing literals (strings, booleans, numbers)
-- minifying namespaces
-- removing whitespaces + tabs
-- obfuscate your code (even though that's just a side effect of all the steps above)

# Install

```
npm i greybel-js
```

# CLI Usage
```
Compiler CLI
Version: 0.1.2
Example: greybel <myscriptfile> [output]

Arguments:
	filepath                    File to compile
	output                      Output directory

Options:
	-V, --version               output the version number
	-ev, --env-files <file...>  Environment varibales files
	-vr, --env-vars <vars...>   Environment varibales
	-u, --uglify                Uglify your code
	-h, --help                  display help for command
```

## Examples:
### Most common build command:
```
./compile /my/code/file.src $(cwd)
```

# Syntax

## Importing
Import will use the relative path from the file it imports to. Also keep in mind to not use the `.src` extension. It will automatically add the extension.
```
//File path: library/hello-world.src
module.exports = function()
	print("Hello world!")
end function

//File path: library/hello-name.src
module.exports = function(name)
	print("Hello " + name + "!")
end function

//File path: example.src
#import HelloWord from library/hello-world;
#import HelloName from library/hello-name;

HelloWord() //prints "Hello world!"
HelloName("Joe") //prints "Hello Joe!"
```

## Including
Include will use the relative path from the file it imports to. Also keep in mind to not use the `.src` extension. Unlike `import` this will not wrap the module. This will just purely put the content of a file into your script.
```
//File path: library/hello-world.src
hello = function()
	print("Hello world!")
end function

//File path: example.src
#include library/hello-world;

hello() //prints "Hello world!"
```

## Envar
Envar will put environment variables into your script. Just keep in mind to use the `--env-files /path/env.conf` parameter. This might be useful if you want to use different variables for different environments. You can use multiple env files `--env-file /path/default.conf /path/env.conf`.

Another thing you can do is defining the envars in the console command. `--env-vars test=value anothertest=value`
```
//File path: env.conf
# MY COMMENT
random=SOME_VALUE

//File path: example.src
somevar = #envar random;

print(somevar) //prints "SOME_VALUE"
```

# Things to come
- port greybel-js to GreyScript to replace https://github.com/ayecue/greybel
- clean up codebase
- use typescript
- debugging
- more functionality and possibly more syntax sugar