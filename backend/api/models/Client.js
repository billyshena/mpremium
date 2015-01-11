/**
* Client.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

      email : {
          type:'email'
      },

      banned : {
          type:'boolean',
          defaultsTo: false
      },

      newsletter : {
          type:'boolean',
          defaultsTo: false
      },

      expired_key_mail : {
          type:'boolean',
          defaultsTo: true
      },

      sales: {
          collection: 'sale',
          via: 'client'
      },

      cards: {
          collection: 'card',
          via: 'clients'
      }
  }
};

