import { format } from "date-fns";
import { enUS, id } from "date-fns/locale";
import { getEndOfMonthDate } from "../../helpers/timeHelper";
import { ISOA } from "../../interface/ISOA";

export const emailTemplate = (
  type: "BA" | "User",
  soaAffco: any[],
  soaParties: any[],
  recipientName: string,
  totalIncidents: number,
  incidentDate: string, // format misalnya "Senin, 5 Mei 2025"
  pendingBilling: Array<{
    no: number;
    salesDocument: string;
    soldParty: string;
    picMarketing: string;
    emailUser: string;
    desc: string;
  }>,
  pendingAR: Array<{
    no: number;
    documentNumber: string;
    customerName: string;
    picFinance: string;
    emailUser: string;
    desc: string;
  }>,
  mhDiscrepancy: Array<{
    no: number;
    unitSN: string;
    picManufacturing: string;
    productionProgress: string;
    mhUsage: number;
  }>,
  predictivePotentialDelay: Array<{
    no: number;
    proID: string;
    picProduction: string;
    emailUser: string;
    desc: string;
  }>,
  vendorDelivery: Array<{
    no: number;
    poID: string;
    picVendor: string;
    emailUser: string;
    desc: string;
  }>,
  subcontDelivery: Array<{
    no: number;
    poID: string;
    picSubcont: string;
    emailUser: string;
    desc: string;
  }>
) => {
  const subject = `[Reminder] Incident Management System`;

  const tabelSOA = soaArEmailTemplate(soaAffco, soaParties).html;

  const html = `
    <div style="font-family: Calibri, sans-serif; font-size: 13px; color: #000; padding: 20px;">
        <h1 style="text-align: center; margin-bottom: 4px; font-style: bold; color:#0D0E12">RECAP INCIDENT</h1>
        <hr style="border: 0; border-top: 1px solid #ccc; margin-bottom: 16px;">

        <table style="width: 100%; margin-bottom: 26px;">
            <tr>
            <td style="width:50%; vertical-align:top; color:#0D0E12">
                Kepada <br/>
                <strong style="color:#0D0E12">${recipientName}</strong>
            </td>
            <td style="width:50%; vertical-align:top; color:#0D0E12">
                Date <br/>
                <strong style="color:#0D0E12">
                ${format(new Date(), "EEEE, dd MMMM yyyy", {
                  locale: enUS,
                })}
                </strong>
            </td>
            </tr>
        </table>

        <table style="width: 100%; margin-bottom: 36px;">
            <tr>
            <td style="width:50%; vertical-align:top; color:#0D0E12">
                Total Incidents <br/>
                <strong style="color:#0D0E12">${totalIncidents}</strong>
            </td>
            <td style="width:50%; vertical-align:top; color:#0D0E12">
                Incidents Date <br/>
                <strong style="color:#0D0E12">
                ${incidentDate}
                </strong><br/>
            </td>
            </tr>
        </table>

        <div style="border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top: 8px; padding: 12px;">
            <h3 style="background-color:#222831; color:#fff; padding:6px 12px; border-radius:4px; margin-top: 0;">NEED TO BILLED DUE</h3>
            <table border="1" cellspacing="0" cellpadding="4" style="border-collapse: collapse; width:100%; margin-top: 8px; margin-bottom:16px;">
            <thead style="background-color:#DDEBF7;">
                <tr>
                <th>No</th>
                <th>Customer Name</th>
                <th>Triatra PIC</th>
                <th>GI Number</th>
                <th>Sales Documnet</th>
                <th>Item</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Due Date</th>
                </tr>
            </thead>
            <tbody>
                ${pendingBilling
                  .map(
                    (b) => `
                <tr>
                    <td style="text-align:center;">${b.no}</td>
                    <td>${b.soldParty}</td>
                    <td>${b.picMarketing}</td>
                    <td></td>
                    <td>${b.salesDocument}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                `
                  )
                  .join("")}
            </tbody>
            </table>
        </div>

        <div style="border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top: 8px; padding: 12px;">
            <h3 style="background-color:#222831; color:#fff; padding:6px 12px; border-radius:4px; margin-top: 0;">STATEMENT OF ACCOUNT TRIATRA / [CUSNAME]</h3>
            ${tabelSOA}
        </div>

        <div style="border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top: 8px; padding: 12px;">
            <h3 style="background-color:#222831; color:#fff; padding:6px 12px; border-radius:4px; margin-top: 0;">Manhour Discrepancy</h3>
            <table border="1" cellspacing="0" cellpadding="4" style="border-collapse: collapse; width:100%; margin-top: 8px; margin-bottom:16px;">
            <thead style="background-color:#DDEBF7;">
                <tr>
                <th>No</th>
                <th>Serial Number</th>
                <th>Manhour Usage</th>
                <th>Production Progress</th>
                <th>Utilization</th>
                </tr>
            </thead>
            <tbody>
                ${mhDiscrepancy
                  .map(
                    (b) => `
                <tr>
                    <td style="text-align:center;">${b.no}</td>
                    <td>${b.unitSN}</td>
                    <td style="text-align: right;">${b.mhUsage}</td>
                    <td style="text-align: right;">${b.productionProgress}</td>
                    <td></td>
                </tr>
                `
                  )
                  .join("")}
            </tbody>
            </table>
        </div>

        <div style="border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top: 8px; padding: 12px;">
            <h3 style="background-color:#222831; color:#fff; padding:6px 12px; border-radius:4px; margin-top: 0;">Predictive Potential Delay Operation</h3>
            <table border="1" cellspacing="0" cellpadding="4" style="border-collapse: collapse; width:100%; margin-top: 8px;">
            <thead style="background-color:#DDEBF7;">
                <tr>
                <th>No</th>
                <th>Serial Number</th>
                <th>MPS Due Date</th>
                <th>Estimation Delivery</th>
                </tr>
            </thead>
            <tbody>
                ${predictivePotentialDelay
                  .map(
                    (a) => `
                <tr>
                    <td style="text-align:center;">${a.no}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                `
                  )
                  .join("")}
            </tbody>
            </table>
            <br />
            <span style="color:red;">*Based On Engine Calculation</span>
        </div>

        <div style="border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-top: 8px; padding: 12px;">
            <h3 style="background-color:#222831; color:#fff; padding:6px 12px; border-radius:4px; margin-top: 0;">Subcont Delivery Performance</h3>
            <table border="1" cellspacing="0" cellpadding="4" style="border-collapse: collapse; width:100%; margin-top: 8px;">
            <thead style="background-color:#DDEBF7;">
                <tr>
                <th>No</th>
                <th>PO Number</th>
                <th>PO Item</th>
                <th>Qty</th>
                <th>Material</th>
                <th>Material Desc</th>
                <th>Subcont Name</th>
                <th>PO Due Date</th>
                <th>Confirmation Date</th>
                </tr>
            </thead>
            <tbody>
                ${subcontDelivery
                  .map(
                    (a) => `
                <tr>
                    <td style="text-align:center;">${a.no}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                `
                  )
                  .join("")}
            </tbody>
            </table>
        </div>

        <p style="margin-top: 24px;">Please check the system for further details and take the necessary action.<br/><br/>Best regards,<br/><strong>Incident Management System</strong></p>
    </div>
`;

  const text = `Reminder Incident untuk ${recipientName}
                Total Incidents: ${totalIncidents}
                Incident Date: ${incidentDate}
                Silakan cek sistem.`;

  return { subject, text, html };
};

