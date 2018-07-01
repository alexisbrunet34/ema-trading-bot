module.exports = {

    /**
     * argumentsAreNumbers function verify that the arguments are numbers, return true if it's the case
     * @argument none
     * @returns boolean
     */
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
