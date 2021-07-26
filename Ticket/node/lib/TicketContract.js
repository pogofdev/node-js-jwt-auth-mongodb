/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const Ticket = require("./Ticket");
const {Contract} = require('fabric-contract-api');

const ticketKey = 'ticketKey'
const ticketRedeemKey = 'ticketRedeemKey'

class TicketContract extends Contract {

    /**
     * Buy ticket
     *
     * @param {Context} ctx the transaction context
     */
    async buy(ctx, ticketNumber, buyer, ticketType, quantity, price, buyDateTime) {
        let qt = parseInt(quantity)
        let p = parseInt(price)
        if (qt <= 0) throw new Error(`Quantity must be larger than 0`);
        if (p <= 0) throw new Error(`Price must be larger than 0`);
        // return {ticketNumber, buyer, ticketType, quantity, price, buyDateTime}
        let tickets = []
        for (let i = 0; i < qt; i++) {
            let ticket = await this._issue(ctx, `${ticketNumber}-${i}`, buyer, ticketType, price, `${buyDateTime}`)
            tickets.push(ticket)
        }
        // const cc1Args = [buyer, 'integrate',p*qt,buyDateTime,'BUY_TICKET',`Buy ${quantity} ${ticketType} ticket(s).`];
        // const cc1Args = `${buyer}, 'integrate','${p*qt}','${buyDateTime}','BUY_TICKET','Buy ${quantity} ${ticketType} ticket(s).'`;
        // var buf = Buffer.from(cc1Args, 'utf8');
        const cc1Res = await ctx.stub.invokeChaincode('erc20token', ["Transfer",buyer,'integrate',`${p*qt}`,`${buyDateTime}`,'BUY_TICKET',`Buy ${quantity} ${ticketType} ticket(s).`]);
        if (cc1Res.status !== 200) {
            throw new Error(cc1Res.message);
        }
        // throw new Error(`chay dc den day roi ${JSON.stringify(tickets)}`)
        return tickets
    }

    async use(ctx,ticketNumbers, user, useDateTime) {
        let tknumbers = ticketNumbers.split(',')
        // throw new Error(`tknumbers: ${tknumbers.length}`)
        for(let i=0;i<tknumbers.length;i++){
            let ticketNumber = tknumbers[i]

            //lay ticket do ra chac chan chi co 1 ma thoi
            const allResults = [];
            for await (const {key, value} of ctx.stub.getStateByPartialCompositeKey(ticketKey, ['integrate',user,ticketNumber])) {
                const strValue = Buffer.from(value).toString('utf8');
                let record;
                try {
                    record = JSON.parse(strValue);
                } catch (err) {
                    console.log(err);
                    record = strValue;
                }
                allResults.push({Key: key, Record: record});
            }
            console.info(allResults);
            if(allResults.length===0)  throw new Error(`Cannot find ticket ${ticketNumber}`);
            //xoa record cu
            let buyDateTime = (ticketNumber.split('-'))[1]
            let deleteKey = ctx.stub.createCompositeKey(ticketKey, ['integrate',user,ticketNumber,buyDateTime]);
            await ctx.stub.deleteState(deleteKey);
            //tao record moi va chuyen owner sang oildepot
            let key = ctx.stub.createCompositeKey(ticketKey, ['integrate',`oildepot`,ticketNumber, useDateTime]);
            allResults[0].Record.useDateTime = useDateTime
            let ticket = new Ticket(allResults[0].Record)
            ticket.setOwner('oildepot')
            ticket.setStatusUsed()
            let data = Ticket.serialize(ticket);
            await ctx.stub.putState(key, data);
        }
       return {success:true}
    }

    async redeem(ctx,ticketNumbers, user, redeemDateTime) {
        let tknumbers = ticketNumbers.split(',')
        // throw new Error(`tknumbers: ${tknumbers.length}`)
        let redeemTokens = 0;
        for(let i=0;i<tknumbers.length;i++){
            let ticketNumber = tknumbers[i]

            //lay ticket do ra chac chan chi co 1 ma thoi
            const allResults = [];
            for await (const {key, value} of ctx.stub.getStateByPartialCompositeKey(ticketKey, ['integrate',user,ticketNumber])) {
                const strValue = Buffer.from(value).toString('utf8');
                let record;
                try {
                    record = JSON.parse(strValue);
                } catch (err) {
                    console.log(err);
                    record = strValue;
                }
                allResults.push({Key: key, Record: record});
            }
            console.info(allResults);
            if(allResults.length===0)  throw new Error(`Cannot find ticket ${ticketNumber}`);
            //xoa record cu
            let useDateTime = allResults[0].Record.useDateTime
            let deleteKey = ctx.stub.createCompositeKey(ticketKey, ['integrate',user,ticketNumber,useDateTime]);
            await ctx.stub.deleteState(deleteKey);
            //tao record moi va chuyen owner sang oildepot
            let key = ctx.stub.createCompositeKey(ticketRedeemKey, ['integrate',user,ticketNumber, redeemDateTime]);
            allResults[0].Record.redeemDateTime = redeemDateTime
            let ticket = new Ticket(allResults[0].Record)
            // ticket.setOwner('integrate')
            ticket.setStatusRedeem()
            let data = Ticket.serialize(ticket);
            await ctx.stub.putState(key, data);
            redeemTokens += (parseInt(allResults[0].Record.price) * 0.1)

        }

        //chuyen tien lai
        const cc1Res = await ctx.stub.invokeChaincode('erc20token', ["Transfer",'integrate',user,`${redeemTokens}`,`${redeemDateTime}`,'REDEEM_TICKET',`Redeem ticket: ${ticketNumbers}`]);
        if (cc1Res.status !== 200) {
            throw new Error(cc1Res.message);
        }
       return {success:true}
    }


