/**
* Costs.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      entitled : {
          type:'string'
      },

      price : {
          type:'string'
      },

      date : {
          type:'date'
      },

      description : {
          type:'string'
      },

      client:{
          model:'client'
      }

  }
};

