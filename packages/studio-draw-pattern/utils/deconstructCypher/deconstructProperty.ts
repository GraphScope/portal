import { Property } from "../../types/property";

const deconstructProperty = (value: string): Property[] => {
  const propertiesRegexp = /\{.+\}/g;
  const propertyRegexp = /(?<=[\,\{]).+?(?=[\,\}])/g;
  const propertyNameRegexp = /.+?(?=\:)/g;
  const propertyNumberRegexp = /(?<=\:\s?)\d+/g;
  const propertyStringRegexp = /(?<=\:\s?[\"\']).+(?=[\"\'])/g;
  const properties = value.match(propertiesRegexp);
  let propertiesArray: RegExpMatchArray | null = null;
  if (properties) propertiesArray = properties[0].match(propertyRegexp);
  let propertyArray: Property[] = [];
  propertiesArray?.forEach((item, propertyIndex) => {
    const propertyName = item.match(propertyNameRegexp);
    const propertyNumberValue = item.match(propertyNumberRegexp);
    const propertyStringValue = item.match(propertyStringRegexp);

    if (propertyName && (propertyNumberValue || propertyStringValue)) {
      propertyArray.push({
        name: propertyName[0],
        value: propertyStringValue
          ? String(propertyStringValue[0])
          : Number(propertyNumberValue![0]),
        type: propertyStringValue ? "string" : "number",
      });
    }
  });
  return propertyArray;
};

export default deconstructProperty;
