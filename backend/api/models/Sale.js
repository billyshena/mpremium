/**
* Sales.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

      date : {
          type:'datetime'
      },

      activated:{
          type: 'boolean',
          defaultsTo: false
      },

      product : {
          model: 'product'
      },

      client : {
          model : 'client'
      }



  }
};

