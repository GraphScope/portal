/* tslint:disable */
/* eslint-disable */
/**
 * GraphScope FLEX HTTP SERVICE API
 * This is a specification for GraphScope FLEX HTTP service based on the OpenAPI 3.0 specification. You can find out more details about specification at [doc](https://swagger.io/specification/v3/).  Some useful links: - [GraphScope Repository](https://github.com/alibaba/GraphScope) - [The Source API definition for GraphScope Interactive](https://github.com/GraphScope/portal/tree/main/httpservice)
 *
 * OpenAPI spec version: 0.9.1
 * Contact: graphscope@alibaba-inc.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import {
    
} from ".";

/**
 * 
 *
 * @export
 * @interface EdgeTypeVertexTypePairRelation
 */
export interface EdgeTypeVertexTypePairRelation {

    /**
     * @type {string}
     * @memberof EdgeTypeVertexTypePairRelation
     */
    sourceVertexType?: string;

    /**
     * @type {string}
     * @memberof EdgeTypeVertexTypePairRelation
     */
    destinationVertexType?: string;

    /**
     * @type {string}
     * @memberof EdgeTypeVertexTypePairRelation
     */
    relation?: EdgeTypeVertexTypePairRelationRelationEnum;
}

/**
 * @export
 * @enum {string}
 */
export enum EdgeTypeVertexTypePairRelationRelationEnum {
    MANYTOMANY = 'MANY_TO_MANY',
    ONETOMANY = 'ONE_TO_MANY',
    MANYTOONE = 'MANY_TO_ONE'
}

