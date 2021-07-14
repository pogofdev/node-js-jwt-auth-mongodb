
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const {buildCCPIntegrate} = require("../utils/MyUtils");
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../utils/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../utils/AppUtil.js');

const channelName = 'integrate';
const chaincodeName = 'basic';
const mspOrg1 = 'integrate-pogofdev-com';
const walletPath = path.join(__dirname, 'wallet');


const Register = {
    Initial: async function () {
        try {
            // build an in memory object with the network configuration (also known as a connection profile)
            const ccp = buildCCPIntegrate();

            // build an instance of the fabric ca services client based on
            // the information in the network configuration
            const caClient = buildCAClient(FabricCAServices, ccp, 'ca1.integrate.pogofdev.com');

            // setup the wallet to hold the credentials of the application user
            const wallet = await buildWallet(Wallets, walletPath);

            // in a real application this would be done on an administrative flow, and only once
            return await enrollAdmin(caClient, wallet, mspOrg1);
        }catch (e) {
            console.log(e)
            return false
        }
    },

    user: async function (username) {
        try {
            // build an in memory object with the network configuration (also known as a connection profile)
            const ccp = buildCCPIntegrate();

            // build an instance of the fabric ca services client based on
            // the information in the network configuration
            const caClient = buildCAClient(FabricCAServices, ccp, 'ca1.integrate.pogofdev.com');

            // setup the wallet to hold the credentials of the application user
            const wallet = await buildWallet(Wallets, walletPath);

            // in a real application this would be done only when a new user was required to be added
            // and would be part of an administrative flow
            return await registerAndEnrollUser(caClient, wallet, mspOrg1, username);

        }catch (e) {
            console.log(e)
            return false
        }
    }
}

module.exports = Register;
