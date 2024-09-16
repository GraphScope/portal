import { describe, it, expect, vi } from 'vitest';
import { Properties, Property } from '../../src/types/property';
import { encodeProperties } from '../../src/utils/encode';

describe('encodeProperties', () => {
  const encodeCallback = vi.fn();

  const sampleProperty: Property = {
    name: 'age',
    value: 30,
    compare: '>',
    id: '1',
  };

  const sampleProperties: Properties = {
    belongId: '123',
    belongType: 'node',
    data: [sampleProperty],
  };

  const sampleProperty2: Property = {
    name: 'height',
    value: 170,
    compare: '=',
    id: '2',
  };

  const sampleProperties2: Properties = {
    belongId: '456',
    belongType: 'edge',
    data: [sampleProperty2],
  };

  it('should generate correct statement for each property', () => {
    encodeProperties(encodeCallback, [sampleProperties]);

    expect(encodeCallback).toHaveBeenCalledWith(sampleProperties, sampleProperties.data, [
      {
        ...sampleProperty,
        statement: 'age > 30',
      },
    ]);
  });

  it('should handle empty properties array', () => {
    encodeProperties(encodeCallback, []);

    expect(encodeCallback).toHaveBeenCalled(0);
  });

  it('should handle properties with empty data array', () => {
    const emptyDataProperties: Properties = {
      belongId: '999',
      belongType: 'node',
      data: [],
    };

    encodeProperties(encodeCallback, [emptyDataProperties]);

    expect(encodeCallback).toHaveBeenCalledWith(emptyDataProperties, [], []);
  });

  it('should handle properties with missing type', () => {
    const missingTypeProperty: Property = {
      name: 'weight',
      value: 70,
      compare: '>=',
      id: '4',
    };

    const missingTypeProperties: Properties = {
      belongId: '101',
      belongType: 'edge',
      data: [missingTypeProperty],
    };

    encodeProperties(encodeCallback, [missingTypeProperties]);

    expect(encodeCallback).toHaveBeenCalledWith(missingTypeProperties, missingTypeProperties.data, [
      {
        ...missingTypeProperty,
        statement: 'weight >= 70',
      },
    ]);
  });

  it('should handle properties with number value as 0', () => {
    const zeroValueProperty: Property = {
      name: 'score',
      value: 0,
      compare: '=',
      id: '5',
    };

    const zeroValueProperties: Properties = {
      belongId: '102',
      belongType: 'node',
      data: [zeroValueProperty],
    };

    encodeProperties(encodeCallback, [zeroValueProperties]);

    expect(encodeCallback).toHaveBeenCalledWith(zeroValueProperties, zeroValueProperties.data, [
      {
        ...zeroValueProperty,
        statement: 'score = 0',
      },
    ]);
  });

  it('should handle properties with empty name', () => {
    const emptyNameProperty: Property = {
      name: '',
      value: 100,
      compare: '<',
      id: '6',
    };

    const emptyNameProperties: Properties = {
      belongId: '103',
      belongType: 'node',
      data: [emptyNameProperty],
    };

    encodeProperties(encodeCallback, [emptyNameProperties]);

    expect(encodeCallback).toHaveBeenCalledWith(emptyNameProperties, emptyNameProperties.data, [
      {
        ...emptyNameProperty,
        statement: ' < 100',
      },
    ]);
  });

  it('should handle properties with empty compare operator', () => {
    const emptyCompareProperty: Property = {
      name: 'length',
      value: 200,
      compare: '',
      id: '7',
    };

    const emptyCompareProperties: Properties = {
      belongId: '104',
      belongType: 'edge',
      data: [emptyCompareProperty],
    };

    encodeProperties(encodeCallback, [emptyCompareProperties]);

    expect(encodeCallback).toHaveBeenCalledWith(emptyCompareProperties, emptyCompareProperties.data, [
      {
        ...emptyCompareProperty,
        statement: 'length  200',
      },
    ]);
  });

  it('should not fail when property has no compare or value', () => {
    const incompleteProperty: Property = {
      name: 'depth',
      // @ts-ignore
      value: undefined,
      // @ts-ignore
      compare: undefined,
      id: '8',
    };

    const incompleteProperties: Properties = {
      belongId: '105',
      belongType: 'edge',
      data: [incompleteProperty],
    };

    encodeProperties(encodeCallback, [incompleteProperties]);

    expect(encodeCallback).toHaveBeenCalledWith(incompleteProperties, incompleteProperties.data, [
      {
        ...incompleteProperty,
        statement: 'depth undefined undefined',
      },
    ]);
  });

  it('should work correctly when property list has multiple values', () => {
    const multipleProperties: Properties = {
      belongId: '106',
      belongType: 'node',
      data: [sampleProperty, sampleProperty2],
    };

    encodeProperties(encodeCallback, [multipleProperties]);

    expect(encodeCallback).toHaveBeenCalledWith(multipleProperties, multipleProperties.data, [
      {
        ...sampleProperty,
        statement: 'age > 30',
      },
      {
        ...sampleProperty2,
        statement: 'height = 170',
      },
    ]);
  });
});
