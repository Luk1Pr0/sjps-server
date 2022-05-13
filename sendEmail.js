const res = require('express/lib/response');
const nodemailer = require('nodemailer');

const sendEmails = async (fullName, userEmail, message) => {

	const transporter = nodemailer.createTransport({
		service: "SendinBlue",
		auth: {
			user: process.env.NODEMAILER_USER,
			pass: process.env.NODEMAILER_PASS,
		}
	});

	const mailOptions = {
		from: { name: 'Polska Szkoła im. Św. Siostry Faustyny Kowalskiej', address: "szkolajezykapolskiegoslough@gmail.com" },
		to: process.env.MASTER_EMAIL || 'lpytel15@gmail.com',
		subject: `${fullName} wypelnil formularz kontaktowy na stronie`,
		text: `${fullName} wyslal wiadomosc ${message}`,
		html: `<span><p><strong>${fullName}</strong> wyslal wiadomosc o tresci:</p>${message}</span>`,
	};

	const responseMailOptions = {
		from: { name: 'Polska Szkoła im. Św. Siostry Faustyny Kowalskiej', address: "szkolajezykapolskiegoslough@gmail.com" },
		to: userEmail,
		subject: `Twój formularz został wysłany`,
		text: `Dziękujemy za wypełnienie formularza. Będziemy w kontakcie najszybciej jak to będzie możliwe.`,
		html: `
		<span>Dziękujemy <strong>${fullName}</strong> za wypelnienie formularza.
		<br/><br/>
		Będziemy w kontakcie najszybciej jak to będzie możliwe. :)</span>
		<br/><br/>
		Pozdrawiamy,
		<br/><br/>
		Zespół Polskiej Szkoły im. Św Siostry Faustyny Kowalskiej
		`,
	};

	try {
		// SEND EMAIL TO POLSKA SZKOLA EMAIL ADDRESS
		await transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error);
			}
			console.log(info);
			return;
		});

		// SEND EMAIL TO USER SAYING FORM HAS BEEN SUBMITTED
		await transporter.sendMail(responseMailOptions, (error, info) => {
			if (error) {
				console.log(error);
			}
			console.log(info);
			return;
		});
	} catch (error) {
		return error;
	}

}


module.exports = sendEmails;