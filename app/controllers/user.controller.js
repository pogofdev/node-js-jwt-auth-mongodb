const TRANS_TYPE = require("../Constants");

const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Query = require("../blockchain/businesses/query");
const Invoke = require("../blockchain/businesses/invoke");
const User = db.user;
const Role = db.role;

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {

    User.findById(req.userId).exec(async (err, user) => {
        // console.log('thogn tin cua tao', user)

        try {
            let result = await User.findOne({username: user.username}).populate("roles", "-__v").exec();
            var authorities = [];
            let myBalance = null

            for (let i = 0; i < result.roles.length; i++) {
                authorities.push(result.roles[i].name.toUpperCase());
            }
            //lay thong tin current ballance
            myBalance = await Query.getCurrentBalance(user.username)
            /*  switch (authorities[0]) {
                  case 'INTEGRATE':
                      myBalance = await Query.getCurrentBalance(req.body.username)

                      break;
                  case 'USER':
                      break;

              }*/

            res.status(200).send({
                id: result._id,
                username: result.username,
                email: result.email,
                roles: authorities,
                // ownedItems: 0,
                balance: myBalance && myBalance.balance ? myBalance.balance : 0,
                totalSupply: myBalance && myBalance.totalSupply && user.username === 'integrate' ? myBalance.totalSupply : 0
            });

        } catch (e) {
            res.status(500).send({message: e.toString()});
            return;
        }
    });

    // res.status(200).send("User Content.");
};


exports.mint = async (req, res) => {

    let user = await User.findById(req.userId).populate("roles", "-__v").exec();

    try {
        var authorities = [];
        for (let i = 0; i < user.roles.length; i++) {
            authorities.push(user.roles[i].name.toUpperCase());
        }
        //lay thong tin current ballance
        if (authorities[0] === 'INTEGRATE') {
            let rs = await Invoke.mint(user.username, req.body.amount)
            res.status(200).send(rs);
        } else {
            throw 'Sorry!!!'
        }


    } catch (e) {
        res.status(404).send({message: e.toString()});
        return;
    }

    // res.status(200).send("User Content.");
};


exports.transfer = async (req, res) => {

    try {
        console.log('====>', req.body)
        let fromUser = await User.findById(req.userId).populate("roles", "-__v").exec();
        let toUser = await User.findOne({username: req.body.recipient}).populate("roles", "-__v").exec();
        if (!fromUser || !toUser) {
            res.status(200).send({success: false, error: 'Recipient does not exist'});
        } else {
            let rs = await Invoke.transfer(fromUser.username, toUser.username, req.body.amount, Date.now(),TRANS_TYPE.TRANSFER_TOKENS,fromUser.username ==='integrate' ? `Buy tokens`:`Transfer tokens to other user`)
            res.status(200).send(rs);
        }
        /*   var authorities = [];
           for (let i = 0; i < user.roles.length; i++) {
               authorities.push(user.roles[i].name.toUpperCase());
           }
           //lay thong tin current ballance
           if (authorities[0] === 'INTEGRATE') {
               let rs = await Invoke.mint(user.username,req.body.amount)
               res.status(200).send(rs);
           } else {
               throw 'Sorry!!!'
           }*/
        // console.log(toUser)


    } catch (e) {
        res.status(200).send({success: false, error: e.toString()});
    }

    // res.status(200).send("User Content.");
};


exports.transactions = async (req, res) => {

    try {
        let fromUser = await User.findById(req.userId).populate("roles", "-__v").exec();
        if (!fromUser) {
            res.status(200).send({success: false, error: 'Recipient does not exist'});
        } else {
            let trans = []
            let rs = await Query.getTransactions(fromUser.username)
            // console.log('====>',rs)
            try {
                for(let i=rs.length-1;i>=0;i--){
                    // console.log(Object.keys(rs[i].Record).length)
                    if(Object.keys(rs[i].Record).length===8){
                        let temp = Object.assign({},rs[i].Record)
                        if(temp.from === fromUser.username){
                            temp.amount = -temp.amount
                            temp.balance = temp.fromUpdatedBalance
                        }else {
                            temp.balance = temp.toUpdatedBalance
                        }
                        trans.push(temp)
                    }
                }
             /*   trans = rs.map((item) => {
                    return item.Record
                })*/
            } catch (e) {

            }
            res.status(200).send(trans);

        }
        /*   var authorities = [];
           for (let i = 0; i < user.roles.length; i++) {
               authorities.push(user.roles[i].name.toUpperCase());
           }
           //lay thong tin current ballance
           if (authorities[0] === 'INTEGRATE') {
               let rs = await Invoke.mint(user.username,req.body.amount)
               res.status(200).send(rs);
           } else {
               throw 'Sorry!!!'
           }*/
        // console.log(toUser)


    } catch (e) {
        res.status(200).send({success: false, error: e.toString()});
    }

    // res.status(200).send("User Content.");
};


