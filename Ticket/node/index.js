/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const ticketContract = require('./lib/TicketContract.js');

module.exports.TicketContract = ticketContract;
module.exports.contracts = [ticketContract];
