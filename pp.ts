import { PrismaClient } from "../../prisma/generated/satria-client";
import { getCurrentWIBDate } from "../helpers/timeHelper";
import { format } from "date-fns";
import { enUS, id } from "date-fns/locale";
import { FBL5N } from "../models/Table/Satria/FBL5N";
import { VF04 } from "../models/Table/Satria/VF04";
import {
  emailTemplate,
  soaArEmailTemplate,
} from "../controllers/email/templateEmail";
import { Incident } from "../models/Table/Satria/trx_LogHistory";
import { dataSOAAR } from "../controllers/cms/PendingARController";
import nodemailer, { TransportOptions } from "nodemailer";
import { vwUnit } from "../models/Table/Satria/vwUnit";
import { vwProcess } from "../models/Table/Satria/vwProcess";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmailDirect = async ({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) => {
  if (!to || !subject || (!text && !html)) {
    throw new Error("Semua field harus diisi");
  }

  return await transporter.sendMail({
    from: `"INCIDENT MANAGEMENT SYSTEM" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
    priority: "high",
    headers: {
      "X-Priority": "1", // 1 = Urgent, 3 = Normal, 5 = Low
      Priority: "high",
    },
  });
};

// Fungsi Umum untuk Mengirim Email Incident dengan Paginasi dan Efisiensi
export const sendIncidentEmails = async (type: "BA" | "User") => {
  try {
    const now = getCurrentWIBDate();
    const fieldDate = type === "BA" ? "BAEmailDate" : "UserEmailDate";
    const fieldStatus = type === "BA" ? "BAEmailStatus" : "UserEmailStatus";

    let incidents: any[] = [];

    incidents = await Incident.findMany({
      where: {
        [fieldDate]: {
          lte: now,
          // lt: startOfTomorrow,
        },
        NOT: { [fieldDate]: null },
        // [fieldStatus]: "-",
      },
      select: {
        ID: true,
        SalesDocument: true,
        DocumentNumber: true,
        UnitSerialNumber: true,
        POID: true,
        PROID: true,
        IncidentType: true,
        Description: true,
        OpenDate: true,
        pic_ba: {
          select: {
            email: true,
            name: true,
          },
        },
        pic_user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    const groupedIncidents = incidents.reduce((acc, incident) => {
      const recipientEmail =
        type === "BA" ? incident.pic_ba?.email : incident.pic_user?.email;

      if (!recipientEmail) return acc;

      if (!acc[recipientEmail]) {
        acc[recipientEmail] = {
          name: type === "BA" ? incident.pic_ba?.name : incident.pic_user?.name,
          incidents: [],
        };
      }

      acc[recipientEmail].incidents.push({
        ...incident,
        picUser: incident.pic_user?.name || "-",
        emailUser: incident.pic_user?.email || "-",
      });

      return acc;
    }, {} as Record<string, { name: string; incidents: any[] }>);

    const emailPromises = (
      Object.entries(groupedIncidents) as [
        string,
        { name: string; incidents: any[] }
      ][]
    ).map(async ([recipientEmail, { name, incidents }]) => {
      const totalIncidents = incidents.length;

      // Menyiapkan data untuk email
      const pendingBilling: any = [];
      const pendingAR: any = [];
      const mhDiscrepancy: any = [];
      const predictivePotentialDelay: any = [];
      const vendorDelivery: any = [];
      const subcontDelivery: any = [];

      // Menggabungkan data untuk email
      for (const incident of incidents) {
        if (incident.DocumentNumber) {
          const dataAR = await FBL5N.findFirst({
            where: {
              DocumentNumber: incident.DocumentNumber.toString(),
            },
            select: {
              CustomerName: true,
            },
          });

          pendingAR.push({
            no: pendingAR.length + 1,
            documentNumber: incident.DocumentNumber.toString(),
            customerName: dataAR?.CustomerName || "-",
            picFinance: incident.picUser || "-",
            emailUser: incident.emailUser || "-",
            desc: incident.Description || "-",
          });
        }

        if (incident.SalesDocument) {
          const dataBilling = await VF04.findFirst({
            where: {
              SalesDocument: incident.SalesDocument.toString(),
            },
            select: {
              NameSoldToParty: true,
            },
          });

          pendingBilling.push({
            no: pendingBilling.length + 1,
            salesDocument: incident.SalesDocument.toString(),
            soldParty: dataBilling?.NameSoldToParty || "-",
            picMarketing: incident.picUser || "-",
            emailUser: incident.emailUser || "-",
            desc: incident.Description || "-",
          });
        }

        if (incident.UnitSerialNumber) {
          const dataUnit = await vwUnit.findFirst({
            where: {
              UnitSerialNumber: incident.UnitSerialNumber,
            },
          });

          const dataProcess = await vwProcess.findMany({
            where: {
              UnitID: dataUnit?.UnitID,
            },
          });

          const standardMH = dataProcess.reduce(
            (sum, proc) =>
              sum + (proc.StandardMH ? Number(proc.StandardMH) : 0),
            0
          );

          mhDiscrepancy.push({
            no: mhDiscrepancy.length + 1,
            unitSN: incident.UnitSerialNumber,
            mhUsage: standardMH,
            picManufacturing: incident.picUser || "-",
            emailUser: 0 || "-",
            desc: incident.Description || "-",
          });
        }

        if (incident.PROID) {
          predictivePotentialDelay.push({
            no: predictivePotentialDelay.length + 1,
            proID: incident.PROID.toString(),
            picProduction: incident.picUser || "-",
            emailUser: incident.emailUser || "-",
            desc: incident.Description || "-",
          });
        }

        if (incident.POID) {
          vendorDelivery.push({
            no: vendorDelivery.length + 1,
            poID: incident.POID.toString(),
            picVendor: incident.picUser || "-",
            emailUser: incident.emailUser || "-",
            desc: incident.Description || "-",
          });

          subcontDelivery.push({
            no: subcontDelivery.length + 1,
            poID: incident.POID.toString(),
            picSubcont: incident.picUser || "-",
            emailUser: incident.emailUser || "-",
            desc: incident.Description || "-",
          });
        }
      }

      const openDate = format(
        new Date(incidents[0]?.OpenDate),
        "EEEE, dd MMMM yyyy",
        {
          locale: enUS,
        }
      );

      const dataSOA = await dataSOAAR();

      const { subject, text, html } = emailTemplate(
        type,
        dataSOA.affco,
        dataSOA.parties,
        name || "-",
        totalIncidents,
        openDate, // Menggunakan OpenDate dari incident pertama
        pendingBilling,
        pendingAR,
        mhDiscrepancy,
        predictivePotentialDelay,
        vendorDelivery,
        subcontDelivery
      );

      await sendEmailDirect({ to: recipientEmail, subject, text, html });

      // Update status email yang sudah dikirim
      for (const incident of incidents) {
        await Incident.update({
          where: { ID: incident.ID },
          data: { [fieldStatus]: "Sent" },
        });
      }

      console.log(
        `[${now.toISOString()}] ✅ ${type} Email sent to: ${recipientEmail} (Total incidents: ${totalIncidents})`
      );
    });

    await Promise.all(emailPromises); // Kirim email secara paralel
  } catch (error) {
    console.error(`❌ Error while sending ${type} emails:`, error);
  }
};

export const sendSOAEmail = async () => {
  try {
    const dataSOA = await dataSOAAR();
    const affco: any = dataSOA.affco;
    const parties: any = dataSOA.parties;

    const { subject, text, html } = soaArEmailTemplate(affco, parties);

    await sendEmailDirect({
      to: "daffaabiyyu38@gmail.com",
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error(`❌ Error while sending emails:`, error);
  }
};
