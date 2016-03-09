
if(localStorage.lang == 'en'){
    var Lang = require('./lang-en');
}else{
    var Lang = require('./lang-zh');
}
console.log(Lang)
Lang.localStorage = localStorage;
Lang.location = location;

Lang.LChooseLang = function (type) {
    localStorage.lang = type;
    location.href = location.href;
}
module.exports = Lang;