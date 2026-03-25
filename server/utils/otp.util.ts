const generateOtp = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const getOtpEmailTemplate = (otp: string) => {
  return `
  <div style="
      font-family: Arial, sans-serif;
      background:#F8FAFC;
      padding:40px 20px;
  ">
    <div style="
        max-width:500px;
        margin:auto;
        background:#FFFFFF;
        border-radius:10px;
        padding:30px;
        border:1px solid #E2E8F0;
    ">

      <h2 style="
        color:#0F172A;
        text-align:center;
        margin-bottom:20px;
      ">
        Email Verification
      </h2>

      <p style="
        color:#64748B;
        text-align:center;
        font-size:14px;
      ">
        Use the OTP below to continue.
      </p>

      <div style="
        text-align:center;
        margin:30px 0;
      ">
        <span style="
          font-size:36px;
          letter-spacing:8px;
          font-weight:bold;
          color:#2563EB;
        ">
          ${otp}
        </span>
      </div>

      <p style="
        text-align:center;
        color:#64748B;
        font-size:13px;
      ">
        This OTP is valid for 10 minutes.
      </p>

      <hr style="border:none;border-top:1px solid #E2E8F0;margin:30px 0;">

      <p style="
        text-align:center;
        font-size:12px;
        color:#64748B;
      ">
        If you didn’t request this, you can safely ignore this email.
      </p>

    </div>
  </div>
  `;
};

export { generateOtp, getOtpEmailTemplate };
