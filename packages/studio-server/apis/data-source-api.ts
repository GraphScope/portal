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

import globalAxios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
import { ApiResponse } from '../models';
import { DataSource } from '../models';
/**
 * DataSourceApi - axios parameter creator
 * @export
 */
export const DataSourceApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Bind data source to edge type
         * @param {string} graphName 
         * @param {string} labelName 
         * @param {DataSource} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        bindEdgeDataSource: async (graphName: string, labelName: string, body?: DataSource, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'graphName' is not null or undefined
            if (graphName === null || graphName === undefined) {
                throw new RequiredError('graphName','Required parameter graphName was null or undefined when calling bindEdgeDataSource.');
            }
            // verify required parameter 'labelName' is not null or undefined
            if (labelName === null || labelName === undefined) {
                throw new RequiredError('labelName','Required parameter labelName was null or undefined when calling bindEdgeDataSource.');
            }
            const localVarPath = `/api/v1/graph/{graph_name}/datasource/edge/{label_name}`
                .replace(`{${"graph_name"}}`, encodeURIComponent(String(graphName)))
                .replace(`{${"label_name"}}`, encodeURIComponent(String(labelName)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * Bind data source to vertex type
         * @param {string} graphName 
         * @param {string} labelName 
         * @param {DataSource} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        bindVertexDataSource: async (graphName: string, labelName: string, body?: DataSource, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'graphName' is not null or undefined
            if (graphName === null || graphName === undefined) {
                throw new RequiredError('graphName','Required parameter graphName was null or undefined when calling bindVertexDataSource.');
            }
            // verify required parameter 'labelName' is not null or undefined
            if (labelName === null || labelName === undefined) {
                throw new RequiredError('labelName','Required parameter labelName was null or undefined when calling bindVertexDataSource.');
            }
            const localVarPath = `/api/v1/graph/{graph_name}/datasource/vertex/{label_name}`
                .replace(`{${"graph_name"}}`, encodeURIComponent(String(graphName)))
                .replace(`{${"label_name"}}`, encodeURIComponent(String(labelName)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} graphName 
         * @param {string} labelName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getEdgeDataSource: async (graphName: string, labelName: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'graphName' is not null or undefined
            if (graphName === null || graphName === undefined) {
                throw new RequiredError('graphName','Required parameter graphName was null or undefined when calling getEdgeDataSource.');
            }
            // verify required parameter 'labelName' is not null or undefined
            if (labelName === null || labelName === undefined) {
                throw new RequiredError('labelName','Required parameter labelName was null or undefined when calling getEdgeDataSource.');
            }
            const localVarPath = `/api/v1/graph/{graph_name}/datasource/edge/{label_name}`
                .replace(`{${"graph_name"}}`, encodeURIComponent(String(graphName)))
                .replace(`{${"label_name"}}`, encodeURIComponent(String(labelName)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} graphName 
         * @param {string} labelName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getVertexDataSource: async (graphName: string, labelName: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'graphName' is not null or undefined
            if (graphName === null || graphName === undefined) {
                throw new RequiredError('graphName','Required parameter graphName was null or undefined when calling getVertexDataSource.');
            }
            // verify required parameter 'labelName' is not null or undefined
            if (labelName === null || labelName === undefined) {
                throw new RequiredError('labelName','Required parameter labelName was null or undefined when calling getVertexDataSource.');
            }
            const localVarPath = `/api/v1/graph/{graph_name}/datasource/vertex/{label_name}`
                .replace(`{${"graph_name"}}`, encodeURIComponent(String(graphName)))
                .replace(`{${"label_name"}}`, encodeURIComponent(String(labelName)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} graphName 
         * @param {string} labelName 
         * @param {DataSource} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateEdgeDataSource: async (graphName: string, labelName: string, body?: DataSource, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'graphName' is not null or undefined
            if (graphName === null || graphName === undefined) {
                throw new RequiredError('graphName','Required parameter graphName was null or undefined when calling updateEdgeDataSource.');
            }
            // verify required parameter 'labelName' is not null or undefined
            if (labelName === null || labelName === undefined) {
                throw new RequiredError('labelName','Required parameter labelName was null or undefined when calling updateEdgeDataSource.');
            }
            const localVarPath = `/api/v1/graph/{graph_name}/datasource/edge/{label_name}`
                .replace(`{${"graph_name"}}`, encodeURIComponent(String(graphName)))
                .replace(`{${"label_name"}}`, encodeURIComponent(String(labelName)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} graphName 
         * @param {string} labelName 
         * @param {DataSource} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateVertexDataSource: async (graphName: string, labelName: string, body?: DataSource, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'graphName' is not null or undefined
            if (graphName === null || graphName === undefined) {
                throw new RequiredError('graphName','Required parameter graphName was null or undefined when calling updateVertexDataSource.');
            }
            // verify required parameter 'labelName' is not null or undefined
            if (labelName === null || labelName === undefined) {
                throw new RequiredError('labelName','Required parameter labelName was null or undefined when calling updateVertexDataSource.');
            }
            const localVarPath = `/api/v1/graph/{graph_name}/datasource/vertex/{label_name}`
                .replace(`{${"graph_name"}}`, encodeURIComponent(String(graphName)))
                .replace(`{${"label_name"}}`, encodeURIComponent(String(labelName)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions :AxiosRequestConfig = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.params) {
                query.set(key, options.params[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DataSourceApi - functional programming interface
 * @export
 */
export const DataSourceApiFp = function(configuration?: Configuration) {
    return {
        /**
         * Bind data source to edge type
         * @param {string} graphName 
         * @param {string} labelName 
         * @param {DataSource} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async bindEdgeDataSource(graphName: string, labelName: string, body?: DataSource, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<ApiResponse>>> {
            const localVarAxiosArgs = await DataSourceApiAxiosParamCreator(configuration).bindEdgeDataSource(graphName, labelName, body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Bind data source to vertex type
         * @param {string} graphName 
         * @param {string} labelName 
         * @param {DataSource} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async bindVertexDataSource(graphName: string, labelName: string, body?: DataSource, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<ApiResponse>>> {
            const localVarAxiosArgs = await DataSourceApiAxiosParamCreator(configuration).bindVertexDataSource(graphName, labelName, body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {string} graphName 
         * @param {string} labelName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getEdgeDataSource(graphName: string, labelName: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<DataSource>>> {
            const localVarAxiosArgs = await DataSourceApiAxiosParamCreator(configuration).getEdgeDataSource(graphName, labelName, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {string} graphName 
         * @param {string} labelName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getVertexDataSource(graphName: string, labelName: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<DataSource>>> {
            const localVarAxiosArgs = await DataSourceApiAxiosParamCreator(configuration).getVertexDataSource(graphName, labelName, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {string} graphName 
         * @param {string} labelName 
         * @param {DataSource} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateEdgeDataSource(graphName: string, labelName: string, body?: DataSource, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<ApiResponse>>> {
            const localVarAxiosArgs = await DataSourceApiAxiosParamCreator(configuration).updateEdgeDataSource(graphName, labelName, body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @param {string} graphName 
         * @param {string} labelName 
         * @param {DataSource} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateVertexDataSource(graphName: string, labelName: string, body?: DataSource, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => Promise<AxiosResponse<ApiResponse>>> {
            const localVarAxiosArgs = await DataSourceApiAxiosParamCreator(configuration).updateVertexDataSource(graphName, labelName, body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs :AxiosRequestConfig = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * DataSourceApi - factory interface
 * @export
 */
export const DataSourceApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * Bind data source to edge type
         * @param {string} graphName 
         * @param {string} labelName 
         * @param {DataSource} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async bindEdgeDataSource(graphName: string, labelName: string, body?: DataSource, options?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse>> {
            return DataSourceApiFp(configuration).bindEdgeDataSource(graphName, labelName, body, options).then((request) => request(axios, basePath));
        },
        /**
         * Bind data source to vertex type
         * @param {string} graphName 
         * @param {string} labelName 
         * @param {DataSource} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async bindVertexDataSource(graphName: string, labelName: string, body?: DataSource, options?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse>> {
            return DataSourceApiFp(configuration).bindVertexDataSource(graphName, labelName, body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} graphName 
         * @param {string} labelName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getEdgeDataSource(graphName: string, labelName: string, options?: AxiosRequestConfig): Promise<AxiosResponse<DataSource>> {
            return DataSourceApiFp(configuration).getEdgeDataSource(graphName, labelName, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} graphName 
         * @param {string} labelName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getVertexDataSource(graphName: string, labelName: string, options?: AxiosRequestConfig): Promise<AxiosResponse<DataSource>> {
            return DataSourceApiFp(configuration).getVertexDataSource(graphName, labelName, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} graphName 
         * @param {string} labelName 
         * @param {DataSource} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateEdgeDataSource(graphName: string, labelName: string, body?: DataSource, options?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse>> {
            return DataSourceApiFp(configuration).updateEdgeDataSource(graphName, labelName, body, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} graphName 
         * @param {string} labelName 
         * @param {DataSource} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateVertexDataSource(graphName: string, labelName: string, body?: DataSource, options?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse>> {
            return DataSourceApiFp(configuration).updateVertexDataSource(graphName, labelName, body, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * DataSourceApi - object-oriented interface
 * @export
 * @class DataSourceApi
 * @extends {BaseAPI}
 */
export class DataSourceApi extends BaseAPI {
    /**
     * Bind data source to edge type
     * @param {string} graphName 
     * @param {string} labelName 
     * @param {DataSource} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DataSourceApi
     */
    public async bindEdgeDataSource(graphName: string, labelName: string, body?: DataSource, options?: AxiosRequestConfig) : Promise<AxiosResponse<ApiResponse>> {
        return DataSourceApiFp(this.configuration).bindEdgeDataSource(graphName, labelName, body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Bind data source to vertex type
     * @param {string} graphName 
     * @param {string} labelName 
     * @param {DataSource} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DataSourceApi
     */
    public async bindVertexDataSource(graphName: string, labelName: string, body?: DataSource, options?: AxiosRequestConfig) : Promise<AxiosResponse<ApiResponse>> {
        return DataSourceApiFp(this.configuration).bindVertexDataSource(graphName, labelName, body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {string} graphName 
     * @param {string} labelName 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DataSourceApi
     */
    public async getEdgeDataSource(graphName: string, labelName: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<DataSource>> {
        return DataSourceApiFp(this.configuration).getEdgeDataSource(graphName, labelName, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {string} graphName 
     * @param {string} labelName 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DataSourceApi
     */
    public async getVertexDataSource(graphName: string, labelName: string, options?: AxiosRequestConfig) : Promise<AxiosResponse<DataSource>> {
        return DataSourceApiFp(this.configuration).getVertexDataSource(graphName, labelName, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {string} graphName 
     * @param {string} labelName 
     * @param {DataSource} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DataSourceApi
     */
    public async updateEdgeDataSource(graphName: string, labelName: string, body?: DataSource, options?: AxiosRequestConfig) : Promise<AxiosResponse<ApiResponse>> {
        return DataSourceApiFp(this.configuration).updateEdgeDataSource(graphName, labelName, body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * 
     * @param {string} graphName 
     * @param {string} labelName 
     * @param {DataSource} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DataSourceApi
     */
    public async updateVertexDataSource(graphName: string, labelName: string, body?: DataSource, options?: AxiosRequestConfig) : Promise<AxiosResponse<ApiResponse>> {
        return DataSourceApiFp(this.configuration).updateVertexDataSource(graphName, labelName, body, options).then((request) => request(this.axios, this.basePath));
    }
}
