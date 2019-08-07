const PrivateKeyConnector = require('connect-privkey-to-provider')
const NETWORK_ID = '1001' // Baobab Network 고유 ID
const GASLIMIT = '20000000'
const URL = 'https://api.baobab.klaytn.net:8651' // Baobab TestNET

const PRIVATE_KEY = '0x87f0f1f18f6dac618665b8089ea28295f57e7f4d09667d577f37adf33adedaf9'
module.exports = {
    networks: {
        klaytn: {
            provider: new PrivateKeyConnector(PRIVATE_KEY, URL),
            network_id: NETWORK_ID,
            gas: GASLIMIT,
            gasPrice: null, // Baobab Network 에서 자동으로 값 지정
        }
    }
}