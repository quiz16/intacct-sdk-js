/**
 * @module Intacct/SDK/Xml/Response
 */

/**
 * Copyright 2022 Sage Intacct, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "LICENSE" file accompanying this file. This file is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import {isArray} from "util";
import IntacctException from "../../Exceptions/IntacctException";
import ResultException from "../../Exceptions/ResultException";
import ErrorMessage from "./ErrorMessage";

export default class Result {

    private _status: string;
    get status(): string {
        return this._status;
    }

    private _functionName: string;
    get functionName(): string {
        return this._functionName;
    }

    private _controlId: string;
    get controlId(): string {
        return this._controlId;
    }

    private _data: any[];
    get data(): any[] {
        return this._data;
    }

    private _listType: string;
    get listType(): string {
        return this._listType;
    }

    private _count: number;
    get count(): number {
        return this._count;
    }

    private _totalCount: number;
    get totalCount(): number {
        return this._totalCount;
    }

    private _numRemaining: number;
    get numRemaining(): number {
        return this._numRemaining;
    }

    private _resultId: string;
    get resultId(): string {
        return this._resultId;
    }

    private _key: string;
    get key(): string {
        return this._key;
    }

    private _start: number;
    get start(): number {
        return this._start;
    }

    private _end: number;
    get end(): number {
        return this._end;
    }

    private _errors: string[];
    get errors(): string[] {
        return this._errors;
    }

    constructor(result: object) {
        if (!Object.prototype.hasOwnProperty.call(result, "status")) {
            throw new IntacctException("Response result block is missing status element");
        }
        this._status = result["status"];
        if (!Object.prototype.hasOwnProperty.call(result, "function")) {
            throw new IntacctException("Response result block is missing function element");
        }
        this._functionName = result["function"];
        if (!Object.prototype.hasOwnProperty.call(result, "controlid")) {
            throw new IntacctException("Response result block is missing controlid element");
        }
        this._controlId = result["controlid"];

        if (result["status"] !== "success") {
            if (Object.prototype.hasOwnProperty.call(result, "errormessage")) {
                const errorMessage = new ErrorMessage(result["errormessage"]);

                this._errors = errorMessage.errors;
            }
        } else {
            if (Object.prototype.hasOwnProperty.call(result, "key") && result["key"] != null) {
                this._key = result["key"].toString();
            } else if (Object.prototype.hasOwnProperty.call(result, "listtype") && result["listtype"] != null) {
                const listType = result["listtype"];
                this._listType = result["listtype"].toString();
                if (Object.prototype.hasOwnProperty.call(listType, "$")) {
                    const listTypeAttr = listType["$"];
                    if (Object.prototype.hasOwnProperty.call(listTypeAttr, "total")) {
                        this._totalCount = parseInt(listTypeAttr["total"], 10);
                    }
                    if (Object.prototype.hasOwnProperty.call(listTypeAttr, "start")) {
                        this._start = parseInt(listTypeAttr["start"], 10);
                    }
                    if (Object.prototype.hasOwnProperty.call(listTypeAttr, "end")) {
                        this._end = parseInt(listTypeAttr["end"], 10);
                    }
                }
            } else if (
                Object.prototype.hasOwnProperty.call(result, "data")
                && Object.prototype.hasOwnProperty.call(result["data"], "$")
                && Object.prototype.hasOwnProperty.call(result["data"]["$"], "listtype")
                && result["data"]["$"]["listtype"] != null
            ) {
                const dataAttr = result["data"]["$"];

                if (Object.prototype.hasOwnProperty.call(dataAttr, "listtype")) {
                    this._listType = dataAttr["listtype"].toString();
                }

                if (Object.prototype.hasOwnProperty.call(dataAttr, "totalcount")) {
                    this._totalCount = parseInt(dataAttr["totalcount"], 10);
                }

                if (Object.prototype.hasOwnProperty.call(dataAttr, "count")) {
                    this._count = parseInt(dataAttr["count"], 10);
                }

                if (Object.prototype.hasOwnProperty.call(dataAttr, "numremaining")) {
                    this._numRemaining = parseInt(dataAttr["numremaining"], 10);
                }

                if (Object.prototype.hasOwnProperty.call(dataAttr, "resultId")) {
                    this._resultId = dataAttr["resultId"].toString();
                }
            }

            if (Object.prototype.hasOwnProperty.call(result, "data")) {
                const data = [];
                for (const key in result["data"]) {
                    if (key !== "$" && Object.prototype.hasOwnProperty.call(result["data"], key)) {
                        if (isArray(result["data"][key])) {
                            for (const child of result["data"][key]) {
                                data.push(child);
                            }
                        } else {
                            data.push(result["data"][key]);
                        }
                    }
                }
                this._data = data;
            }
        }
    }

    public ensureStatusSuccess(): void {
        if (this.status !== "success") {
            throw new ResultException(
                "Result status: " + this.status + " for Control ID: " + this.controlId,
                this._errors,
            );
        }
    }

    public ensureStatusNotFailure(): void {
        if (this.status === "failure") {
            throw new ResultException(
                "Result status: " + this.status + " for Control ID: " + this.controlId,
                this._errors,
            );
        }
    }
}