exports.getOwnerTickets = async (req, res) => {

    try {
        let fromUser = await User.findById(req.userId).populate("roles", "-__v").exec();
        if (!fromUser) {
            res.status(200).send({success: false, error: 'Recipient does not exist'});
        } else {
            let trans = []
            let rs = []
            var authorities = [];
            for (let i = 0; i < fromUser.roles.length; i++) {
                authorities.push(fromUser.roles[i].name.toUpperCase());
            }
            //lay thong tin current ballance
            if (authorities[0] === 'INTEGRATE') {
                rs = await Query.getIssuedTickets(fromUser.username)
            } else {
                rs = await Query.getOwnerTickets(fromUser.username)
            }



            // console.log('====>',rs)
            try {

                trans = rs.map((item) => {
                    return item.Record
                })
            } catch (e) {

            }
            res.status(200).send(trans);

        }



    } catch (e) {
        res.status(200).send({success: false, error: e.toString()});
    }

    // res.status(200).send("User Content.");
};

exports.getRedeemTickets = async (req, res) => {

    try {
        let fromUser = await User.findById(req.userId).populate("roles", "-__v").exec();
        if (!fromUser) {
            res.status(200).send({success: false, error: 'Recipient does not exist'});
        } else {
            let trans = []
            let rs = []
            var authorities = [];
            for (let i = 0; i < fromUser.roles.length; i++) {
                authorities.push(fromUser.roles[i].name.toUpperCase());
            }
            //lay thong tin current ballance
            if (authorities[0] === 'INTEGRATE') {
                rs = await Query.getRedeemTickets(fromUser.username)
            }



            // console.log('====>',rs)
            try {

                trans = rs.map((item) => {
                    return item.Record
                })
            } catch (e) {

            }
            res.status(200).send(trans);

        }



    } catch (e) {
        res.status(200).send({success: false, error: e.toString()});
    }

    // res.status(200).send("User Content.");
};

const PRICE = {
    OI93EX:465000,
    ZMGPBJ:900000,
    QW5ZGQ:140000,
}

exports.buy = async (req, res) => {

    try {
        console.log('====>', req.body)
        let fromUser = await User.findById(req.userId).populate("roles", "-__v").exec();
        if (!fromUser ) {
            res.status(200).send({success: false, error: 'Recipient does not exist'});
        } else {
            let rs = await Invoke.buy(`${req.userId}-${Date.now()}`,fromUser.username,req.body.ticketType, req.body.quantity,PRICE[req.body.ticketType], Date.now())
            console.log(rs)
            res.status(200).send(rs);
        }

    } catch (e) {
        res.status(200).send({success: false, error: e.toString()});
    }

};

exports.use = async (req, res) => {

    try {
        console.log('====>', req.body)
        let fromUser = await User.findById(req.userId).populate("roles", "-__v").exec();
        if (!fromUser ) {
            res.status(200).send({success: false, error: 'Recipient does not exist'});
        } else {
            var authorities = [];
            let rs = {}
            for (let i = 0; i < fromUser.roles.length; i++) {
                authorities.push(fromUser.roles[i].name.toUpperCase());
            }
            //neu la OIL_DEPOT_SHOP use thi la redeem ticket
            //nguoc lai la user su dung ticket
            if (authorities[0].toUpperCase() === 'OIL_DEPOT_SHOP') {
                rs = await Invoke.redeem(req.body.ticketNumbers,fromUser.username, Date.now())
            } else {
                rs = await Invoke.use(req.body.ticketNumbers,fromUser.username, Date.now())
            }

            console.log(rs)
            res.status(200).send(rs);
        }

    } catch (e) {
        res.status(200).send({success: false, error: e.toString()});
    }

};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};
