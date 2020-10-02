const readline = require('readline');

function Timer(description,func,timer,line_number){
    this.description = description || 'Progress';
    this.time = timer || 1000;
    
     this.render = ()=>{
         if(!this.time){
             func();
             return;
         }
         var cmdText = description+"距离下次请求还剩: "+this.time+"s"
         readline.clearLine(process.stdout,line_number);    //移动光标到行首
         readline.cursorTo(process.stdout, 0,line_number)
         process.stdout.write(cmdText,'utf-8'); 
         setTimeout(()=>{
             this.time--
             this.render();
         },1000)
     }
}
module.exports = Timer;