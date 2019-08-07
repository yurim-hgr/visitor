const fs = require('fs')
const Visit = artifacts.require('./Visit.sol')
module.exports = function (deployer) {
    deployer.deploy(Visit)
        .then(() => {
            if (Visit._json) {
                fs.writeFile(
                    'deployedABI', JSON.stringify(Visit._json.abi),
                    (err) => {
                        if (err) throw err;
                        console.log(' 파일에 ABI 입력 성공 ');
                    }
                );
                fs.writeFile(
                    'deployedAddress', Visit.address,
                    (err) => {
                        if (err) throw err;
                        console.log(' 파일에 주소 입력 성공 ');
                    }
                );
            }
        });
}