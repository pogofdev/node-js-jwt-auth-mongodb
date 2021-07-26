/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const {buildWallet} = require("../utils/AppUtil");
const {buildCCPIntegrate} = require("../utils/MyUtils");
const walletPath = path.join(__dirname, 'wallet');
const channelName = 'mychannel';

const Query = {
    getCurrentBalance: async function (username) {
        try {

            const ccp = buildCCPIntegrate();

            // setup the wallet to hold the credentials of the application user
            const wallet = await buildWallet(Wallets, walletPath);


            // Check to see if we've already enrolled the user.
            const identity = await wallet.get(username);
            if (!identity) {
                console.log(`An identity for the user "${username}" does not exist in the wallet`);
                return;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract('erc20token');


            // Evaluate the specified transaction.
            // query user balance
            // let result = await contract.evaluateTransaction('BalanceOf',['x509::/OU=client/CN=integrate::/C=US/ST=North Carolina/L=Raleigh/O=integrate.pogofdev.com/CN=ca1.integrate.pogofdev.com']);
            // console.log('BalanceOf has been submitted',(result.toString()));

            let result = await contract.evaluateTransaction('ClientAccountBalance',[username]);
            console.log('ClientAccountBalance has been submitted',(result.toString()));

            // Disconnect from the gateway.
            await gateway.disconnect();
            return  JSON.parse(result.toString())

        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            // process.exit(1);
            return null
        }
    },

    getTransactions: async function (username) {
        try {

            const ccp = buildCCPIntegrate();

            // setup the wallet to hold the credentials of the application user
            const wallet = await buildWallet(Wallets, walletPath);


            // Check to see if we've already enrolled the user.
            const identity = await wallet.get(username);
            if (!identity) {
                console.log(`An identity for the user "${username}" does not exist in the wallet`);
                return;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract('erc20token');


            // Evaluate the specified transaction.
            // query user balance
            // let result = await contract.evaluateTransaction('BalanceOf',['x509::/OU=client/CN=integrate::/C=US/ST=North Carolina/L=Raleigh/O=integrate.pogofdev.com/CN=ca1.integrate.pogofdev.com']);
            // console.log('BalanceOf has been submitted',(result.toString()));

            let result = await contract.evaluateTransaction('getTransactions',username);
            console.log('ClientAccountBalance has been submitted',(result.toString()));

            // Disconnect from the gateway.
            await gateway.disconnect();
            return  JSON.parse(result.toString())

        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            // process.exit(1);
            return null
        }
    },

    getOwnerTickets: async function (username) {
        try {

            const ccp = buildCCPIntegrate();

            // setup the wallet to hold the credentials of the application user
            const wallet = await buildWallet(Wallets, walletPath);


            // Check to see if we've already enrolled the user.
            const identity = await wallet.get(username);
            if (!identity) {
                console.log(`An identity for the user "${username}" does not exist in the wallet`);
                return;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract('Ticket');


            // Evaluate the specified transaction.
            // query user balance
            // let result = await contract.evaluateTransaction('BalanceOf',['x509::/OU=client/CN=integrate::/C=US/ST=North Carolina/L=Raleigh/O=integrate.pogofdev.com/CN=ca1.integrate.pogofdev.com']);
            // console.log('BalanceOf has been submitted',(result.toString()));

            let result = await contract.evaluateTransaction('getOwnerTickets',username);
            console.log('ClientAccountBalance has been submitted',(result.toString()));

            // Disconnect from the gateway.
            await gateway.disconnect();
            return  JSON.parse(result.toString())

        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            // process.exit(1);
            return null
        }
    },
    getRedeemTickets: async function (username) {
        try {

            const ccp = buildCCPIntegrate();

            // setup the wallet to hold the credentials of the application user
            const wallet = await buildWallet(Wallets, walletPath);


            // Check to see if we've already enrolled the user.
            const identity = await wallet.get(username);
            if (!identity) {
                console.log(`An identity for the user "${username}" does not exist in the wallet`);
                return;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract('Ticket');


            // Evaluate the specified transaction.
            // query user balance
            // let result = await contract.evaluateTransaction('BalanceOf',['x509::/OU=client/CN=integrate::/C=US/ST=North Carolina/L=Raleigh/O=integrate.pogofdev.com/CN=ca1.integrate.pogofdev.com']);
            // console.log('BalanceOf has been submitted',(result.toString()));

            let result = await contract.evaluateTransaction('getRedeemTickets',username);
            console.log('getRedeemTickets has been submitted',(result.toString()));

            // Disconnect from the gateway.
            await gateway.disconnect();
            return  JSON.parse(result.toString())

        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            // process.exit(1);
            return null
        }
    },

    getIssuedTickets: async function (username) {
        try {

            const ccp = buildCCPIntegrate();

            // setup the wallet to hold the credentials of the application user
            const wallet = await buildWallet(Wallets, walletPath);


            // Check to see if we've already enrolled the user.
            const identity = await wallet.get(username);
            if (!identity) {
                console.log(`An identity for the user "${username}" does not exist in the wallet`);
                return;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: username, discovery: { enabled: true, asLocalhost: true } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract('Ticket');


            // Evaluate the specified transaction.
            // query user balance
            // let result = await contract.evaluateTransaction('BalanceOf',['x509::/OU=client/CN=integrate::/C=US/ST=North Carolina/L=Raleigh/O=integrate.pogofdev.com/CN=ca1.integrate.pogofdev.com']);
            // console.log('BalanceOf has been submitted',(result.toString()));

            let result = await contract.evaluateTransaction('getIssuedTickets');
            console.log('ClientAccountBalance has been submitted',(result.toString()));

            // Disconnect from the gateway.
            await gateway.disconnect();
            return  JSON.parse(result.toString())

        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            // process.exit(1);
            return null
        }
    },


}

module.exports = Query;


