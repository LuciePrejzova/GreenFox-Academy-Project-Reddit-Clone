"use strict";

class Filters {
  filterOutUndefinedValues({ ...values }) {
    const filteredValues = Object.entries(values).reduce(
      (a, [k, v]) => (v === undefined ? a : ((a[k] = v), a)),
      {}
    );

    return filteredValues;
  }
}

const filters = new Filters();
export { filters, Filters };

