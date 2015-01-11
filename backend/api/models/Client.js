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

      password: {
          type: 'string'
      },

      banned : {
          type:'boolean',
          defaultsTo: false
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
      },

      cards : {
          collection: 'card',
          via:'client'
      }

  }
};

