const onUserCreate = async (user) =>
  new Promise((resolve, reject) => {
    if (!user.email || !user.password) {
      resolve();
    }
    admin
      .auth()
      .createUser({ email: user.email, password: user.password })
      .then(function (userRecord) {
        const clintRef = db.doc(`/clients/${userRecord.uid}`);
        const userPassword = ''+user.password
        delete user.password;
        clintRef.set({ ...user, id: userRecord.uid });
        functions.logger.log(`Client "${userRecord.uid}" created successfully`);
        functions.logger.log(`Client "${user.name}" created successfully`);
        functions.logger.log(`Sending email`);
        sentEmail({ email: user.email, password: userPassword });
        resolve(userRecord.uid);
      })
      .catch(function (error) {
        functions.logger.error("Error creating new user:", error);
        resolve();
      });
  }); 

exports.welcomeEmail = functions.firestore
  .document("createdClients/{createdClientId}")
  .onCreate(async (snap) => {
    try {
      const user = snap.data();
      await onUserCreate(user);
      return;
    } catch (error) {
      functions.logger.error(error);
    }
  });

const sentEmail = async ({ email, password }) => { 
  const mailOptions = {
    from: '"Mezclas Esenciales." <noreply@mezclasesenciales.cl>',
    to: email,
  };
  mailOptions.subject = "Mezclas Esenciales - Accesos";
  mailOptions.text = `
    Hola!\n
    Bienveni@ a Mezclas Esenciales, acá están tus accesos a nuestra aplicación:\n\n
    Usuario: ${email}\n
    Contraseña: ${password}\n\n
  `;
  try {
    await mailTransport.sendMail(mailOptions);
    functions.logger.log("Access email sent to:", email);
  } catch (error) {
    functions.logger.error(
      "There was an error while sending the email:",
      error
    );
  }
  return null;
};