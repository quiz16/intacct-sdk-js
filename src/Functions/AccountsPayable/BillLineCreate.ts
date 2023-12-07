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
import AbstractBillLine from "./AbstractBillLine";

export default class BillLineCreate extends AbstractBillLine {

    public writeXml(xml: IaXmlWriter): void {
        xml.writeStartElement("lineitem");

        if (this.accountLabel != null) {
            xml.writeElement("accountlabel", this.accountLabel, true);
        } else {
            xml.writeElement("glaccountno", this.glAccountNumber, true);
        }

        if (this.taxEntry != null) {
            xml.writeStartElement("taxentries");
            xml.writeStartElement("taxentry");
            xml.writeElement("detailid", this.taxEntry);
            xml.writeEndElement(); // taxEntry
            xml.writeEndElement(); // taxEntries
        }

        xml.writeElement("offsetglaccountno", this.offsetGlAccountNumber);
        xml.writeElement("amount", this.transactionAmount);
        xml.writeElement("allocationid", this.allocationId);
        xml.writeElement("memo", this.memo);
        xml.writeElement("locationid", this.locationId);
        xml.writeElement("departmentid", this.departmentId);
        xml.writeElement("item1099", this.form1099);
        xml.writeElement("key", this.key);
        xml.writeElement("totalpaid", this.totalPaid);
        xml.writeElement("totaldue", this.totalDue);

        xml.writeCustomFieldsExplicit(this.customFields);

        xml.writeElement("projectid", this.projectId);
        xml.writeElement("customerid", this.customerId);
        xml.writeElement("vendorid", this.vendorId);
        xml.writeElement("employeeid", this.employeeId);
        xml.writeElement("itemid", this.itemId);
        xml.writeElement("classid", this.classId);
        xml.writeElement("contractid", this.contractId);
        xml.writeElement("warehouseid", this.warehouseId);
        xml.writeElement("billable", this.billable);

        xml.writeEndElement(); // lineitem
    }
}
