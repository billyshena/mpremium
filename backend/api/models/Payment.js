/**
* Payment.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
        sale : {
            model : "sale"
        },

        card : {
            model : 'card'
        },

        created : {
            type : 'date'
        },

        amount : {
            type: 'string'
        },

        currency : {
            type: 'string'
        }
  }
};

