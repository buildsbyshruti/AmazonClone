import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export async function sendOrderConfirmation(orderData) {
  try {
    const { MAIL_USER, MAIL_PASS } = process.env;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    const { order_id, email, user_name, items, total_amount, shipping } = orderData;

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <img src="${item.image_url}" alt="${item.name}" width="50" style="vertical-align: middle; margin-right: 10px;" />
          ${item.name}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
      </tr>
    `).join("");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #232f3e; padding: 20px; text-align: center;">
          <h1 style="color: #ff9900; margin: 0;">Order Confirmed!</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hi <strong>${user_name}</strong>,</p>
          <p>Thank you for shopping with us. Your order <strong>#AMZ-${order_id}</strong> has been placed successfully.</p>

          <h3 style="border-bottom: 2px solid #232f3e; padding-bottom: 5px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f8f8;">
                <th style="text-align: left; padding: 10px;">Item</th>
                <th style="padding: 10px;">Qty</th>
                <th style="text-align: right; padding: 10px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Grand Total:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; color: #b12704;">₹${total_amount}</td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 20px; background-color: #f7f7f7; padding: 15px; border-radius: 5px;">
            <h4 style="margin: 0 0 10px 0;">Shipping to:</h4>
            <p style="margin: 0; font-size: 14px;">
              ${shipping.full_name}<br />
              ${shipping.line1}, ${shipping.line2 || ""}<br />
              ${shipping.city}, ${shipping.state} - ${shipping.pincode}
            </p>
          </div>

          <p style="margin-top: 20px; font-size: 13px; color: #666;">
            We'll send another update once your items are on the way.
          </p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="http:
          </div>
        </div>
        <div style="background-color: #f3f3f3; padding: 15px; text-align: center; font-size: 11px; color: #888;">
          © 2024 Amazon Clone India | All Rights Reserved
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"Amazon Clone" <' + MAIL_USER + '>',
      to: email,
      subject: `Order Confirmation: #AMZ-${order_id}`,
      html: htmlContent,
    });

    console.log("Order confirmation email sent to %s (Real Gmail): %s", email, info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending real email:", error);
  }
}
