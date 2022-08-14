# Download crypto data fast 

NodeJS script to download crypto data very fast using async and CCXT.

Usage :
* To run, open terminal and execute `node download_data2.js`
* Modify the end of the `download_data2.js` file to changes the exchange, pairs or timeframes
* NPM Dependencies: `csv-writer`, `ccxt`, `fs`

# Example run (using not the fastest internet connextion in the world)
```
user@user:~/Desktop/FAST_DOWNLOAD$ time node download_data2.js 
BTC/USDT Binance 15m 01-08-2017
Loading 0/177 requests | 0 candles loaded 
Loading 0/177 requests | 0 candles loaded 
Loading 33/177 requests | 33000 candles loaded 
Loading 73/177 requests | 73000 candles loaded 
Loading 112/177 requests | 112000 candles loaded 
Loading 148/177 requests | 148000 candles loaded 
Loading 177/177 requests | 176568 candles loaded  
ETH/USDT Binance 15m 01-08-2017
Loading 0/177 requests | 0 candles loaded 
Successfully downloaded 174456 candles since 17-8-2017 4:0 in ./Binance/15m/BTC-USDT.csv 
Loading 32/177 requests | 32000 candles loaded 
Loading 69/177 requests | 69000 candles loaded 
Loading 104/177 requests | 104000 candles loaded 
Loading 138/177 requests | 138000 candles loaded 
Loading 174/177 requests | 174000 candles loaded 
Loading 177/177 requests | 176568 candles loaded  
BNB/USDT Binance 15m 01-08-2017
Loading 0/177 requests | 0 candles loaded 
Successfully downloaded 174456 candles since 17-8-2017 4:0 in ./Binance/15m/ETH-USDT.csv 
Loading 30/177 requests | 30000 candles loaded 
Loading 69/177 requests | 69000 candles loaded 
Loading 107/177 requests | 107000 candles loaded 
Loading 151/177 requests | 151000 candles loaded 
Loading 174/177 requests | 173568 candles loaded 
Loading 177/177 requests | 176568 candles loaded  
Successfully downloaded 166708 candles since 6-11-2017 3:45 in ./Binance/15m/BNB-USDT.csv 

real	0m47,507s
user	0m25,739s
sys	0m1,362s

```