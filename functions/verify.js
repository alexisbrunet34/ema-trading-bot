module.exports = {
    argumentsAreNumbers: (...restArgs)=>{
        argumentsAreNumbers = [];
        for (var i = 0; i < restArgs.length; i++) {
            if( (typeof restArgs[i]) == "number" ){              
                argumentsAreNumbers.push(true);
            }else{
                argumentsAreNumbers.push(false);
            }
        }
    
        if (argumentsAreNumbers.includes(false)){
            return false;
        }else{
            return true
        }
    }
}
