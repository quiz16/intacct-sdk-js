/**
 * @module Intacct/SDK/Functions/AccountsPayable
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

import IaXmlWriter from "../../Xml/IaXmlWriter";
import AbstractFunction from "../AbstractFunction";
import AbstractBillLine from "./AbstractBillLine";

export default abstract class AbstractBill extends AbstractFunction {

    public recordNo: number;
    public vendorId: string;
    public transactionDate: Date;
    public glPostingDate: Date;
    public action: string;
    public summaryRecordNo: number;
    public billNumber: string;
    public description: string;
    public externalId: string;
    public baseCurrency: string;
    public transactionCurrency: string;
    public exchangeRateDate: Date;
    public exchangeRateValue: number;
    public exchangeRateType: string;
    public doNotPostToGl: boolean;
    public dueDate: Date;
    public paymentTerm: string;
    public referenceNumber: string;
    public onHold: boolean;
    public payToContactName: string;
    public returnToContactName: string;
    public attachmentsId: string;
    public inclusiveTax: boolean;
    public lines: AbstractBillLine[];

    public customFields: Array<[string, any]> = [];

    protected writeXmlMultiCurrencySection(xml: IaXmlWriter) {
        xml.writeElement("basecurr", this.baseCurrency);
        xml.writeElement("currency", this.transactionCurrency);
        if (this.exchangeRateDate != null) {
            xml.writeStartElement("exchratedate");
            xml.writeDateSplitElements(this.exchangeRateDate);
            xml.writeEndElement(); // exchratedate
        }
        if (this.exchangeRateType != null) {
            xml.writeElement("exchratetype", this.exchangeRateType);
        } else if (this.exchangeRateValue != null) {
            xml.writeElement("exchrate", this.exchangeRateValue);
        } else if (this.baseCurrency != null || this.transactionCurrency != null) {
            xml.writeElement("exchratetype", this.exchangeRateType, true);
        }
    }
}
