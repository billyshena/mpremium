/**
* Card.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

      clients : {
          collection : "client",
          via : "cards"
      },

      lastCreditCardNumbers : {
          type:'string'
      },

      brand : {
          type : 'string'
      },

      country : {
          type : 'string'
      },

      payments : {
          collection : 'payment',
          via : 'card'
      }
  }
};

