const nodemailer = require('nodemailer');

const sendEmails = async (userFullName, userEmail, message) => {

	// DETAILS USED TO SEND THE EMAILS
	const transporter = nodemailer.createTransport({
		service: "SendinBlue",
		auth: {
			user: process.env.NODEMAILER_USER,
			pass: process.env.NODEMAILER_PASS,
		}
	});

	// OPTIONS FOR SENDING TO THE ADMIN
	const mailOptions = {
		// FROM THE USER SUBMITTING THE FORM
		from: { name: userFullName, address: userEmail },
		// MASTER_EMAIL IS THE EMAIL OF THE ADMIN
		to: process.env.MASTER_EMAIL || 'lpytel15@gmail.com',
		subject: `${userFullName} wypelnil formularz kontaktowy na stronie`,
		text: `${userFullName} wyslal wiadomosc ${message}`,
		html: `<span><p><strong>${userFullName}</strong> wyslal wiadomosc o tresci:</p>${message}</span>
			<br/></br/>
			Odpisz na email: ${userEmail}
		`,
	};

	// RESPONSE SENT TO THE USER CONFIRMING EMAIL BEING SENT
	const responseMailOptions = {
		// SEND FROM THE EMAIL ACCOUNT OF ADMIN
		from: { name: 'Polska Szkoła im. Św. Siostry Faustyny Kowalskiej', address: "szkolajezykapolskiegoslough@gmail.com" },
		to: userEmail,
		subject: `Twój formularz został wysłany`,
		text: `Dziękujemy za wypełnienie formularza. Będziemy w kontakcie najszybciej jak to będzie możliwe.`,
		html: `
		<span>Dziękujemy <strong>${userFullName}</strong> za wypelnienie formularza.
		<br/><br/>
		Będziemy w kontakcie najszybciej jak to będzie możliwe. :)</span>
		<br/><br/>
		Pozdrawiamy,
		<br/><br/>
		Zespół Polskiej Szkoły im. Św Siostry Faustyny Kowalskiej
		`,
	};

	try {
		// SEND EMAIL TO ADMIN OF POLSKA SZKOLA WEBSITE
		await transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error);
				return false;
			}
			console.log(info);
			return true;
		});

		// SEND EMAIL TO USER SAYING FORM HAS BEEN SUBMITTED
		await transporter.sendMail(responseMailOptions, (error, info) => {
			if (error) {
				console.log(error);
				return false;
			}
			console.log(info);
			return true;
		});

	} catch (error) {
		console.log(error)
		return false
	}
}


module.exports = sendEmails;