    async _issue(ctx, ticketNumber, buyer, ticketType,  price, buyDateTime) {
        let ticket = Ticket.createInstance(ticketNumber, buyer, ticketType,  price, buyDateTime)
        // let mspid = ctx.clientIdentity.getMSPID();
        // ticket.setOwnerMSP(mspid)
        ticket.setStatusNew()
        ticket.setBuyer(buyer)
        ticket.setOwner(buyer)
        let key = ctx.stub.createCompositeKey(ticketKey, ['integrate',buyer,ticketNumber, buyDateTime]);
        let data = Ticket.serialize(ticket);
        await ctx.stub.putState(key, data);
        return ticket
    }



    async queryKeyByOwner(owner) {
        //
        let self = this;
        if (arguments.length < 1) {
            throw new Error('Incorrect number of arguments. Expecting owner name.');
        }
        let queryString = {};
        queryString.selector = {};
        //  queryString.selector.docType = 'indexOwnerDoc';
        queryString.selector.owner = owner;
        // set to (eg)  '{selector:{owner:MagnetoCorp}}'
        let method = self.getQueryResultForQueryString;
        let queryResults = await method(this.ctx, self, JSON.stringify(queryString));
        return queryResults;
    }

    async getOwnerTickets(ctx, accountId) {
        const startKey = '';
        const endKey = '';
        // const resultsIterator = await this.ctx.stub.getStateByPartialCompositeKey(transactionKey, [accountId]);


        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByPartialCompositeKey(ticketKey, ['integrate',accountId])) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({Key: key, Record: record});
        }
        console.info(allResults);
        return (allResults);
    }

    async getRedeemTickets(ctx, accountId) {
        const startKey = '';
        const endKey = '';
        // const resultsIterator = await this.ctx.stub.getStateByPartialCompositeKey(transactionKey, [accountId]);


        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByPartialCompositeKey(ticketRedeemKey, ['integrate'])) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({Key: key, Record: record});
        }
        console.info(allResults);
        return (allResults);
    }


    async getIssuedTickets(ctx) {
        const startKey = '';
        const endKey = '';
        // const resultsIterator = await this.ctx.stub.getStateByPartialCompositeKey(transactionKey, [accountId]);


        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByPartialCompositeKey(ticketKey, ['integrate'])) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({Key: key, Record: record});
        }
        console.info(allResults);
        return (allResults);
    }

    async getQueryResultForQueryString(ctx, self, queryString) {

        // console.log('- getQueryResultForQueryString queryString:\n' + queryString);

        const resultsIterator = await ctx.stub.getQueryResult(queryString);
        let results = await self.getAllResults(resultsIterator, false);

        return results;

    }

    async getAllResults(iterator, isHistory) {
        let allResults = [];
        let res = { done: false, value: null };
        return res
        while (true) {
            res = await iterator.next();
            let jsonRes = {};
            if (res.value && res.value.value.toString()) {
                if (isHistory && isHistory === true) {
                    //jsonRes.TxId = res.value.tx_id;
                    jsonRes.TxId = res.value.txId;
                    jsonRes.Timestamp = res.value.timestamp;
                    jsonRes.Timestamp = new Date((res.value.timestamp.seconds.low * 1000));
                    let ms = res.value.timestamp.nanos / 1000000;
                    jsonRes.Timestamp.setMilliseconds(ms);
                    if (res.value.is_delete) {
                        jsonRes.IsDelete = res.value.is_delete.toString();
                    } else {
                        try {
                            jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                            // report the commercial paper states during the asset lifecycle, just for asset history reporting
                           /* switch (jsonRes.Value.currentState) {
                                case 1:
                                    jsonRes.Value.currentState = 'ISSUED';
                                    break;
                                case 2:
                                    jsonRes.Value.currentState = 'PENDING';
                                    break;
                                case 3:
                                    jsonRes.Value.currentState = 'TRADING';
                                    break;
                                case 4:
                                    jsonRes.Value.currentState = 'REDEEMED';
                                    break;
                                default: // else, unknown named query
                                    jsonRes.Value.currentState = 'UNKNOWN';
                            }*/

                        } catch (err) {
                            console.log(err);
                            jsonRes.Value = res.value.value.toString('utf8');
                        }
                    }
                } else { // non history query ..
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            // check to see if we have reached the end
            if (res.done) {
                // explicitly close the iterator
                console.log('iterator is done');
                await iterator.close();
                return allResults;
            }

        }  // while true
    }


}

module.exports = TicketContract;
