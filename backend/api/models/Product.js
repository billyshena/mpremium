/**
* Products.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

      name : {
          type:'string'
      },

      key : {
          type:'string'
      },

      purchasing_price : {
          type:'string'
      },

      selling_price : {
          model:'sellingPrice'
      },

      sale : {
          type:'boolean'
      },

      activate : {
          type:'boolean'
      },

      sales : {
          collection:'sale',
          via : 'product'
      },

      rescueStock : {
          model:'rescuestock'
      },

      stock : {
          model:'stock'
      },

      provider : {
          model : 'provider'
      }
  }
};

