const sendMail = require("../../task-manager/mailer");

module.exports = resetPasswordEmailMagni = (
  user,
  link,
  subject = "Reset password"
) => {
  sendMail({
    to: user.email,
    subject: subject,
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->
    <title>Streambed</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0 " />
    <meta name="format-detection" content="telephone=no" />
    <!--[if !mso]><!-->
	<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css?family=Nunito:400,600,700,800&display=swap" rel="stylesheet">
	<!--<![endif]-->
	
	<style type="text/css">
		body {
			margin: 0 auto !important;
			padding: 0;
			-webkit-text-size-adjust: 100% !important;
			-ms-text-size-adjust: 100% !important;
			-webkit-font-smoothing: antialiased !important;
		}
	
		img {
			border: 0 !important;
			outline: none !important;
		}
	
		p {
			Margin: 0px !important;
			Padding: 0px !important;
		}
	
		table {
			border-collapse: collapse;
			mso-table-lspace: 0px;
			mso-table-rspace: 0px;
		}user
	
		td,
		a,
		span {
			border-collapse: collapse;
			mso-line-height-rule: exactly;
		}
	
		.ExternalClass * {
			line-height: 100%;
		}
	
		@media screen and (max-width: 600px) {
			td table.container {
				width: 100% !important;
			}
		}
		@media screen and (max-width: 575px) {
			.inner-wrap {
				padding: 0 37px !important;
			}
			.text-body {
				font-size: 12px !important;
			}
			.text-footer {
				font-size: 8px !important;
			}
			.btn-default {
				width: 246px !important;
				height: 34px !important;
				line-height: 34px !important;
				font-size: 12px !important;
			}
			.logo-img {
				width: 192px !important;
			}
		}
		</style>
</head>
	<body style="padding: 0; margin: 0; font-family: 'Montserrat', sans-serif;" bgcolor="#fff">
		<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tr>
				<td>
					<table class="container" align="center" width="600" border="0" cellspacing="0" cellpadding="0" bgcolor="#fff" 
						style="width: 600px; margin: 0 auto; background: #ffffff; font-family: 'Montserrat', sans-serif;"
					>
						<tr>
							<td class="inner-wrap" style="padding: 0 100px;">
								<table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" 
									style="width: 100%; margin: 0 auto; font-family: 'Montserrat', sans-serif;"
								>
									<tr>
										<td height="50">&nbsp;</td>
									</tr>
									<tr>
										<td align="center">
											<a href="#">
												<img class="logo-img" src="cid:logo.png"/>
											</a>
										</td>
									</tr>
									<tr>
										<td height="80">&nbsp;</td>
									</tr>
									<tr>
										<td  class="text-body" style="font-size: 16px; line-height: 20px; font-weight: 700; color: #0099CD; font-family: 'Montserrat', sans-serif;">
											Hey  ${user.first_name + " " + user.last_name},
										</td>
									</tr>
									<tr>
										<td height="25">&nbsp;</td>
									</tr>
									<tr>
										<td  class="text-body" style="font-size: 16px; line-height: 20px; color: #707070; font-weight: 500; font-family: 'Montserrat', sans-serif;">
											 You are receiving this email because you, or someone else, has requested to reset the password of Streambed account <username>. If this wasn’t you, please ignore this email. If you would like to reset your password, please click the link below. This link will expire in 24 hours.
										</td>
									</tr>
									<tr>
										<td height="40">&nbsp;</td>
									</tr>
									<tr>
										<td align="center">
											<a href="${link}" class="btn-default" style="
												width: 300px; 
												height: 43px; 
												border-radius: 22px; 
												background-color: #0099CD; 
												background-image: linear-gradient(to right, #5bc3b2, #45bfbd, #32bac7, #2ab4d0, #33add6);
												font-size: 16px;
												line-height: 43px; 
												font-weight: 700; 
												color: #fff; 
												text-align: center; 
												display: block;
												text-decoration: none;
												font-family: 'Nunito', sans-serif;
												text-transform: uppercase;"
											>
											Reset Password
											</a>
										</td>
									</tr>
									<tr>
										<td style="height: 40px;"></td>
									</tr>
									<tr>
										<td  class="text-body" style="font-size: 16px; line-height: 20px; color: #707070; font-weight: 500; font-family: 'Montserrat', sans-serif;">
											If you have any further questions, please contact us at <a href="#" style="font-size: 16px; line-height: 20px; color: #707070; text-decoration: none;">info@streambedmedia.com</a>
										</td>
									</tr>
									<tr>
										<td style="height: 30px;"></td>
									</tr>
									<tr>
										<td  class="text-body" style="font-size: 16px; line-height: 20px; color: #707070; font-weight: 500; font-family: 'Montserrat', sans-serif;">
											Happy sharing!
										</td>
									</tr>
									<tr>
										<td height="40">&nbsp;</td>
									</tr>
									<tr>
										<td  class="text-body" style="font-size: 16px; line-height: 20px; font-weight: 700; color: #0099CD; font-family: 'Montserrat', sans-serif;">
											The Streambed Team
										</td>
									</tr>
									<tr>
										<td height="40">&nbsp;</td>
									</tr>
								</table>	
							</td>
						</tr>

						<!-- Footer Start -->
						<tr>
							<td style="background-color: #0099CD; background-image: linear-gradient(to right, #5bc3b2, #45bfbd, #32bac7, #2ab4d0, #33add6);">
								<table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" 
									style="width: 100%; margin: 0 auto; font-family: 'Montserrat', sans-serif;"
								>
									<tr>
										<tr>
											<td class="inner-wrap" style="padding: 0 100px;">
												<table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" 
													style="width: 100%; margin: 0 auto; font-family: 'Montserrat', sans-serif;"
												>
													<tr>
														<td height="20">&nbsp;</td>
													</tr>
													<tr>
														<td align="center">
															<table align="center" border="0" cellspacing="0" cellpadding="0" 
																style="margin: 0 auto; font-family: 'Montserrat', sans-serif;"
															>
																<tr>
																	<td style="padding: 0 5px; border-radius: 4px; overflow: hidden;">
																		<a href="#">
																			<img src="cid:twitter-icon.png" width: "17" height="17" style="display: block; width: 17px; height: 17px;" />
																		</a>
																	</td>
																	<td style="padding: 0 5px; border-radius: 4px; overflow: hidden;">
																		<a href="#">
																			<img src="cid:linkedin-icon.png" width: "17" height="17" style="display: block; width: 17px; height: 17px;" />
																		</a>
																	</td>
																	<td style="padding: 0 5px; border-radius: 4px; overflow: hidden;">
																		<a href="#">
																			<img src="cid:instagram-icon.png" width: "17" height="17" style="display: block; width: 17px; height: 17px;" />
																		</a>
																	</td>
																</tr>
															</table>
														</td>
													</tr>
													<tr>
														<td height="13">&nbsp;</td>
													</tr>
													<tr>
														<td  class="text-footer" style="font-size: 10px; font-weight: 500; color: #fff; text-align: center; line-height: 14px;">
															You are receiving this email because you signed up for Streambed updates. 
															If you no longer wish to receive these emails you can 
															<a href="#" style="text-decoration: underline; color: #fff;">unsubscribe</a> from this list at any time.
														</td>
													</tr>
													<tr>
														<td  class="text-footer" style="font-size: 10px; font-weight: 500; color: #fff; text-align: center; line-height: 14px;">
															Please familiarize yourself with our 
															<a href="#" style="text-decoration: underline; color: #fff;">Terms</a> of Use and 
															<a href="#" style="text-decoration: underline; color: #fff;">Privacy Policy</a>.
														</td>
													</tr>
													<tr>
														<td height="13">&nbsp;</td>
													</tr>
													<tr>
														<td  class="text-footer" style="font-size: 10px; font-weight: 500; color: #fff; text-align: center; line-height: 14px;">
															Streambed is brought to you by Streambed Media Inc.
														</td>
													</tr>
													<tr>
														<td  class="text-footer" style="font-size: 10px; font-weight: 500; color: #fff; text-align: center; line-height: 14px;">
															Copyright © 2020 Streambed Media. All rights reserved.
														</td>
													</tr>
													<tr>
														<td  class="text-footer" style="font-size: 10px; font-weight: 500; color: #fff; text-align: center; line-height: 14px;">
															Streambed and related logos and designs are trademarks of Streambed Media.
														</td>
													</tr>
													<tr>
														<td  class="text-footer" style="font-size: 10px; font-weight: 500; color: #fff; text-align: center; line-height: 14px;">
															145 O’Carroll Ave, Peterborough, ON, Canada.
														</td>
													</tr>
													<tr>
														<td height="15">&nbsp;</td>
													</tr>
												</table>
											</td>
										</tr>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
</html>`,
    attachments: [
      {
        filename: "logo.png",
        type: "image/png",
        size: "9 kB",
        base64:
          "data:image/png;base64,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",
        file: {},
        path: __dirname + "/logo.png",
        cid: "logo.png",
      },
      {
        filename: "twitter-icon.png",
        type: "image/png",
        size: "6 kB",
        base64:
          "data:image/png;base64,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",
        file: {},
        path: __dirname + "/images/twitter-icon.png",
        cid: "twitter-icon.png",
      },
      {
        filename: "instagram-icon.png",
        type: "image/png",
        size: "4 kB",
        base64:
          "data:image/png;base64,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",
        file: {},
        path: __dirname + "/images/instagram-icon.png",
        cid: "instagram-icon.png",
      },
      {
        filename: "linkedin-icon.png",
        type: "image/png",
        size: "6 kB",
        base64:
          " data:image/png;base64,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",
        file: {},
        path: __dirname + "/images/linkedin-icon.png",
        cid: "linkedin-icon.png",
      },
    ],
  });
};
