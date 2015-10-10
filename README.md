# angular.ts2js

From the command line

`node rewrite -f=examples/simple/app.ts`

 or 

`gulp rewrite -f=examples/simple/app.ts`

From code

`npm install angular2.ts2js`

In your app.
 
    var rewriter = require('angular.ts2js');
    rewriter.rewrite('c:/foo/bar'); // to rewrite every .ts file in the foo/bar dir
    rewriter.rewrite('c:/foo/bar/xxx.ts') // to rewrite just the xxx.ts file


## License
Powered by Google ©2010-2015. Code licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0). Documentation licensed under [CC BY 3.0](http://creativecommons.org/licenses/by/3.0/).