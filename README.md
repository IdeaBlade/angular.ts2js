# angular.ts2js

From the command line

`node rewrite -f=examples/simple/app.ts`
   or
`gulp rewrite -f=examples/simple/app.ts`

To specify a suffix

`node rewrite -f=examples/simple/app.ts --suffix=test`
   or
`gulp rewrite -f=examples/simple/app.ts --suffix=test`

To specify an output folder

`node rewrite -f=examples/simple/app.ts --outDir=foo`
   or
`gulp rewrite -f=examples/simple/app.ts --outDir=foo`

From code

`npm install angular2.ts2js`

In your app.
 
    var rewriter = require('angular.ts2js');
    rewriter.rewrite('c:/foo/bar'); // to rewrite every .ts file in the foo/bar dir
    // or
    rewriter.rewrite('c:/foo/bar/xxx.ts') // to rewrite just the xxx.ts file
    //
    rewriter.rewrite('c:/foo/bar', { outDir='foo', suffix='test' }); // to specify an outDir and a suffix
    
## Features
  - can handle both 'ts' files as well as 'js' files that have been output from the typescript compiler.
  -  imported variable renaming
    - renames any imported vars with '_1' suffix by removing suffix
    - renames any imported vars coming from an angular base repo 'angular2/' with an 'ng' prefix
    - renames any imported vars coming from an angular base repo 'angular2/' from snake case to camel case.
    - renames angular2/angular2 -> 'ng'
  - ng DSL translation
    - handles all class level decorations - @Component, @View, @Directive, @Injectable ...
    - handles constructor parameter decorations
    - handles field decorations: @Input, @Output + partial handling for others.
  - remove function def cruft
    - __metadata, __decorate, __param  ( Note: __extend is still needed).
  - promotes class IIFE's up one level.

## Issues
  
   - Comments on interior decorators are lost
   - Some field decorations are not yet correctly aliased. ( a warning is issued)
	   - @HostBinding('[class.valid]') isValid; 
	   - @HostListener('click', ['$event']) onClick(e) {...}
   - Not yet sure how to translate the following (a warning is issued)
	   - @ContentChild(myPredicate) myChildComponent; 
       - @ContentChildren(myPredicate) myChildComponents; 
       - @ViewChild(myPredicate) myChildComponent; 
       - @ViewChildren(myPredicate) myChildComponents;
  
  

## License
Powered by Google ©2010-2015. Code licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0). Documentation licensed under [CC BY 3.0](http://creativecommons.org/licenses/by/3.0/).