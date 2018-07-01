const functions = require('./functions/functions');
const request = require('request');
const init = require('./init.js')
const schedule = require('node-schedule');

/**
 * function regroup all the functions in order to call one function ev using the schedule node
 */
module.exports = function bot() {

    var ema = []; ema.short = []; ema.long = [];
    functions.getCandles(init.pair.bitcoin, init.sizeOfCandles["1h"])
    .then((candles)=> {   
    
        // if the sma array exist and is not empty, use the ema function 
        if(ema['short'] && ema['short'].length){

            functions.ema(candles, init.ema.short, ema['short'])
            .then((result)=>{ema['short'].push(result)}).catch(err=>console.log("something went wrong..." + err));

            functions.ema(candles, init.ema.long, ema['long'])
            .then((result)=>{ ema['long'].push(result)}).catch(err=>console.log("something went wrong..." + err));
    
        //else, use the sma function    
        }else{ 

            functions.sma(candles, init.ema.short, ema)
            .then((result)=>{ ema['short'].push(result)}).catch(err=>console.log("something went wrong..." + err));

            functions.sma(candles, init.ema.long, ema)
            .then((result)=>{ ema['long'].push(result)}).catch(err=>console.log("something went wrong..." + err));
        }
    
    }).catch(err=>console.log("something went wrong..." + err))
    .then(()=>{ 

        threshold = functions.threshold(ema.short[0], ema.long[0]);
        
        functions.comparaison(ema.short[0], ema.long[0], threshold, init.threshold.up, init.threshold.down, init.wallet.fiat);

    }).catch(err=>console.log("something went wrong..." + err));
};