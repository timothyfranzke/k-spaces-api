/**
 * Created by timothy.franzke on 6/16/2017.
 */
export function INFO(className, methodName, message){
  console.log("[INFO] - [" + className + "] [" + methodName + "] - Message : " + message);
}

export function INFORMATION(className, message){
  console.log("[INFO] - [" + className + "] [" + arguments.callee.name + "] - Message : " + message);
}
export function ERROR(exception, className, methodName, message){
  console.log("[ERROR] - [" + className + "] [" + methodName + "] - Exception : " + exception + " - Message : " + message );
}

export function Logger (gState, klass) {
  this.debug = {}

  if (gState) {
    for (var m in console)
      if (typeof console[m] == 'function')
        this.debug[m] = console[m].bind(console, klass.toString()+": ")
  }else{
    for (var m in console)
      if (typeof console[m] == 'function')
        this.debug[m] = function(){}
  }
  return this.debug
}

