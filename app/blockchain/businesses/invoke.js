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

const Invoke = {
    mint: async function (username,amount) {
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

            let rs = await contract.submitTransaction('Mint', username,amount);

            console.log('Transaction has been submitted');

            // Disconnect from the gateway.
            await gateway.disconnect();
            return {success:true,data:JSON.parse(rs.toString()),error:``}

        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            return {success:false,error:`Failed to submit transaction: ${error}`}
        }
    },
    transfer: async function (fromUsername,toUsername,amount,timeStamp,transType,description) {
        try {

            const ccp = buildCCPIntegrate();

            // setup the wallet to hold the credentials of the application user
            const wallet = await buildWallet(Wallets, walletPath);


            // Check to see if we've already enrolled the user.
            const identity = await wallet.get(fromUsername);
            if (!identity) {
                console.log(`An identity for the user "${fromUsername}" does not exist in the wallet`);
                return;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: fromUsername, discovery: { enabled: true, asLocalhost: true } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract('erc20token');

            let rs = await contract.submitTransaction('Transfer', fromUsername,toUsername,amount,timeStamp,transType,description);

            console.log('Transaction has been submitted');

            // Disconnect from the gateway.
            await gateway.disconnect();
            return JSON.parse(rs.toString())

        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            return {success:false,error:`Failed to submit transaction: ${error}`}
        }
    },

    buy: async function (ticketNumber, buyer, ticketType, quantity, price, buyDateTime) {
        try {

            const ccp = buildCCPIntegrate();

            // setup the wallet to hold the credentials of the application user
            const wallet = await buildWallet(Wallets, walletPath);


            // Check to see if we've already enrolled the user.
            const identity = await wallet.get(buyer);
            if (!identity) {
                console.log(`An identity for the user "${buyer}" does not exist in the wallet`);
                return;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: buyer, discovery: { enabled: true, asLocalhost: true } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract('Ticket');
            console.log('===>',ticketNumber, buyer, ticketType, quantity, price, buyDateTime)
            let rs = await contract.submitTransaction('buy', ticketNumber, buyer, ticketType, quantity, price, buyDateTime);

            console.log('Transaction has been submitted');

            // Disconnect from the gateway.
            await gateway.disconnect();
            return JSON.parse(rs.toString())

        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            return {success:false,error:`Failed to submit transaction: ${error}`}
        }
    },


    use: async function (ticketNumbers, user, useDateTime) {
        try {

            const ccp = buildCCPIntegrate();

            // setup the wallet to hold the credentials of the application user
            const wallet = await buildWallet(Wallets, walletPath);


            // Check to see if we've already enrolled the user.
            const identity = await wallet.get(user);
            if (!identity) {
                console.log(`An identity for the user "${user}" does not exist in the wallet`);
                return;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: true, asLocalhost: true } });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork(channelName);

            // Get the contract from the network.
            const contract = network.getContract('Ticket');
            console.log('===>',ticketNumbers, user, useDateTime)
            let rs = await contract.submitTransaction('use',ticketNumbers.toString(), user, useDateTime.toString());

            console.log('Transaction has been submitted');

            // Disconnect from the gateway.
            await gateway.disconnect();
            return JSON.parse(rs.toString())

        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            return {success:false,error:`Failed to submit transaction: ${error}`}
        }
    },


}

module.exports = Invoke;


