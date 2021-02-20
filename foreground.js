//console.log('hello from the foreground lol');

const first = document.createElement('button');
first.innertext = "set data";
first.id = "first";

const second = document.createElement('button');
second.innertext = "set data";
second.id = "second";

document.querySelector('body').appendChild(first);
document.querySelector('body').appendChild(second);

