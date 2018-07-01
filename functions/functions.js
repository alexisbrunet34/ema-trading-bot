const request = require('request');
const verify = require('./verify');

module.exports = {

    /**
     * ema function calulate the exponential moving average(ema) of candles
     * @param candles: array
     * @param length: int
     * @param emaHistory: array
     * @returns ema: float
     */
    ema:  (candles, length, emaHistory)=> {

        return new Promise((resolve, reject, err)=>{

            var closingPrice = candles[0][4];
            var variation = (2/(length+1));
            var lastEma = emaHistory[0];
        
            var ema = (closingPrice*variation)+(lastEma*(1-variation));
            
            resolve (ema);

            if(err){
                reject(err);
            }
        });

    },
    
    /**
     * sma function calculate and returns the simple moving average(sma) of an array
     * @param  candles: array
     * @param emaLength: float
     * @return float
     */
    sma : (candles, emaLength)=> {

        return new Promise((resolve, reject, err)=>{

            var sumOfClosingPrices = 0;

            for (let index = 0; index < emaLength; index++) {

                sumOfClosingPrices += candles[index][4];    

            }

            var sma = sumOfClosingPrices / emaLength;
            
            resolve (sma);

            if(err){

                reject (err);

            }
        })
    },
    

    /**
     * getCandles function calls a cryptocurrency api endpoint to retrieve candles.
     * The number and size of candles needs to be custumized in init.js
     * @param pair: String
     * @param candleSize: int
     * @return Json array
     */
    getCandles :  (pair, candleSize)=> {  

        return new Promise((resolve, reject, err)=>{

            var url = "https://api.pro.coinbase.com/products/" + pair + "/candles?granularity=" + candleSize;

            var infos = {   
                headers: {'User-Agent': 'ua'},
                uri: url,
                method: 'GET'
            }
        
            request.get(infos, (err,response,body)=>{ 

                var rep = JSON.parse(body);
                resolve (rep);

            });
            
            if(err){

                reject (err);

            }
        });
    },


    /**
     * threshold function calculate the threshold which will be use during emas comparaisons
     * @argument emaShort: float
     * @argument emaLong: float
     * @return float
     */
    threshold: (emaShort, emaLong)=>{

        if( verify.argumentsAreNumbers(emaShort, emaLong) === true){

            threshold = ((emaShort-emaLong)/((emaShort+emaLong)/2)*100);
            
            return (threshold);

        }else{

            console.log("threshold function : one or more of the argument(s) is/are not a number");

        }

    },


    /**
     * comparaison function analyze the market and take decision either to buy, sell, hold, wait for an opportunity
     * @argument emaShort: float
     * @argument emaLong: float
     * @argument threshold: float
     * @argument up: float
     * @argument down: float
     * @argument walletFiat: float
     */
    comparaison: (emaShort, emaLong, threshold, up, down, walletFiat)=>{

        //verify that all the inputs are numbers
        if( verify.argumentsAreNumbers(emaShort, emaLong, threshold, up, down, walletFiat) === true){
            
            //market goes up
            if(emaShort>emaLong && threshold > up && walletFiat != 0){//if wallet crypto is empty, then the bot buys crypto
                console.log("i'm buying ...");
            }

            //market goes up but not strongly enough (threshold is between up and down values)
            if(emaShort>emaLong &&  threshold < up &&  threshold > down  && walletFiat != 0){//if wallet crypto is empty, then the bot buys crypto
                console.log("market goes up but not strongly enough, so i'm waiting for an opportunity to buy ...");
            }

            //market goes up
            if(emaShort>emaLong && threshold > up && walletFiat ==0){//if wallet crypto is not empty, then the bot has already bought cryptos, so it keeps it as the market is going up
                console.log("i'm holding ...");
            }

            //market goes down
            if(emaShort<emaLong && threshold < down && walletFiat ==0){//if wallet crypto is not empty, then the bot sell
                console.log("i'm selling ..." );
            }
            //market goes down
            if (emaShort<emaLong && threshold < down && walletFiat != 0){//if wallet crypto is empty, then the bot wait for an opportunity
                console.log("i'm waiting for an opportunity to buy ...");
            }     

        }else{

            console.log("comparaison function : one or more of the argument(s) is/are not a number");

        }
    }
}


