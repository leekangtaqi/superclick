'use strict';
import mongoose, { Schema } from 'mongoose'
import activityOpts from './ActivityModel'

const ConcertSchema = new Schema(Object.assign({
  status: {
    type: String,
    enums: ['undetermined', 'preorder', 'selling', 'started'],
    default: 'undetermined'
  }
}, activityOpts),{
  timestamps:true
})

ConcertSchema.set('toObject', {
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

export default mongoose.model('Concert', ConcertSchema)