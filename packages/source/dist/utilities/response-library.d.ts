export declare class ResponseLibrary {
    protected readonly log: any;
    outputResponse(outputParams: any, funcParams: any): any;
    makeUniqueParams(params: any): any[];
    getFilteredData(params: any): {};
    getSpecificFields(innerData: any, params: any): any;
    prepareAliasData(filterData: any, params: any): any;
    finalResponseData(aliasData: any, params: any): any;
    prepareAliasFields(fields: any, alias: any): any;
    getFinishMessage(wsFunc: string, msgCode: string, params: any): string;
    assignSingleRecord(inputParams: any, outputData: any): any;
    assignFunctionResponse(outputData: any, mappingKeys?: any): any;
    appendFunctionResponse(inputParams: any, outputData: any, mappingKeys: any): any[];
    unsetFunctionResponse(inputParams: any, outputData: any, mappingKeys: any): any[];
    filterLoopParams(outputData: any, loopData: any, inputParams: any): {};
    grabLoopVariables(loopVars: any, inputParams: any): any;
}
//# sourceMappingURL=response-library.d.ts.map