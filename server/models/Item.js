const { Schema } = require('mongoose');

//Subdocument schema
const itemSchema = new Schema({

    itemId: {
        type: Number,
    },

    itemName: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
      },

      purchasePrice: {
        type: Number,
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
      },

      saleQuantity: {
        type: Number,
        required: true,
      },

      postLinks: [
          {
          type: String,
      },
    ],

      highestSellingPrice: {
        type: Number,
        required: true,
      },

      lowestSellingPrice: {
        type: Number,
        required: true,
      },

      averageSellingPrice: {
        type: Number,
        required: true,
      },

      itemImages: [
          {
              type: String,
          }
      ],
    });

    

    module.exports = itemSchema;