
'use strict';

const STATUS = {
    NEW:'NEW',
    USED:'USED',
    REDEEM:'REDEEMED'
}


class Ticket {

    constructor(obj) {
        Object.assign(this, obj);
    }

    setOwnerMSP(mspid){
        this.mspid = mspid
    }

    setBuyer(buyer){
        this.buyer = buyer
    }

    setOwner(owner){
        this.owner = owner
    }

    setStatusNew(){
        this.status = STATUS.NEW
    }

    setStatusUsed(){
        this.status = STATUS.USED
    }

    setStatusRedeem(){
        this.status = STATUS.REDEEM
    }

    static fromBuffer(buffer) {
        return Ticket.deserializeClass(buffer,Ticket);
    }


    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserializeClass(data, objClass) {
        let json = JSON.parse(data.toString());
        let object = new (objClass)(json);
        return object;
    }

    static serialize(object) {
        // don't write the key:value passed in - we already have a real composite key, issuer and paper Number.
        delete object.key;
        return Buffer.from(JSON.stringify(object));
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(ticketNumber, buyer, ticketType,  price, buyDateTime) {
        return new Ticket({ ticketNumber, buyer, ticketType,  price, buyDateTime});
    }

    static getClass() {
        return 'org.papernet.commercialpaper';
    }
}

module.exports = Ticket;
