/**
* Client.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      firstName : {
          type:'string'
      },

      lastName : {
          type:'string'
      },

      email : {
          type:'email'
      },

      banned : {
          type:'boolean',
          defaultsTo: false
      },

      // The 4 latest digits of the credit card
      lastCardNumber : {
          type:'string'
      },

      type_card : {
          type:'string'
      },

      newsletter : {
          type:'boolean'
      },

      expired_key_mail : {
          type:'boolean'
      },

      sales:{
          collection: 'sale',
          via: 'client'
      }

  }
};

