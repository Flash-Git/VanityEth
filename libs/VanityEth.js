const crypto = require('crypto');
var ethUtils = require('ethereumjs-util');
var ERRORS = {
    invalidHex: "Invalid hex input"
}
var getRandomWallet = function() {
    var randbytes = crypto.randomBytes(32);
    var address = '0x' + ethUtils.privateToAddress(randbytes).toString('hex');
    return { address: address, privKey: randbytes.toString('hex') }
}
var isValidHex = function(hex) {
    if (!hex.length) return true;
    hex = hex.toUpperCase();
    var re = /^[0-9A-F]+$/g;
    return re.test(hex);
}
ar isValidVanityWallet = function(wallet, input, isChecksum, isContract) {
    var _input = JSON.parse(input);
    var _add = wallet.address;
    if (isContract) {
        console.log("I killed this");
        exit(1);
    }
    _add = isChecksum ? ethUtils.toChecksumAddress(_add) : _add;
    if(_input.constructor === Array){
        for (i = 0; i < _input.length; i++) {
            if(_add.substr(2, _input[i].length) == _input[i])
                return true;
        }
        return false;
    }
    return _add.substr(2, _input.toString().length) == _input;//not an array
}
var getVanityWallet = function(input = '', isChecksum = false, isContract = false) {
    var _wallet = getRandomWallet();
    while (!isValidVanityWallet(_wallet, input, isChecksum, isContract)) _wallet = getRandomWallet(isChecksum);
    if (isChecksum) _wallet.address = ethUtils.toChecksumAddress(_wallet.address);
    return _wallet;
}
var getDeteministicContractAddress = function(address) {
    return '0x' + ethUtils.sha3(ethUtils.rlp.encode([address, 0])).slice(12).toString('hex');
}
module.exports = {
    getVanityWallet: getVanityWallet,
    isValidHex: isValidHex,
    ERRORS: ERRORS
}
