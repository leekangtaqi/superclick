'use strict';
import mongoose, { Schema } from 'mongoose'

const ActivitySchema = {
  isRequireCertification: {
    type: {
      type: Boolean
    },
    default: false
  },
  isPreorder: {
    type: Boolean
  },
  isPresell: {
    type: Boolean
  },
  payment: {
    preorder: {
      type: Number
    },
    amount: {
      type: Number
    }
  },
  status: {
    type: String,
    enums: ['undetermined', 'preorder', 'selling', 'started'],
    default: 'undetermined'
  },
  time: {
    init: {
      type: Date
    },
    preorder: {
      type: Date
    },
    presell: {
      type: Date
    }
  },
  title: {
    type: String,
    required: true
  },
  organizer: {
    type: String
  }
}

export default ActivitySchema