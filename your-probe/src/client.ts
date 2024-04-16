export interface NodeBody {
    jsonrpc: string
    result: Result
    id: number
  }
  
  export interface Result {
    baseFeePerGas: string
    difficulty: string
    extraData: string
    gasLimit: string
    gasUsed: string
    hash: string
    logsBloom: string
    miner: string
    mixHash: string
    nonce: string
    number: string
    parentHash: string
    receiptsRoot: string
    sha3Uncles: string
    size: string
    stateRoot: string
    timestamp: string
    totalDifficulty: string
    transactions: string[]
    transactionsRoot: string
    uncles: any[]
    withdrawals: Withdrawal[]
    withdrawalsRoot: string
  }
  
  export interface Withdrawal {
    address: string
    amount: string
    index: string
    validatorIndex: string
  }
  
  const getLastBlock = {
    "jsonrpc": "2.0",
    "method": "eth_getBlockByNumber",
    "params": ["latest",false],
    "id": 1
}

// equivalent curl
// curl --location 'https://ethereum.publicnode.com' \
// --header 'Content-Type: application/json' \
// --data '{
//     "jsonrpc": "2.0",
//     "method": "eth_getBlockByNumber",
//     "params": ["latest",false],
//     "id": 1
// }'
  export const GetLastBlock = async (): Promise<number>=>{
    try {
    // fetch the block from the node
    const rol= await fetch("https://ethereum.publicnode.com",{method: "POST",body: JSON.stringify(getLastBlock) });
    
    // check for error
    if(!rol.ok){
        throw new Error(`failed to fetch the latest block with status code ${rol.status}`)
    };

    // last block as hexa
    const nodeBody =await rol.json() as NodeBody;
    console.log(nodeBody)

    // convert hexa to number
    return Number(nodeBody.result.number);
  } catch (error) {
    console.log("Error fetching latest block num: ", error)
    throw error
  }
  }