const lookupObj = require('../db/seeds/utils2');

describe('lookupObj', () => {
  test('Returns an empty object when an empty array passes through', () => {
    const input = [];
    const actual = lookupObj(input);
    const expected = {};

    expect(actual).toEqual(expected);
  });

  test('Returns an empty object when an array of one employee passes through without key or value arguments', () => {
    const employee = [{ name: 'Kevin', id: 'dS8rJns', secretFear: 'spiders' }];
    const actual = lookupObj(employee);
    const expected = {};

    expect(actual).toEqual(expected);
  });

  test('Returns the object with the required key value pair when an array of one employee, key and value passes through', () => {
    const employee = [{ name: 'Kevin', id: 'dS8rJns', secretFear: 'spiders' }];
    const actual = lookupObj(employee, 'name', 'id');
    const expected = { Kevin: 'dS8rJns' };

    expect(actual).toEqual(expected);
  });

  test('Returns the object with the required key value pair when an array of two employees, key and value passes through', () => {
    const employee = [
      { name: 'Kevin', id: 'dS8rJns', secretFear: 'spiders' },
      { name: 'Simon', id: 'Pk34ABs', secretFear: 'mice' },
    ];
    const actual = lookupObj(employee, 'name', 'id');
    const expected = { Kevin: 'dS8rJns', Simon: 'Pk34ABs' };

    expect(actual).toEqual(expected);
  });

  test('Returns the object with the required key value pair when an array employees, key and value passes through', () => {
    const employee = [
      { name: 'Kevin', id: 'dS8rJns', secretFear: 'spiders' },
      { name: 'Simon', id: 'Pk34ABs', secretFear: 'mice' },
      { name: 'Jim', id: 'lk1ff8s', secretFear: 'bears' },
      { name: 'David', id: 'og8r0nV', secretFear: 'Kevin' },
    ];
    const actual = lookupObj(employee, 'name', 'secretFear');
    const expected = {
      Kevin: 'spiders',
      Simon: 'mice',
      Jim: 'bears',
      David: 'Kevin',
    };

    expect(actual).toEqual(expected);
  });

  test('Original array of objects is unmutated', () => {
    const employee = [{ name: 'Kevin', id: 'dS8rJns', secretFear: 'spiders' }];
    const actual = lookupObj(employee, 'id', 'secretFear');
    const expected = { spiders: 'dS8rJns' };

    expect(expected).not.toBe(employee);
    expect(expected).not.toBe(employee[0]);
  });
});
