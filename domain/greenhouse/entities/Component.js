var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const { DotService } = require('./Dotbot');

const PropertySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'validation.required'],
    match: [/^[a-zA-Z_$][a-zA-Z_\-$0-9]*$/, 'validation.regex'],
    trim: true,
  },
  valueType: {
    type: String,
    required: [true, 'validation.required'],
    enum:  {
      values: ['fixed', 'developer', 'publisher'],
      message: 'validation.option'
    },
    trim: true,
    default: 'fixed'
  },
  inputType: {
    type: String,
    required: [true, 'validation.required'],
    enum:  {
      values: ['select', 'text', 'textarea'],
      message: 'validation.option'
    },
    trim: true,
    default: 'text',
  },
  options: {  // options: ["Ms", "Mr", "Mx", "Dr", "Madam", "Lord"]
    type: String,
    trim: true,
  },
  required: {
    type: String,
    required: [true, 'validation.required'],
    enum:  {
      values: ['yes', 'no'],
      message: 'validation.option'
    },
    trim: true,
    default: 'yes'
  },
  value: {
    type: String,
    trim: true
  },
});


const ComponentSchema = mongoose.Schema({
  componentType: {
    type: String,
    required: [true, 'validation.required'],
    enum:  {
      values: ['botengine', 'service', 'channel'],
      message: 'validation.option'
    },
    trim: true,
    index: true,
  },
  category: {
    type: String,
    required: [true, 'validation.required'],
    enum:  {
      values: ['general', 'weather'],
      message: 'validation.option'
    },
    trim: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'validation.required'],
    index: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  license: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  key: {
    type: String,
    required: [true, 'validation.required'],
    match: [/^[a-zA-Z_$][a-zA-Z_$0-9]*$/, 'validation.regex'],
    // match: [/^[^a-zA-Z_$]|[^\\w$]/, 'validation.regex'],
    index: true,
    unique: true,
    trim: true
  },
  functionName: {
    type: String,
    required: [true, 'validation.required'],
    match: [/^[a-zA-Z_$][a-zA-Z_$0-9]*$/, 'validation.regex'],
    trim: true
  },
  url: {
    type: String,
    required: [true, 'validation.required'],
    trim: true
  },
  httpMethod: {
    type: String,
    required: [true, 'validation.required'],
    enum:  {
      values: ['GET', 'POST'],
      message: 'validation.option'
    },
    trim: true,
    default: 'GET'
  },
  timeout: {
    type: Number,
    min: [0, 'validation.option'],
    max: [9999, 'validation.option'],
    required: [true, 'validation.required'],
    default: 30,
  },
  pricingModel: {
    type: String,
    required: [true, 'validation.required'],
    enum:  {
      values: ['free', 'pay_per_use', 'pay_per_month', 'pay_per_use_or_month'],
      message: 'validation.option'
    },
    trim: true,
    index: true,
    default: 'free'
  },
  pricePerUse: {
    type: Number,
    min: [0, 'validation.option'],
    max: [9999, 'validation.option'],
    required: [true, 'validation.required'],
    default: 0,
    index: true
  },
  pricePerMonth: {
    type: Number,
    min: [0, 'validation.option'],
    max: [9999, 'validation.option'],
    required: [true, 'validation.required'],
    default: 0,
    index: true
  },
  status: {
    type: String,
    required: [true, 'validation.required'],
    enum:  {
      values: ['enabled', 'disabled'],
      message: 'validation.option'
    },
    trim: true,
    index: true,
  },
  picture: {
    type: String,
    trim: true,
    default: '',
  },
  username: {
    type: String,
    required: [true, 'validation.required'],
    match: [/^[a-zA-Z0-9]+$/, 'validation.regex'],
    index: true,
    trim: true
  },
  properties: {
    type: [ PropertySchema ],
  },
  headers: {
    type: [ PropertySchema ],
  },
  predefinedVars: {
    type: [ PropertySchema ],
  },
  mappedVars: {
    type: [ PropertySchema ],
  },
}, {timestamps: true});

ComponentSchema.set('toJSON', { getters: true, virtuals: true });
ComponentSchema.set('toObject', { getters: true, virtuals: true });

ComponentSchema.plugin(uniqueValidator, { message: 'domain.component.validation.unique_{PATH}' });

ComponentSchema.virtual('pictureUrl').get(function () {
  if (this.picture === '') {
    return '/images/component-default.png';
  } else {
    return `/uploads/${this.picture}`;
  }
});

ComponentSchema.methods.hasInputsFor = function(valueType, group) {
  /* if (group === 'properties' || group === '') {
    for (let i = 0; i < this.properties.length; i++) {
      if (this.properties[i].valueType === valueType) {
        return true;
      }
    }
  }
  if (group === 'headers' || group === '') {
    for (let i = 0; i < this.headers.length; i++) {
      if (this.headers[i].valueType === valueType) {
        return true;
      }
    }
  }
  if (group === 'predefinedVars' || group === '') {
    for (let i = 0; i < this.predefinedVars.length; i++) {
      if (this.predefinedVars[i].valueType === valueType) {
        return true;
      }
    }
  }
  if (group === 'mappedVars' || group === '') {
    for (let i = 0; i < this.mappedVars.length; i++) {
      if (this.mappedVars[i].valueType === valueType) {
        return true;
      }
    }
  } */
  return false;
};

ComponentSchema.post('save', async function(doc) {
  return;
  await DotService.deleteOne({componentId: doc._id});
  let dotservice = new DotService({ componentId: doc._id });
  dotservice.title = doc.name;
  dotservice.serviceId = doc.key;
  dotservice.category = doc.category;
  dotservice.function_name = doc.functionName;
  dotservice.cost = doc.pricePerUse;
  dotservice.headers = new Map();
  dotservice.predefined_vars = new Map();
  dotservice.mapped_vars = new Map();
  for (let i = 0; i < doc.headers.length; i++) {
    dotservice.headers.set(doc.headers[i].name, doc.headers[i].value);
  }
  for (let i = 0; i < doc.predefinedVars.length; i++) {
    dotservice.predefined_vars.set(doc.predefinedVars[i].name, doc.predefinedVars[i].value);
  }
  for (let i = 0; i < doc.mappedVars.length; i++) {
    dotservice.mapped_vars.set(doc.mappedVars[i].name, doc.mappedVars[i].value);
  }
  dotservice.pricingModel = doc.pricingModel;
  dotservice.perUseCost = doc.pricePerUse;
  dotservice.monthlyCost = doc.pricePerMonth;
  await dotservice.save();
});

module.exports = {
  PropertySchema,
  Component: mongoose.model('Components', ComponentSchema)
}
