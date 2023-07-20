import { getClass } from '@actualwave/get-class';

import convertArray from './Array.js';
import convertBoolean from './Boolean.js';
import convertDate from './Date.js';
import convertError from './Error.js';
import convertFunction from './Function.js';
import convertMap from './Map.js';
import convertNumber from './Number.js';
import convertObject from './Object.js';
import convertSet from './Set.js';
import convertString from './String.js';
import convertSymbol from './Symbol.js';

// Every value in JS has .constructor property
// use Map to store handlers for every type in this case every
// handler could be replaced and customizable

const types = new Map();

/**
 * Type handler signature func(value:*, convertType:(value:*)): String|Array|Object;
 * @param {*} constructor
 * @param {*} handler
 */
export const addTypeHandler = (constructor, handler) => {
  if (constructor && handler) {
    types.delete(constructor);
    types.set(constructor, handler);
  }
};

export const hasTypeHandler = (constructor) => types.has(constructor);

export const getTypeHandler = (constructor) => types.get(constructor);

export const removeTypeHandler = (constructor) => types.delete(constructor);

export const defaultTypeHandlerSelector = (value) => {
  const type = getClass(value);

  return type && getTypeHandler(type);
};

let typeHandlerSelector = defaultTypeHandlerSelector;

/*
 * Used to get type handler instead of getTypeHandler(), can be customized.
 * @param {*} value
 */
export const selectTypeHandler = (value) => typeHandlerSelector(value);

/**
 * Used to customize type selection algorythm, by default it just gets current
 * constructor value and looks for its handler.
 * @param {*} newSelector
 */
export const setTypeHandlerSelector = (newSelector) => {
  typeHandlerSelector = newSelector;
};

addTypeHandler(Array, convertArray);
addTypeHandler(Boolean, convertBoolean);
addTypeHandler(Date, convertDate);
addTypeHandler(Error, convertError);
addTypeHandler(Function, convertFunction);
addTypeHandler(Map, convertMap);
addTypeHandler(Number, convertNumber);
addTypeHandler(Object, convertObject);
addTypeHandler(Set, convertSet);
addTypeHandler(String, convertString);
addTypeHandler(Symbol, convertSymbol);
