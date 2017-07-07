'use strict';
import mongoose, { Schema } from 'mongoose'

const OrderSchema = new Schema({
  user: {
    type: String,
    ref: 'User',
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enums: ['idle', 'preorder', 'ordered', 'finished', 'canceled'],
    default: 'idle'
  },
  assignedSeat: {
    no: {
      type: String
    },
    desc: {
      type: String
    }
  },
  preorder: {
    type: String,
    ref: 'Preorder'
  },
  partakers: [{
    type: String,
    ref: 'User'
  }]
},{
  timestamps:true
})

OrderSchema.set('toObject', {
  getters: true,
  virtuals: true,
  transform: function(doc, ret, options) {
    options.hide = options.hide || '_id __v createdAt updatedAt'
    if (options.hide) {
      options.hide.split(' ').forEach(function (prop) {
        delete ret[prop];
      })
    }
  }
})

export default mongoose.model('Order', OrderSchema)