const parseAmount = (amount: string | number | undefined | null): number => {
  if (typeof amount === "number") return amount;
  if (typeof amount === "string") {
    const cleaned = amount.replace(/\./g, "").replace(/,/g, "").trim();
    const parsed = Number(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const getCurrencyLabel = (data: ISOA[]): string => {
  const currencies = new Set(data.map((item) => item.curr).filter(Boolean));
  return currencies.size === 1 ? [...currencies][0] : "-";
};

const renderRows = (data: ISOA[]) =>
  data.length
    ? data
        .map((item) => {
          const formatValue = (value: string | number) =>
            value === "-" || Number(value) === 0
              ? "-"
              : Number(value).toLocaleString("id-ID");

          const agingFields = [
            "current",
            "range_1_30",
            "range_31_60",
            "range_61_90",
            "range_91_120",
            "range_121_150",
            "range_over_150",
          ] as const;

          const total = agingFields.reduce(
            (acc, val) => acc + parseAmount(val),
            0
          );

          return `
          <tr>
            <td>${item.code}</td>
            <td>${item.customerName}</td>
            <td align="right">${formatValue(item.valuatedAmount)}</td>
            <td style="text-align: center;">${item.curr}</td>
            ${agingFields
              .map((key) => {
                const rawVal = parseAmount(item[key]);
                const displayVal = formatValue(item[key]);
                const style =
                  rawVal < 0
                    ? ' style="background-color: #FBC9C9; color: #C00000;"'
                    : "";
                return `<td align="right"${style}>${displayVal}</td>`;
              })
              .join("")}
            <td align="right">${formatValue(total)}</td>
          </tr>`;
        })
        .join("")
    : `
        <tr>
          <td>-</td><td>-</td><td align="right">-</td>
          <td style="text-align: center;">-</td>
          ${Array(7).fill("<td>-</td>").join("")}
          <td align="right">-</td>
        </tr>`;

const calculateTotalAging = (data: ISOA[]) => {
  const parse = (val: string) => parseAmount(val || "0");

  return {
    current: data.reduce((acc, d) => acc + parse(d.current), 0),
    range_1_30: data.reduce((acc, d) => acc + parse(d.range_1_30), 0),
    range_31_60: data.reduce((acc, d) => acc + parse(d.range_31_60), 0),
    range_61_90: data.reduce((acc, d) => acc + parse(d.range_61_90), 0),
    range_91_120: data.reduce((acc, d) => acc + parse(d.range_91_120), 0),
    range_121_150: data.reduce((acc, d) => acc + parse(d.range_121_150), 0),
    range_over_150: data.reduce((acc, d) => acc + parse(d.range_over_150), 0),
  };
};

const renderAgingTotals = (aging: ReturnType<typeof calculateTotalAging>) =>
  (Object.values(aging) as number[])
    .map((val) => {
      const style =
        val < 0 ? ' style="background-color: #FBC9C9; color: #C00000;"' : "";
      return `<td align="right"${style}><strong>${
        val === 0 ? "-" : val.toLocaleString("id-ID")
      }</strong></td>`;
    })
    .join("");

const amountTotalAging = (aging: ReturnType<typeof calculateTotalAging>) => {
  const total =
    aging.current +
    aging.range_1_30 +
    aging.range_31_60 +
    aging.range_61_90 +
    aging.range_91_120 +
    aging.range_121_150 +
    aging.range_over_150;

  const style =
    total < 0 ? ' style="background-color: #FBC9C9; color: #C00000;"' : "";

  return `<td align="right"${style}><strong>${
    total === 0 ? "-" : total.toLocaleString("id-ID")
  }</strong></td>`;
};

export const soaArEmailTemplate = (affco: any[], parties: any[]) => {
  const subject = `Statement Of Account`;

  const formatDateLabel = (date: Date): string => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const year = date.getUTCFullYear();
    const month = monthNames[date.getUTCMonth()];
    const day = date.getUTCDate().toString().padStart(2, "0");

    return `As of ${month} ${day}, ${year}`;
  };

  const dateLabel = formatDateLabel(getEndOfMonthDate());

  const totalAffco = affco.reduce(
    (acc, c) => acc + parseAmount(c.valuatedAmount),
    0
  );
  const totalParties = parties.reduce(
    (acc, p) => acc + parseAmount(p.valuatedAmount),
    0
  );

  const grandTotal = totalAffco + totalParties;

  const totalAgingAffco = calculateTotalAging(affco);
  const totalAgingParties = calculateTotalAging(parties);
  const totalAgingGrand = calculateTotalAging([...affco, ...parties]);

  const affcoCurr = getCurrencyLabel(affco);
  const partiesCurr = getCurrencyLabel(parties);
  const grandCurr = getCurrencyLabel([...affco, ...parties]);

  const affcoRows = renderRows(affco);
  const partyRows = renderRows(parties);

  const html = `
    <div style="font-family: Calibri, sans-serif; font-size: 13px; color: #000;">
        <span style="font-weight: bold;">PT. United Tractors Pandu Engineering</span> <br />
        <span style="font-weight: bold;">Account Receivable Trade</span> <br />
        <span style="font-weight: bold; margin-bottom: 6px; display: inline-block;">${dateLabel}</span>

        <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%; font-size: 12px;">
            <thead style="background-color: #DDEBF7; text-align: center;">
                <tr>
                    <th>Customer Code</th>
                    <th>Customer's Name</th>
                    <th>VALUATED AMOUNT</th>
                    <th>CURR.</th>
                    <th>CURRENT</th>
                    <th>1-30 Days</th>
                    <th>31-60 Days</th>
                    <th>61-90 Days</th>
                    <th>91-120 Days</th>
                    <th>121-150 Days</th>
                    <th>>150 Days</th>
                    <th>TOTAL</th>
                </tr>
            </thead>
            <tbody>
                <tr style="background-color: #D8E4BC;">
                    <td style="text-align: center;"><strong>AFFCO</strong></td>
                    <td style="text-align: center;"><strong>TOTAL AFFCO</strong></td>
                    <td align="right"><strong>${
                      totalAffco === 0
                        ? "-"
                        : totalAffco.toLocaleString("id-ID")
                    }</strong></td>
                    <td style="text-align: center;"><strong>${affcoCurr}</strong></td>
                    ${renderAgingTotals(totalAgingAffco)}
                    ${amountTotalAging(totalAgingAffco)}
                    </tr>
                    ${affcoRows}
                    <tr style="background-color: #D8E4BC;">
                    <td style="text-align: center;"><strong>3RD PARTIES</strong></td>
                    <td style="text-align: center;"><strong>TOTAL 3RD PARTIES</strong></td>
                    <td align="right"><strong>${
                      totalParties === 0
                        ? "-"
                        : totalParties.toLocaleString("id-ID")
                    }</strong></td>
                    <td style="text-align: center;"><strong>${partiesCurr}</strong></td>
                    ${renderAgingTotals(totalAgingParties)}
                    ${amountTotalAging(totalAgingParties)}
                    </tr>
                    ${partyRows}
                    <tr style="background-color: #FFC000;">
                    <td colspan="2" align="center"><strong>GRAND TOTAL</strong></td>
                    <td align="right"><strong>${
                      grandTotal === 0
                        ? "-"
                        : grandTotal.toLocaleString("id-ID")
                    }</strong></td>
                    <td style="text-align: center;"><strong>${grandCurr}</strong></td>
                    ${renderAgingTotals(totalAgingGrand)}
                    ${amountTotalAging(totalAgingGrand)}
                </tr>
            </tbody>
        </table>
    </div>
`;

  const text = `.`;

  return { subject, text, html };
};
