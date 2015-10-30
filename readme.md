# About

This is a command line tool which uses the API of [websequencediagrams](https://www.websequencediagrams.com) in order to create sequence diagrams out of .wsd files.

Syntax details can be found at [https://www.websequencediagrams.com/examples.html](https://www.websequencediagrams.com/examples.html)
Example content of a .wsd file

```
title create user

App -> Api: POST /user with email, fpw,
Api -> Router: route POST /user
Router -> UserController: create user
UserController -> UserController: validate request

alt isValid
    UserController -> UserController: new User
    UserController -> Router: next
else isInvalid
    UserController -> Api: respond with 400 invalid request
    Api -> App: 400 invalid request
```

Results in <img src="https://github.com/florianschmidt1994/websequencediagrams/raw/master/example/createuser.png"/>

# Run
```
Usage: sequencediagrams [options] <file or folder>

    Options:

    -h, --help          output usage information
    -V, --version       output the version number
    -t, --theme <name>  Choose theme out of 'napkin', 'earth' (Defaults to napkin)
```

# Credits
Thanks to [hildjj's](https://github.com/hildjj) https://github.com/hildjj/node-websequencediagrams project, which already provides an abstraction around the websequencediagram API
