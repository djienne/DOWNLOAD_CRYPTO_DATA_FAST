const ccxt = require('ccxt');
const fs = require('fs')
const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const exchangeLimit = JSON.parse(fs.readFileSync('./exchange_limit.json', 'utf8'));
const tfMS = JSON.parse(fs.readFileSync('./tf_ms.json', 'utf8'));
const coinList = JSON.parse(fs.readFileSync('./pair_list.json', 'utf8'));

function date2timestamp(myDate) {
    myDate = myDate.split("-");
    let newDate = new Date(Date.UTC(myDate[2], myDate[1] - 1, myDate[0]));
    return newDate.getTime();
}

function timestamp2date(myTF) {
    my_date = new Date(myTF);
    str_date = `${my_date.getUTCDate()}-${my_date.getUTCMonth() + 1}-${my_date.getUTCFullYear()} ${my_date.getUTCHours()}:${my_date.getUTCMinutes()}`
    return str_date;
}

function currentUTCdate() {
    const now = new Date();
    now.toUTCString();
    now.toISOString();
    return Math.floor(now);
}

function eliminateDuplicates(arr) {
    let i,
        len = arr.length
    to_remove = []

    for (i = 1; i < len; i++) {
        if (arr[i][0] === arr[i - 1][0]) {
            to_remove.push(i)
        }
    }
    for (i = to_remove.length - 1; i >= 0; i--) {
        arr.splice(to_remove[i], 1);
    }
    return arr;
}

async function getKline(exchange, pairName, timeframe, since_date, limit, tfMS) {
    let exchange_name = exchange.name;
    console.log(pairName, exchange_name, timeframe, since_date);
    let starting_date = date2timestamp(since_date);
    let now = currentUTCdate();
    let tf_array = [starting_date];
    let last_tf = starting_date;
    let result_ohlcv = [];
    let current_request = 0;
    while (last_tf < now) {
        last_tf = last_tf + (limit) * tfMS;
        if (last_tf < now) {
            tf_array.push(last_tf);
        }
    }
    let total_request = tf_array.length;

    for (const tf in tf_array) {
        // console.log(tf_array[tf])
        exchange.fetchOHLCV(symbol = pairName, timeframe = timeframe, since = tf_array[tf], limit = limit).then(resp => {
            result_ohlcv = result_ohlcv.concat(resp);
            current_request++;
        }).catch(err => {
            console.log("Error retrieving candles since", tf_array[tf], exchange_name, pairName, timeframe);
            exchange.fetchOHLCV(symbol = pairName, timeframe = timeframe, since = tf_array[tf], limit = limit).then(resp => {
                result_ohlcv = result_ohlcv.concat(resp);
                current_request++;
            }).catch(err2 => {
                console.log("Error retrieving candles since", tf_array[tf], exchange_name, pairName, timeframe);
                exchange.fetchOHLCV(symbol = pairName, timeframe = timeframe, since = tf_array[tf], limit = limit).then(resp => {
                    result_ohlcv = result_ohlcv.concat(resp);
                    current_request++;
                }).catch(err3 => {
                    console.log(err2);
                    console.log("/! Fatal Error /!", pairName, timeframe);
                    current_request++;
                })
            })
        })
    }
    const delay = millis => new Promise((resolve, reject) => {
        setTimeout(_ => resolve(), millis);
    });
    while (current_request < total_request) {
        process.stdout.write(`\rLoading ${current_request}/${total_request} requests | ${result_ohlcv.length} candles loaded \n`);
        await delay(2000);
    }
    process.stdout.write(`\rLoading ${current_request}/${total_request} requests | ${result_ohlcv.length} candles loaded  \n`);
    result_ohlcv = result_ohlcv.sort(function (a, b) {
        return a[0] - b[0];
    });
    result_ohlcv = eliminateDuplicates(result_ohlcv);

    let file_pair = pairName.replace('/', '-');
    let dirpath = './' + exchange_name + '/' + timeframe + '/';
    let filepath = dirpath + file_pair + ".csv";

    let first_date = timestamp2date(result_ohlcv[0][0]);

    await fs.promises.mkdir(dirpath, { recursive: true });

    const csvWriter = createCsvWriter({
        fieldDelimiter: ';',
        path: filepath
    });

    csvWriter.writeRecords(result_ohlcv) // returns a promise
        .then(() => {
            process.stdout.write(`\rSuccessfully downloaded ${result_ohlcv.length} candles since ${first_date} in ${filepath} \n`);
            return true;
        }).catch(err => {
            console.log(err);
            return false;
        });
}

async function getMultiKline(exchange, pair_list, tf_list, start_date, exchange_limit_json, tf_ms_json) {
    for (const tf in tf_list) {
        for (const pair in pair_list) {
            await getKline(
                exchange,
                pair_list[pair],
                tf_list[tf],
                start_date,
                exchange_limit_json[exchange.name],
                tf_ms_json[tf_list[tf]]
            );
        }
    }
}

// --- Edit exchange here ---
let exchange = new ccxt.binance({ enableRateLimit: true })

// --- Edit coin list here ---
//pair_list = coin_list['binanceTop30']
pair_list = ["BTC/USDT", "ETH/USDT", "BNB/USDT"]
// --- Edit timeframe list and start date here ---
timeframe_list = ['15m']
start_date = "01-08-2017"

getMultiKline(
    exchange,
    pair_list,
    timeframe_list,
    start_date,
    exchangeLimit,
    tfMS
)
