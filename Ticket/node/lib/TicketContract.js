/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const Ticket = require("./Ticket");
const {Contract} = require('fabric-contract-api');


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


    async _issue(ctx, ticketNumber, buyer, ticketType,  price, buyDateTime) {
        let ticket = Ticket.createInstance(ticketNumber, buyer, ticketType,  price, buyDateTime)
        // let mspid = ctx.clientIdentity.getMSPID();
        // ticket.setOwnerMSP(mspid)
        ticket.setStatusNew()
        ticket.setBuyer(buyer)
        ticket.setOwner(buyer)
        let key = ctx.stub.createCompositeKey(buyer, [ticketNumber, buyDateTime]);
        let data = Ticket.serialize(ticket);
        await ctx.stub.putState(key, data);
        return ticket
    }

}

module.exports = TicketContract;
