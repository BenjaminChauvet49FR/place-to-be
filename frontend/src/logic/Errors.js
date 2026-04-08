export default class Error404 extends Error {
  constructor(message) {
    super(message); // appelle le constructeur de Error
    this.name = "Error404"; // nom de l'erreur
  }
}
