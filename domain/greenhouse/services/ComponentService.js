const ValidationError = require('mongoose/lib/error/validation');
const { Component, Property } = require('../entities/Component');


class ComponentNotFoundError extends ValidationError {
  constructor(message) {
    super(message);
    this.name = 'ComponentNotFoundError';
    this.errors['_'] = { message: 'domain.component.validation.component_not_found' };
  }
}

class ForbiddenComponentError extends ValidationError {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenComponentError';
    this.errors['_'] = { message: 'domain.component.validation.forbidden_component' };
  }
}

class PropertyNotFoundError extends ValidationError {
  constructor(message) {
    super(message);
    this.name = 'PropertyNotFoundError';
    this.errors['_'] = { message: 'domain.property.validation.property_not_found' };
  }
}

const ComponentService = {

  createComponent: async (componentType, category, name, description, functionName, url, price,
    status, username) => {
      let component = new Component({
        componentType,
        category,
        name,
        description,
        functionName,
        url,
        price,
        status,
        username
      });
    component.properties = [];
    return await component.save();
  },

  updateComponent: async (username, component) => {
    const savedComponent = await ComponentService.findMyComponentById(username, component._id);
    return await component.save();
  },

  findComponentById: async (id) => {
    let component = await Component.findById(id).exec();
    if (!component) {
      throw new ComponentNotFoundError();
    }
    return component;
  },

  findMyComponentById: async (username, id) => {
    let component = await Component.findById(id).exec();
    if (!component) {
      throw new ComponentNotFoundError();
    }
    if (component.username === username) {
      return component;
    } else {
      throw new ForbiddenComponentError('');
    }
  },

  findPaginatedComponents: async (resultsPerPage, currentPage, username, search, componentType, status, sortBy, sortType) => {
    let query = {}
    let sorting = {}
    if (username !== '' ) {
      query['username'] = username;
    }
    if (search !== '') {
      query['$and'] = [{ $or: [{name: { $regex:  `.*${search}.*`, $options: 'i' }}, {description: { $regex:  `.*${search}.*`, $options: 'i' }}] }];
    }
    if (componentType !== '' ) {
      query['componentType'] = componentType;
    }
    if (status !== '' ) {
      query['status'] = status;
    }
    if (sortBy !== '' ) {
      sorting[sortBy] = sortType;
    }
    const results = await Component.find(query)
      .sort(sorting)
      .skip((resultsPerPage * currentPage) - resultsPerPage)
      .limit(resultsPerPage);
    const resultsCount = await Component.countDocuments(query);
    const pagesCount = Math.ceil(resultsCount / resultsPerPage);
    return {
      results,
      resultsCount,
      currentPage,
      pagesCount,
    }
  },

  deleteComponentById: async (username, id) => {
    let component = await ComponentService.findMyComponentById(username, id);
    return await Component.deleteOne({_id: id});
  },


  normalizePropertyErrors(err) {
    if (err.errors) {
      let keys = Object.keys(err.errors);
      let values = Object.values(err.errors);
      for (let i = 0; i < keys.length; i++) {
        if (keys[i].startsWith('properties.')) {
          let parts = keys[i].split('.');
          err.errors[keys[i]] = parts[2];
          Object.defineProperty(err.errors, parts[2],
            Object.getOwnPropertyDescriptor(err.errors, keys[i]));
            err.errors[parts[2]] = values[i];
            delete err.errors[keys[i]];
        }
      }
    }
    return err;
  },

  addComponentProperty: async (username, id, property) => {
    let component = await ComponentService.findMyComponentById(username, id);
    component.properties.push(property);
    try {
      return await component.save();
    } catch (err) {
      if (err instanceof ValidationError) {
        throw ComponentService.normalizePropertyErrors(err);
      }
    }
  },

  findProperty: async (component, propertyId) => {
    let p = await component.properties.id(propertyId);
    if (p === null) {
      throw new PropertyNotFoundError();
    } else {
      return p;
    }
  },

  updateComponentProperty: async (username, id, property) => {
    let component = await ComponentService.findMyComponentById(username, id);
    let p = await ComponentService.findProperty(component, property._id);
    p.name = property.name;
    p.inputType = property.inputType;
    p.options = property.options;
    p.required = property.required;
    try {
      await component.save();
    } catch (err) {
      if (err instanceof ValidationError) {
        throw ComponentService.normalizePropertyErrors(err);
      }
    }
  },

  deleteComponentProperty: async (username, id, property) => {
    let component = await ComponentService.findMyComponentById(username, id);
    let p = await ComponentService.findProperty(component, property._id);
    p.remove();
    return await component.save();
  },

  reorderComponentProperties: async (username, id, propertyIds) => {
    let component = await ComponentService.findMyComponentById(username, id);
    let p = new Array(propertyIds.length);
    for (let i = 0; i < propertyIds.length; i++) {
      p[i] = await ComponentService.findProperty(component, propertyIds[i]);
    }
    component.properties = p;
    return await component.save();
  }
}

module.exports = {
  ComponentNotFoundError,
  ForbiddenComponentError,
  PropertyNotFoundError,
  ComponentService,
}


