import { GetLastBlock } from './client'
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'


const exporter = new OTLPMetricExporter();
const meterProvider = new MeterProvider({
    readers: [new PeriodicExportingMetricReader({
        exporter,
        exportIntervalMillis: 5000
    })],
});

const meter = meterProvider.getMeter('eth-block-number-meter');

const blockNumberCounter = meter.createObservableCounter('eth_latest_block_number', {
    description: 'Eth: Tracks latest block'
})

// callback to update periodically
blockNumberCounter.addCallback(async(result)=> {
    try {
        const blockNumber = await GetLastBlock();
        result.observe(blockNumber, {});
        console.log(`Latest Block Number: ${blockNumber}`);
    } catch (error) {
        console.error('Failed to fetch latest block number:',error);
    }
})

console.log("start block num probe ...")

setInterval(()=> {
    console.log('Keeping the process alive ... ')
}, 10000)


// graceful shutdown
process.on('SIGINT', () => {
    console.log('Received SIGNINT, shutting down gracefully ...');
    meterProvider.shutdown().then(() => {
        console.log("clean metrics")
        process.exit(0);
    })
})


process.on('SIGTERM', () => {
    console.log('Recieved SIGTERM. shuttingdown gracefully');
    meterProvider.shutdown().then(()=> {
        console.log('clean metrics')
        process.exit(0)
    })
})