# Micro file loader

```
var loader = new Uloader();

loader.load(['vendor/jquery.js', 'file.css', 'app.js']).then(function(){
	// run your awesome app :)
});

```

## Why?

Your user will have a better experience if a faster page feedback is given on
screen while your app is being loaded. Waiting all the files to load can't be
avoided, but you can at least load a static page and inform the user that the
page is being loaded :)