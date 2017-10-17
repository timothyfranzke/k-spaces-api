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
